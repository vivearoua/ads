<?php
error_reporting(E_WARNING | E_ERROR);
header('Content-Type: text/html; charset=utf-8');
include('common/config.php');

function logMessage($message) {
    $logFile = __DIR__ . '/debug.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

logMessage("Script started");

$message_erreur = [];
$champ_obligatoires_vides = [];
$data_to_insert = [];

if (!is_numeric($_POST['ville_annonce'] ?? '')) {
    $champ_obligatoires_vides[] = 'q';
    $message_erreur[] = 'Vous avez mal choisi la ville! procédez par code postal';
    logMessage("Validation error: Invalid ville_annonce");
}

$tab_correspondance = [
    'titre_annonce' => 'titre_annonce',
    'taille' => 'taille',
    'desc_annonce' => 'descriptif_annonce',
    'cat_annonce' => 'id_categorie',
    'sous_cat_annonce' => 'id_sous_categorie',
    'marque_annonce' => 'marque',
    'couleur_annonce' => 'couleur',
    'energie_annonce' => 'energie',
    'puissance_annonce' => 'puissance',
    'annee_annonce' => 'annee',
    'km_annonce' => 'kilometrage',
    'surface_annonce' => 'surface',
    'meuble' => 'meuble',
    'type_service_id' => 'type_service_id',
    'modele_annonce' => 'modele_id',
    'prix_annonce' => 'prix_annonce',
    'id_annonceur' => 'id_annonceur',
    'img_m' => 'img_m',
    'img_1' => 'img_1',
    'img_2' => 'img_2',
    'img_3' => 'img_3',
    'img_4' => 'img_4',
    'gouvernerat_annonce' => 'gouvernorat',
    'ville_annonce' => 'ville',
    'nom_annonceur' => 'nom',
    'tel_annonceur' => 'tel',
    'mail_annonceur' => 'mail',
    'pass_annonceur' => 'password',
    'date_publication' => 'date_publication',
    'url_annonce' => 'url_annonce',
    'active_annonceur' => 'active_annonceur'
];

function save($conn, $table, $data, $tab_correspondance) {
    logMessage("Entering save function for table: $table");
    logMessage("Data to insert: " . json_encode($data));

    $insert_data = array_diff_key($data, ['id_annonce' => '']);
    $columns = implode(',', array_map(fn($k) => $tab_correspondance[$k], array_keys($insert_data)));
    $placeholders = implode(',', array_fill(0, count($insert_data), '?'));
    $sql = "INSERT INTO $table ($columns) VALUES ($placeholders) RETURNING id_annonce"; // PostgreSQL-specific

    logMessage("SQL Query: $sql");
    logMessage("Values: " . json_encode(array_values($insert_data)));

    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute(array_values($insert_data));
        $lastId = $stmt->fetchColumn(); // Fetch the returned id_annonce
        logMessage("Insert successful, last ID: $lastId");
        return $lastId;
    } catch (PDOException $e) {
        logMessage("Insert failed: " . $e->getMessage());
        throw $e;
    }
}

function clean_url($str, $charset = 'ISO-8859-1') {
    $str = htmlentities($str, ENT_NOQUOTES, $charset);
    $str = strtolower(trim($str));
    $str = trim(preg_replace('#&([A-za-z])(?:acute|cedil|circ|grave|orn|ring|slash|th|tilde|uml);#', '\1', $str));
    $str = trim(preg_replace('#&([A-za-z]{2})(?:lig);#', '\1', $str));
    $str = trim(preg_replace('#&[^;]+;#', '', $str));
    $str = preg_replace('/[^a-z0-9-]/', '-', $str);
    $str = preg_replace('/-+/', "-", $str);
    $str = rtrim($str, '-');
    return $str;
}

function check_mail_($conn, $mail) {
    $stmt = $conn->prepare("SELECT COUNT(mail) as nb, id_annonceur, nom, etat_annonceur, mail, password FROM annonceurs WHERE mail = ?");
    $stmt->execute([$mail]);
    return $stmt->fetch(PDO::FETCH_ASSOC) ?: false;
}

function add_url($conn, $table, $data, $tab_correspondance, $id_annonce) {
    $set_clause = implode(',', array_map(fn($k) => "{$tab_correspondance[$k]}=?", array_keys($data)));
    $sql = "UPDATE $table SET $set_clause WHERE id_annonce=?";
    logMessage("Update URL SQL: $sql");
    logMessage("Update data: " . json_encode(array_merge(array_values($data), [$id_annonce])));
    $stmt = $conn->prepare($sql);
    $stmt->execute(array_merge(array_values($data), [$id_annonce]));
}

if (!isset($_SESSION['user_blocked'])) { $_SESSION['user_blocked'] = array(); }
$ip = $_SERVER['HTTP_CLIENT_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'];
if (strlen($ip) > 2 && in_array($ip, $_SESSION['user_blocked'])) {
    $tab_post_return[2] = ['Vous n\'êtes pas autorisés à publier sur le site!'];
    $tab_post_return[0] = ['titre_annonce' => ''];
    $_SESSION['post'] = $tab_post_return;
    logMessage("User blocked: IP $ip");
    header('Location: publier-annonce.php');
    exit(0);
}

if (!empty($_POST)) {
    logMessage("POST data received: " . json_encode($_POST));
    unset($_POST['save'], $_POST['q']);
    $hasBadWords = 'F';
    require_once('PhpBadWords.php');
    $objChecker = new PhpBadWords();
    $objChecker->setDictionaryFromFile(__DIR__ . "/doClean.txt");
    $objChecker->setText(htmlentities($_POST['titre_annonce'] . ' ' . $_POST['desc_annonce']));
    $hasBadWords = $objChecker->check() ? 'T' : 'F';
    if ($hasBadWords != 'F') {
        $message_erreur[] = 'Votre annonce a été refusée...';
        $_SESSION['user_blocked'][] = $ip;
        $_SESSION['user_blocked'] = array_filter($_SESSION['user_blocked']);
        logMessage("Bad words detected, user blocked: IP $ip");
    }

    $tab_common0 = ['titre_annonce', 'desc_annonce'];
    foreach ($tab_common0 as $field) {
        if (empty(trim($_POST[$field] ?? ''))) {
            $champ_obligatoires_vides[] = $field;
            $message_erreur[] = 'Champs titre et descriptif sont obligatoires.';
        } else {
            $data_to_insert[$field] = trim($_POST[$field]);
        }
    }

    $tab_common1 = ['cat_annonce', 'sous_cat_annonce'];
    foreach ($tab_common1 as $field) {
        if (empty(trim($_POST[$field] ?? '')) || !is_numeric(trim($_POST[$field]))) {
            $champ_obligatoires_vides[] = $field;
            $message_erreur[] = 'Le choix de catégorie et sous-catégorie est obligatoire.';
        } else {
            $data_to_insert[$field] = trim($_POST[$field]);
        }
    }

    $data_to_insert['date_publication'] = date("Y-m-d");
    $data_to_insert['url_annonce'] = site_url . 'annonce/' . clean_url($data_to_insert['titre_annonce']);
    $data_to_insert['active_annonceur'] = 'F';

    if (empty($message_erreur)) {
        try {
            $id_annonce = save($conn, 'annonces', $data_to_insert, $tab_correspondance);
            $url_data = ['url_annonce' => $data_to_insert['url_annonce'] . '-be' . $id_annonce . '.html'];
            add_url($conn, 'annonces', $url_data, $tab_correspondance, $id_annonce);
            $_SESSION['success'] = 'success';
            logMessage("Ad saved successfully, ID: $id_annonce");
        } catch (PDOException $e) {
            logMessage("Save operation failed: " . $e->getMessage());
            $_SESSION['post'] = [$data_to_insert, $champ_obligatoires_vides, [$e->getMessage()]];
        }
    } else {
        $_SESSION['post'] = [$data_to_insert, $champ_obligatoires_vides, $message_erreur];
        logMessage("Validation errors: " . json_encode($message_erreur));
    }
}
logMessage("Script completed, redirecting");
header('Location: publier-annonce.php');
exit(0);
?>
