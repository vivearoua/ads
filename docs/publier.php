<?php
include('common/config.php');
error_reporting(0);
if (!isset($_SESSION['user_blocked'])) { $_SESSION['user_blocked'] = array(); }
$ip = $_SERVER['HTTP_CLIENT_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'];
if (in_array($ip, $_SESSION['user_blocked']) && strlen($ip) > 2) { $do_block = true; }
$page_publier = true;
$the_post = $_SESSION['post'][0] ?? [];
if (is_array($the_post)) {
    $acceptedvalues = array_map(fn($k, $v) => "$k:\"$v\"", array_keys($the_post), $the_post);
    $acceptedvalues = implode(',', $acceptedvalues);
    $alerte = $_SESSION['post'][2][0] ?? '';
    $tab_fields = implode(',', $_SESSION['post'][1] ?? []);
    unset($_SESSION['post']);
}
$h1 = "Publier votre annonce gratuitement en Belgique - vendre";
$stmt = $conn->query("SELECT id_categorie, url_categorie, libelle_categorie FROM categories");
$tab_cat = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
$stmt = $conn->query("SELECT id_gouvernorat, libelle_gouvernorat FROM gouvernorats_be");
$tab_region = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
$stmt = $conn->query("SELECT id, libelle_type_service FROM type_service");
$tab_serv = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
$stmt = $conn->query("SELECT id_marque, libelle_marque, url_marque, categorie_marque FROM marques");
$tab_Brand = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Publier une annonce en Belgique</title>
<meta name="description" content="Passer une annonce gratuite avec Les Annonces - déposer gratuitement une petite annonce en Belgique, rapide et simple pour vendre une voiture ou louer une maison en Belgique" />
<?php include('common/head.php'); ?>
<link rel="shortcut icon" href="./charte/images/favicon.ico" />
<style type="text/css">
.nn_common {
	display:none;
}
.invalid_field {
	border-color:red;
}
</style>

<style>
.photo{
background-color: #EAF1F9;
padding:3px;
margin-right:5px;
border: 1px solid #eee;
float:left;
text-align:center;
font-size:12px;
}
.photo img
{
margin-bottom:10px;


}
.photo a
{
color: #b2b2b2;
}

.photo a:hover
{
text-decoration:underline;
color: #CC0000;
}
/****/
.clear {
	clear: both;
	padding: 0px;
	margin: 0px;
	height: 0px;
}

div.container {
	position: relative;
}

div.container div.searchtop {
	position: relative;
	z-index: 100;
}

div.container div.overlay {
	display: none;
	position: absolute;
	background: #FFFFFF;
	-moz-border-radius: 5px;
	-khtml-border-radius: 5px;
	border-radius: 5px;
	top: 0px;
	left: 0px;
	width: 100%;
}

div.container div.overlay img {
	margin-left: 80px;
}
div.container div#search_preview{
	background-color: #FFF9F0;
	position: absolute;
	width:300px;
	}

div.container div#search_preview ul {
	list-style: none;
	margin: 0px;
	padding: 3px 6px;

}

div.container div#search_preview ul li {
	margin-bottom: 20px;
	line-height: 120%;
}

div.container div#search_preview ul li a {
	display: block;
	color: #000;
}

div.container div#search_preview ul li span {
	display: block;
	color: #999;
	font-size: 9pt;
}

div.container div#search_preview ul li em {
	display: block;
	color: #080;
	font-size: 9pt;
}
/****/
</style>
</head>
<body>
<?php include('common/top-header.php'); ?>
<div id="page-content">
  <?php include('common/header.php'); ?>
  <?php include('common/menu.php'); ?>
  <div id="content">
    <div class="clear"></div>
    <div class="page_complete">
      <h2>Publier une annonce gratuite en Belgique</h2>
      <?php if($_SESSION['success']=='success'){ ?>
      <div class="success" on>Votre annonce a été bien enregistrée. <b>Veuillez valider votre compte depuis votre <u>boîte de réception E-mail</u></b>.</div>
      <script>setTimeout("window.location='https://www.les-annonces.be/'",8000);</script>
      <?php unset($_SESSION["success"]); } ?>

      <form class="form_depo" name="inscription" onsubmit="if(!isNumber($('#ville_annonce').val())){$('#zip').focus();}" method="post" action="publier_s.php" >
      <?php if($alerte!=NULL && $alerte!='') { ?><div class="error" style="font-size:12px;"><?php echo $alerte ; ?></div><?php } ?>
      <?php if($do_block) { ?><div class="error" style="font-size:12px;"><strong>Vous n'êtes pas autorisés à publier sur le site!</strong></div><?php } ?>
      <?php if(!$do_block): ?>
        <table class="table-publier">
          <tr id="tr_titre_annonce">
            <td><label class="label_depo">Titre &nbsp;&nbsp;: </label>
              <div class="espace_vertical"></div></td>
            <td><input class="text_depo w300" type="text" name="titre_annonce" id="titre_annonce" value="<?php echo stripslashes($the_post['titre_annonce']);?>" maxlength="100" required="required" /> </td>
            <td class="td-tooltip"><div class="tooltips">Un titre bien clair permet d'obtenir 15 fois plus de visites.
                Ex: <span class="red"><s>Voiture à vendre</s></span> , <span class="green">Wolkswagen Golf 5 essence à Bruxelles</span></div></td>
          </tr>
          <tr>
          <td>
		  	<label class="label_depo">Ville   : </label>
			<div class="espace_vertical"></div>
          </td>
          <td>
          <div class="container">
<div class="overlay"></div>
	<div class="searchtop">
		<div class="searchbox" onclick="$(this).find('input').focus();">
			<div>
				<a></a>
				<span id="ipreloader" ></span>
				<input name="q" autocomplete="off" value="" id="zip"  class="text_depo w300" required="required" >
                <input id="ville_annonce" name="ville_annonce"  class="text_depo w200" required type="hidden" >
			</div>
		</div>
	</div>
	<div id="search_preview"></div>
</div>
</td>
<td class="td-tooltip"><div class="tooltips" style="background:#C9DDFC; border:1px solid #A1BFED; color: #4187DE;"> Taper le <b>code postal</b> ou le <b>nom de la ville</b> de votre annonce</div>
</td>
          </tr>
          <tr id="tr_desc_annonce">
            <td><label class="label_depo">Description &nbsp;&nbsp;:</label></td>
            <td><textarea class="text_depo textarea_depo" name="desc_annonce" id="desc_annonce" required="required" onkeydown="if(!isNumber($('#ville_annonce').val())){$('#zip').focus();}"><?php echo  stripslashes($the_post['desc_annonce']) ; ?></textarea></td>
            <td class="td-tooltip">
               <div class="tooltips">Votre description doit avoir entre <b>100</b> et <b>1000 caractères</b>.<br />
                Veillez à la bonne description de votre produit/service.</div>
                <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
				<!-- LAn-Liens-Publier -->
				<ins class="adsbygoogle"
					 style="display:block"
					 data-ad-client="ca-pub-9582901796643932"
					 data-ad-slot="8125353565"
					 data-ad-format="link"></ins>
				<script>
				(adsbygoogle = window.adsbygoogle || []).push({});
				</script>
         	</td>
          </tr>
          <tr id="tr_cat_annonce">
            <td><label class="label_depo">Catégorie &nbsp;&nbsp;:</label></td>
            <td><select id="cat_annonce" name="cat_annonce" class="text_depo w250" required >
                <option value="">Choisir une catégorie</option>
                <?php
				foreach($tab_cat as $cle =>$val){
					echo '<option value="'.$val['id_categorie'].'"'.'>'.$val['libelle_categorie'].'</option>';
				}
				?>
              </select> <span class="blink">*</span></td>
            <td></td>
          </tr>
          <tr id="tr_sous_cat_annonce" class="nn_common">
            <td><label class="label_depo">Sous-Catégorie &nbsp;&nbsp;:</label></td>
            <td><select id="sous_cat_annonce" name="sous_cat_annonce" class="text_depo w250" required >
                <option value="">Choisir une option</option>
              </select> <span class="blink">*</span></td>
            <td></td>
          </tr>
          <tr id="tr_marque_annonce" class="nn_common">
            <td><label class="label_depo">Marque &nbsp;&nbsp;:</label></td>
            <td><select id="marque_annonce" name="marque_annonce"  class="text_depo w200" >
                <option value="">Choisir une option</option>
              </select></td>
            <td></td>
          </tr>
          <tr id="tr_modele" class="nn_common">
            <td><label class="label_depo">Modele &nbsp;&nbsp;:</label></td>
            <td id="td_modele"><select id="modele_annonce" name="modele_annonce"  class="text_depo w200" >
                <option value="0">Choisir une option</option>
              </select>
              </td>
            <td></td>
          </tr>
          <tr id="tr_couleur_annonce" class="nn_common">
            <td><label class="label_depo">Couleur &nbsp;&nbsp;:</label></td>
            <td><select id="couleur_annonce" name="couleur_annonce"  class="text_depo w200" >
                <option value="">Choisir une couleur</option>
            <option value="blanc">Blanc </option>
            <option value="noir">Noir </option>
            <option value="gris">Gris </option>
            <option value="beige">Beige </option>
            <option value="bleu">Bleu </option>
            <option value="jaune">Jaune </option>
            <option value="rouge">Rouge </option>
            <option value="vert">Vert </option>
            <option value="orange">Orange </option>
            <option value="marron">Marron </option>
            <option value="rose">Rose </option>
            <option value="violet">Violet </option>
              </select></td>
            <td></td>
          </tr>
          <tr id="tr_energie_annonce" class="nn_common">
            <td><label class="label_depo">Énergie&nbsp;&nbsp;:</label></td>
            <td><select id="energie_annonce" name="energie_annonce"  class="text_depo w200" >
                <option value="">Choisir une option</option>
                <option value="Essence">Essence</option>
                <option value="Diesel">Diesel</option>
                <option value="GPL">GPL</option>
                <option value="Electrique">Electrique</option>
              </select></td>
            <td></td>
          </tr>
          <tr id="tr_puissance_annonce" class="nn_common">
            <td><label class="label_depo">Puissance &nbsp;&nbsp;:</label></td>
            <td>
            <select  id="puissance_annonce" name="puissance_annonce"  class="text_depo w200"  >
        	<option value="">Puissance</option>
            <optgroup label="FISCALE" class="puissanceLabel">
                <option value="1,2,3">Moins de 4CV</option>
                <option value="4,5,6">De 4CV à 6CV</option>
                <option value="7,8,9">De 7CV à 9CV</option>
                <option value="10,11,12">De 10CV à 12CV</option>
                <option value="&gt;=13">13CV et plus</option>
            </optgroup>
            <optgroup label="DIN">
                <option value="-1|80">Moins de 80 ch</option>
                <option value="80|100">De 80 ch à 100 ch</option>
                <option value="100|140">De 100 ch à 140 ch</option>
                <option value="140|160">De 140 ch à 160 ch</option>
                <option value="160|190">De 160 ch à 190 ch</option>
                <option value="190|250">De 190 ch à 250 ch</option>
                <option value="250|-1">250 ch et plus</option>
                            </optgroup>
        </select>
            </td>
            <td></td>
          </tr>
          <tr id="tr_annee_annonce" class="nn_common">
            <td><label class="label_depo">Année&nbsp;&nbsp;:</label></td>
            <td><select id="annee_annonce" name="annee_annonce"  class="text_depo w200" >
                <option value="">Choisir une option</option>
                <?php for ($x=date('Y'); $x>date('Y')-50; $x--){
					echo '<option value="'.$x.'">'.$x.'</option>'."\n";
				}
				?>

              </select></td>
            <td></td>
          </tr>
          <tr id="tr_km_annonce" class="nn_common">
            <td><label class="label_depo">Kilométrage &nbsp;&nbsp;:</label></td>
            <td><input id="km_annonce" name="km_annonce" type="text"  class="text_depo w200" value="<?php echo  stripslashes($the_post['km_annonce']) ; ?>" > KM
              </td>
            <td></td>
          </tr>
          <tr id="tr_surface_annonce" class="nn_common">
            <td><label class="label_depo">Surface &nbsp;&nbsp;:</label></td>
            <td><input id="surface_annonce" name="surface_annonce"  class="text_depo w200" type="text"  value="<?php echo  stripslashes($the_post['surface_annonce']) ; ?>"> m²
            </td>
            <td></td>
          </tr>
          <tr id="tr_meuble_annonce" class="nn_common">
            <td><label class="label_depo">Meubl&eacute; &nbsp;&nbsp;:</label></td>
            <td><input type="radio" name="meuble" value="T" style="padding:3px 5px 0 0; margin:5px 3px 0 0;">oui
				<input type="radio" name="meuble" value="F" style="padding:3px 5px 0 10px; margin:5px 3px 0 10px;">non
                </td>
            <td></td>
          </tr>
          <tr id="tr_type_service_id" class="nn_common">
            <td><label class="label_depo">Type de service &nbsp;&nbsp;:</label></td>
            <td><select id="type_service_id" name="type_service_id"  class="text_depo w200">
            	<option value="">Choisir une option</option>
            	<?php
				foreach($tab_serv as $cle =>$val){
					echo '<option value="'.$val['id'].'"'.'>'.$val['libelle_type_service'].'</option>';
				}
				?>

<?php /*?>                <option value="Plombier">Plombier</option>
                <option value="Electricien">Electricien</option>
                <option value="Maintenance informatique">Maintenance informatique</option>
                <option value="Déménagement">Déménagement</option>
                <option value="Voyage">Voyage</option>
                <option value="Séjours">Séjours</option>
                <option value="Soin et Beauté">Soin et Beauté</option>
                <option value="Babysitting">Babysitting</option>
                <option value="Construction">Construction</option>
                <option value="Artisan">Artisan</option>
<?php */?>
			</select></td>
            <td></td>
          </tr>
          <tr id="tr_prix_annonce">
            <td><label class="label_depo">Prix&nbsp;&nbsp;:</label></td>
            <td><input type="text" name="prix_annonce" value="<?php  $s=explode(' ',trim( stripslashes($the_post['prix_annonce']))) ; echo $s[0]; ?>" id="prix_annonce"  class="text_depo w100" style="float:left;" />&euro;uro
            <input id="type_devise" name="type_devise" class="text_depo w70" type="hidden" style="float:left;" value="€"  >
 <span class="blink">*</span>
              <div id="par">
              </div>
            </td>
            <td></td>
          </tr>
          <tr id="tr_taille_annonce">
            <td><label class="label_depo">Taille&nbsp;&nbsp;:</label></td>
            <td><input type="text" name="taille" value="<?php  $s=explode(' ',trim( stripslashes($the_post['taille']))) ; echo $s[0]; ?>" id="taille_annonce"  class="text_depo w100" style="float:left;" />
              <div id="par">
              </div>
            </td>
            <td></td>
          </tr>


          <?php /*?><tr id="tr_photos_annonce" style="display:none">
            <td><label class="label_depo">Photos :</label></td>
            <td colspan="2">
             <div class="right_form" align="left">
             <span id="sp_imageerror" style="display:none;  color:#900; line-height:30px; padding-left:10px;">Mauvais type de fichier. Votre image doit être un fichier .jpg, .gif ou .png.</span>
             <div id="ddHide">
			 <div id="iframe"><iframe style="margin:0; margin-left:-110px; "  src="upload/index.php" frameborder="0" height="50" width="560px" scrolling="no" allowtransparency="true" id="frame"  name="uploadeframe"></iframe></div></div>
            </div>

			<div id="image"></div>
    <div id="input"></div>
     <input  id="index" name="index" type="hidden" value="1"  />

              </td>


          </tr><?php */?>
          <tr  id="div_photoimg">
              <td><label class="label_depo">Ajouter Photo</label></td>
              <td>
              	<div id="dZUpload" class="dropzone">
          			<div class="dz-default dz-message"></div>
        		</div>
        </td>
          </tr>


          <?php if(is_numeric($_SESSION['id_annonceur']) && $_SESSION['id_annonceur']>0){?>
		 <?php  }else{?>
          <tr id="tr_nom_annonceur" style="display:none">
            <td><label class="label_depo">Nom Annonceur&nbsp;&nbsp;:</label></td>
            <td><input type="text" name="nom_annonceur"  value="<?php echo  stripslashes($the_post['nom_annonceur']) ; ?>" id="nom_annonceur"  class="text_depo w200" required="required" /> </td>
            <td></td>
          </tr>
          <tr id="tr_tel_annonceur" style="display:none">
            <td><label class="label_depo">Telephone&nbsp;&nbsp;:</label></td>
            <td><input type="text" name="tel_annonceur"  value="<?php echo  stripslashes($the_post['tel_annonceur']) ; ?>" id="tel_annonceur"  class="text_depo w200" required="required" /> </td>
            <td></td>
          </tr>
          <tr id="tr_mail_annonceur" style="display:none">
            <td><label class="label_depo">Email&nbsp;&nbsp;:</label></td>
            <td><input type="email" name="mail_annonceur"  value="<?php echo  stripslashes($the_post['mail_annonceur']) ; ?>" id="mail_annonceur"  class="text_depo w200" required placeholder="email@domain@com" /> </td>
            <td></td>
          </tr>
          <tr id="tr_pass_annonceur" style="display:none">
            <td><label class="label_depo">Password&nbsp;&nbsp;:</label></td>
            <td><input type="password" name="pass_annonceur"  value="<?php echo  stripslashes($the_post['pass_annonceur']) ; ?>" id="pass_annonceur"  class="text_depo w200" required="required" /> </td>
            <td></td>
          </tr>
          <?php } ?>
           <tr id="tr_pass_annonceur" >
            <td>&nbsp;</td>
             <td><input type="submit" value="Envoyer l'annonce" name="save" class="submit" /></td>
            <td>&nbsp;
              </td>
          </tr>
          <hr />
        </table>
        <?php endif; ?>
      </form>

    </div>
    <div class="clear"></div>
    <?php include('footers/footer-publier.php'); ?>
    <script src="./charte/js/dropzone.min.js"></script>
  </div>
</div>
<script type="text/javascript">
$(document).ready(function(){
	setInterval(function(){
		var width = $('div.container').outerWidth();
		var height = $('div.container').outerHeight();
	}, '10000');

	function getSearchResults(q){
		$.get('suggestion/search_result.php', 'q='+encodeURIComponent(q), function(response){
			$('div#search_preview').html(response);
		});
	}

	// Set the iSuggest
	$('div.searchbox').find('input').iSuggest({
		url: 'suggestion/suggest.php',
		onType: function(query){
			getSearchResults(query);
		},
		onChange: function(query){
			getSearchResults(query);
		},
		onSelect: function(query){
			getSearchResults(query);
		},
		onSubmit: function(query){
			getSearchResults(query);
		},
		onEmpty: function(){
			getSearchResults('');
		}
	});
});
(function($) {

	// Begin the iSuggest plugin
	$.fn.iSuggest = function(settings) {

		// Settings
		settings = jQuery.extend({
			url: 'suggestion/suggest.php', // Suggestions results script.
			suggestsID: 'isuggest', // ID of the suggests container element.
			minLength: '2', // minimum length of search box to show suggestions.
			blurClass: 'fieldBlurred', // Class for when search box has been blured.
			activeClass: 'fieldActive', // Class for when search box has been focused.
			attribute: 'rel', // Search box default text attribute.
			topOffset: 4, // To extra spacing for suggests box from search box.
			onType: null, // Callback function on type time.
			onSelect: null, // Callback function for when a suggest has been selected.
			onChange: null, // Callback function for when a suggest has been changed.
			onSubmit: null, // Callback function for when search box has been submitted.
			onEmpty: null, // Callback function for when search box has been emptied.
			targetMode: '', // Search target mode.
			typeDelay: '250', // Type delay.
			searchURL: 'http://google.com/search?q=%s' // Set search query URL. URL with %s in place of query.
		}, settings);

		// loop each element
		return $(this).each(function() {

			// Append search suggests container
			$('body').append("<div id='"+settings.suggestsID+"'></div>");

			// Set variables
			var el = $(this),
			container = $('div#'+settings.suggestsID),
			remover = el.parent('div').find('a'),
			preloader = el.parent('div').find('img'),
			startPos = 0,
			timer = null;

			// Add or get attribute
			if(el.attr(settings.attribute) == undefined) {
				el.attr(settings.attribute, el.val()).addClass(settings.blurClass);
			}

			// Set search box cleaner action
			remover.click(function(){
				el.val('');
				$(this).hide();
				container.hide();
				if($.isFunction(settings.onEmpty)) settings.onEmpty();
			});

			// Set focus action
			el.focus(function() {
				if(el.val() == el.attr(settings.attribute)) {
					el.val('').removeClass(settings.blurClass).addClass(settings.activeClass);
				}

				if(settings.minLength<=el.val().length){
					container.show();
				}
			});

			// Set blur action
			el.blur(function() {
				if(el.val() == '') {
					el.val(el.attr(settings.attribute)).removeClass(settings.activeClass).addClass(settings.blurClass);
				}
				setTimeout(function(){ container.hide(); }, '200');
			});

			// Set suggests box Positioner & width adjustment
			function setPos(el){
				var width = el.parents('div.searchbox').outerWidth();
				var height = el.parents('div.searchbox').outerHeight();
				var top = el.parents('div.searchbox').offset().top+settings.topOffset;
				var left = el.parents('div.searchbox').offset().left;

				container.css({'width':width+'px', 'top':(top+height)+'px', 'left':left+'px'});
			}

			// Hightlisghts the text into text input from [startPos] up to the end
			function highlightText(d, startPos) {
				if(d.createTextRange) {
					var t = d.createTextRange();
					t.moveStart("character", startPos);
					t.select();
				}
				else if(d.setSelectionRange) {
					d.setSelectionRange(startPos, d.value.length);
				}
			}

			// The resize event handler
			$(window).resize(function(){
				setPos(el);
			});

			// Set mouseover action
			container.find('ul li').on('mouseover','a', function(){
					container.find('ul li a').removeClass('active');
			});

			// Set select callback
			if($.isFunction(settings.onSelect)) {
			container.find('ul li ').on('click','a', function(){
				el.val($(this).text());
				startPos = $(this).text().length;
				el.trigger('keyup').focus();
				settings.onSelect($(this).text());
				//return false;
			});
			}

			// Set keyup action
			el.keyup(function(e){
				var txt = el.val();
				var query = encodeURIComponent(txt);
				var goTo = settings.searchURL.replace('%s', query);
				var index = container.find('ul li a').index($('a.active'));
				var len = container.find('ul li a').length;

				setPos(el);
				clearTimeout(timer);
				container.find('ul li a').removeClass('active');

				if(e.keyCode=='38'){
					if(index<0) {
						var finder = container.find('ul li a:last');
					} else {
						var finder = container.find('ul li a').eq(index-1);
					}

					finder.addClass('active');
					el.val(finder.text());
					highlightText(e.target, startPos);
					if ($.isFunction(settings.onChange)) settings.onChange(finder.text());
				} else if(e.keyCode=='40'){
					if(index<0 || index==(len-1)) {
						var finder = container.find('ul li a:first');
					} else {
						var finder = container.find('ul li a').eq(index+1);
					}

					finder.addClass('active');
					el.val(finder.text());
					highlightText(e.target, startPos);
					if ($.isFunction(settings.onChange)) settings.onChange(finder.text());
				} else if(e.keyCode=='13'){
					if($.isFunction(settings.onSubmit)) {settings.onSubmit(txt);}
					else {
						if(settings.targetMode.toLowerCase()=='_blank') {
							window.open(goTo);
						} else {
							window.location.href = goTo;
						}
					}
				} else {
					if(txt.length==0) {
						remover.hide();
						if($.isFunction(settings.onEmpty)) settings.onEmpty();
					}
					else if(settings.minLength>txt.length) { remover.show(); container.hide(); }
					else {
						remover.show();
						startPos = txt.length;
						if(settings.minLength<=txt.length) timer = setTimeout(function() {
							preloader.show();
							$.get(settings.url, 'q='+query+'&target='+settings.targetMode+'&url='+encodeURIComponent(settings.searchURL), function(res) {
								if(res.length>3){
									container.show();
									container.html(res);
									preloader.hide();
								} else {
									preloader.hide();
									container.empty().hide();
								}
							});
						}, settings.typeDelay);

						if($.isFunction(settings.onType)) settings.onType(txt);
					}
				}
			});

		});

	};
})(jQuery);
function inArray(array, p_val) {
    var l = array.length;
    for(var i = 0; i < l; i++) {
        if(array[i] == p_val) {
            return true;
        }
    }
    return false;
}
function isNumericKeyCode (keyCode){
    return ( (keyCode >= 48 && keyCode <= 57) //standard keyboard
           ||(keyCode >= 96 && keyCode <= 105) || (keyCode == 110)|| (keyCode == 190)  || (keyCode == 8) || (keyCode == 46) ) //Numpad
}
jQuery.fn.firstPlugin = function () {
return this.each (function () {
alert (this.id);
});
}
function common_controle(){
		/****change cat => change sub cat*************/
	$('#prix_annonce').keydown(function(e) {
		return 	isNumericKeyCode(e.keyCode);
	});
	$('#surface_annonce').keydown(function(e) {
		return 	isNumericKeyCode(e.keyCode);
	});
	$('#puissance_annonce').keydown(function(e) {
		return 	isNumericKeyCode(e.keyCode);
	});
	$('#km_annonce').keydown(function(e) {
		return 	isNumericKeyCode(e.keyCode);
	});
	$('#tel_annonceur').keydown(function(e) {
		return 	isNumericKeyCode(e.keyCode);
	});
}
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function sous_cat_change(){

	if($('#sous_cat_annonce').val()==39){
					$('#tr_taille_annonce').show();
	}else{
		$('#tr_taille_annonce').hide();
	}

			/* alert($('#cat_annonce').val()+$('#sous_cat_annonce').val());*/
			 if($('#cat_annonce').val()==3 && $('#sous_cat_annonce').val()==8){
					 $('#par').html('<select id="type_payement" class="text_depo w100" name="type_payement" >'+
					'<option value="/ jour"  selected="selected">/ jour</option>'+
					 '<option value="/ semaine">/ semaine</option>'+
				   ' <option value="/ mois">/ mois</option>'+
				  '</select>'
				  );

			 }else{
				 $('#par').html('');
			 }
			 if($('#cat_annonce').val()==2){
				if($('#sous_cat_annonce').val()==6){
				$('#tr_marque_annonce').hide();
				$('#tr_couleur_annonce').hide();
				$('#tr_puissance_annonce').hide();
				$('#tr_annee_annonce').hide();
				$('#tr_km_annonce').hide();

				}else{
				$('#tr_marque_annonce').show();
				$('#tr_couleur_annonce').show();
				$('#tr_puissance_annonce').show();
				$('#tr_annee_annonce').show();
				$('#tr_km_annonce').show();
				 }
			 }
			 if($('#cat_annonce').val()==1){
				if($('#sous_cat_annonce').val()==3){
				$('#tr_marque_annonce').hide();
				$('#tr_couleur_annonce').hide();
				$('#tr_energie_annonce').hide();
				$('#tr_puissance_annonce').hide();
				$('#tr_annee_annonce').hide();
				$('#tr_km_annonce').hide();
				$('#energie_annonce').attr("required", false);


				}else{
				$('#tr_marque_annonce').show();
				$('#tr_couleur_annonce').show();
				$('#tr_energie_annonce').show();
				$('#tr_puissance_annonce').show();
				$('#tr_annee_annonce').show();
				$('#tr_km_annonce').show();
				$('#energie_annonce').prop('required',true);
				 }
			 }
			 if($('#cat_annonce').val()==3 && $('#sous_cat_annonce').val()!=10){
					 $('#tr_meuble_annonce').show();
			 }
			 if($('#cat_annonce').val()==3 && $('#sous_cat_annonce').val()==10){
					 $('#tr_meuble_annonce').hide();
			 }


}
<?php if(is_numeric($_SESSION['id_annonceur']) && $_SESSION['id_annonceur']>0){?>
function gov_change(){

	/********change region =>change city***********/
		var xhrReq = $.ajax({type: "POST",  url: "function_ajax.php",data:{ id_ville: $("#gouvernerat_annonce").val(), action: "get_villes" } })
   		.done(function(e) {
			$('#ville_annonce').html(e);
		});
		$('#tr_ville_annonce').show();
		$('#tr_photos_annonce').show();
}

		 <?php  }else{?>
function gov_change(){

	/********change region =>change city***********/
		var xhrReq = $.ajax({type: "POST",  url: "function_ajax.php",data:{ id_ville: $("#gouvernerat_annonce").val(), action: "get_villes" } })
   		.done(function(e) {
			$('#ville_annonce').html(e);
		});
		$('#tr_ville_annonce').show();

		$('#tr_nom_annonceur').show();
		$('#tr_tel_annonceur').show();
		$('#tr_mail_annonceur').show();
		$('#tr_pass_annonceur').show();
		$('#tr_photos_annonce').show();
}
		 <?php } ?>

function get_sous_categories(){

if ($('#cat_annonce').val()>0){

		var xhrReq = $.ajax({type: "POST",  url: "function_ajax.php",data:{
		id_cat:$('#cat_annonce').val(),
		action: "get_sub_cat"
		}
		 })
   		.done(function(e) {

			$('#sous_cat_annonce').html(e);
			 $('#tr_sous_cat_annonce').show();
		});
		}
}
function show_hide_fields(){
	/********************get brand *****************/
		var xhrReq = $.ajax({type: "POST",  url: "function_ajax.php",data:{ id_cat: $('#cat_annonce').val(), action: "get_brand" } })
   		.done(function(e) {
			$('#marque_annonce').html(e);
		});
		$('#tr_prix_annonce').show();
		$('#tr_taille_annonce').hide();

		switch ($('#cat_annonce').val()) {
			case '1':  {
				$('#tr_marque_annonce').show();
				$('#tr_couleur_annonce').show();
				$('#tr_energie_annonce').show();
				$('#tr_puissance_annonce').show();
				$('#tr_annee_annonce').show();
				$('#tr_km_annonce').show();
				$('#tr_surface_annonce').hide();
				$('#tr_meuble_annonce').hide();
				$('#tr_type_service_id').hide();
				break;
				}

			case '2':  {
				$('#tr_marque_annonce').show();
				$('#tr_couleur_annonce').show();
				$('#tr_puissance_annonce').hide();
				$('#tr_annee_annonce').show();
				$('#tr_km_annonce').show();
				$('#tr_energie_annonce').hide();
				$('#tr_surface_annonce').hide();
				$('#tr_meuble_annonce').hide();
				$('#tr_type_service_id').hide();
			break;}
			case '3':  {
				$('#tr_marque_annonce').hide();
				$('#tr_couleur_annonce').hide();
				$('#tr_energie_annonce').hide();
				$('#tr_puissance_annonce').hide();
				$('#tr_annee_annonce').hide();
				$('#tr_km_annonce').hide();
				$('#tr_surface_annonce').show();
				$('#tr_meuble_annonce').show();
				$('#tr_type_service_id').hide();
			break;}
			case '4':  {
				$('#tr_marque_annonce').show();
				$('#tr_couleur_annonce').show();
				$('#tr_energie_annonce').hide();
				$('#tr_puissance_annonce').hide();
				$('#tr_annee_annonce').hide();
				$('#tr_km_annonce').hide();
				$('#tr_surface_annonce').hide();
				$('#tr_meuble_annonce').hide();
				$('#tr_type_service_id').hide();
			break;}
			case '5':  {
				$('#tr_marque_annonce').show();
				$('#tr_couleur_annonce').show();
				$('#tr_energie_annonce').hide();
				$('#tr_puissance_annonce').hide();
				$('#tr_annee_annonce').hide();
				$('#tr_km_annonce').hide();
				$('#tr_surface_annonce').hide();
				$('#tr_meuble_annonce').hide();
				$('#tr_type_service_id').hide();
			break;}
			case '6':  {
				$('#tr_marque_annonce').hide();
				$('#tr_couleur_annonce').hide();
				$('#tr_energie_annonce').hide();
				$('#tr_puissance_annonce').hide();
				$('#tr_annee_annonce').hide();
				$('#tr_km_annonce').hide();
				$('#tr_surface_annonce').hide();
				$('#tr_meuble_annonce').hide();
				$('#tr_type_service_id').hide();
			break;}
			case '7':  {
				$('#tr_marque_annonce').hide();
				$('#tr_couleur_annonce').hide();
				$('#tr_energie_annonce').hide();
				$('#tr_puissance_annonce').hide();
				$('#tr_annee_annonce').hide();
				$('#tr_km_annonce').hide();
				$('#tr_surface_annonce').hide();
				$('#tr_meuble_annonce').hide();
				$('#tr_type_service_id').hide();
			break;}
			case '8':  {
				$('#tr_marque_annonce').hide();
				$('#tr_prix_annonce').hide();
				$('#tr_couleur_annonce').hide();
				$('#tr_energie_annonce').hide();
				$('#tr_puissance_annonce').hide();
				$('#tr_annee_annonce').hide();
				$('#tr_km_annonce').hide();
				$('#tr_surface_annonce').hide();
				$('#tr_meuble_annonce').hide();
				$('#tr_type_service_id').hide();
			break;}
			case '9':  {
				$('#tr_marque_annonce').hide();
				$('#tr_couleur_annonce').hide();
				$('#tr_energie_annonce').hide();
				$('#tr_puissance_annonce').hide();
				$('#tr_annee_annonce').hide();
				$('#tr_km_annonce').hide();
				$('#tr_surface_annonce').hide();
				$('#tr_meuble_annonce').hide();
				$('#tr_type_service_id').show();
			break;}
			case '10': {
				$('#tr_marque_annonce').show();
				$('#tr_couleur_annonce').hide();
				$('#tr_energie_annonce').hide();
				$('#tr_puissance_annonce').hide();
				$('#tr_annee_annonce').hide();
				$('#tr_km_annonce').hide();
				$('#tr_surface_annonce').hide();
				$('#tr_meuble_annonce').hide();
				$('#tr_type_service_id').hide();
			break;}
			case '11': {
				$('#tr_marque_annonce').show();
				$('#tr_couleur_annonce').hide();
				$('#tr_energie_annonce').hide();
				$('#tr_puissance_annonce').hide();
				$('#tr_annee_annonce').hide();
				$('#tr_km_annonce').hide();
				$('#tr_surface_annonce').hide();
				$('#tr_meuble_annonce').hide();
				$('#tr_type_service_id').hide();
			break;}
			case '12': {
				$('#tr_marque_annonce').show();
				$('#tr_couleur_annonce').show();
				$('#tr_energie_annonce').hide();
				$('#tr_puissance_annonce').hide();
				$('#tr_annee_annonce').hide();
				$('#tr_km_annonce').hide();
				$('#tr_surface_annonce').hide();
				$('#tr_meuble_annonce').hide();
				$('#tr_type_service_id').hide();
			break;}
			case '13':
			case '14':
			default: {
				$('#tr_marque_annonce').hide();
				$('#tr_couleur_annonce').hide();
				$('#tr_energie_annonce').hide();
				$('#tr_puissance_annonce').hide();
				$('#tr_annee_annonce').hide();
				$('#tr_km_annonce').hide();
				$('#tr_surface_annonce').hide();
				$('#tr_meuble_annonce').hide();
				$('#tr_type_service_id').hide();
				$('#tr_sous_cat_annonce').hide();
			break;}
		}
}
$(document).ready(function(e) {

	common_controle();
	$('#tr_taille_annonce').hide();
			$('#marque_annonce').change(function(e) {
				if($('#marque_annonce').val()>0){
					var xhrReq = $.ajax({type: "POST",  url: "function_ajax.php",data:{ marque_id: $('#marque_annonce').val(), action: "get_models" } })
					.done(function(e) {
						$('#modele_annonce').html(e);
					});
				}
			});
    $('#cat_annonce').change(function(e) {
		get_sous_categories();
		/*********case location real estate************/
		 $('#sous_cat_annonce').change(function(e) {
		 sous_cat_change();
		 gov_change();
		});
		show_hide_fields();
		// réactiver modele , changer -1 par 1
		if($('#cat_annonce').val()==-1){$('#tr_modele').show();}else{$('#tr_modele').hide();}
	});
	$('#gouvernerat_annonce').change(function(e) {

		});
});

</script>
<script language="javascript" type="text/javascript">
function checkAlias(str)
{
	$.post('common/getalias.php',{ sendValue: str },
	function(data){
		if(1<=data.titre){
			alert('une annonce portant ce titre existe déja! , veuillez changer le titre de votre annonce , merci.');
			document.form_famille.titre.style.backgroundColor="#F7DADA";
			document.form_famille.titre.focus();
		}
	}, 'json');
}//fin checkAlias
function del_ph(ref)
{
	$('div.photo[ref='+ref+']').hide();
	$('input[ref='+ref+']').remove();
	$("#index").val($("#index").val()-1);
	if  ($("#index").val()=='5')
		$("#iframe").html('<iframe style="margin:0; margin-left:-110px; "  src="upload/index.php" frameborder="0" height="50" width="560px" scrolling="no" allowtransparency="true" id="frame"  name="uploadeframe"></iframe>');
}

function stopUpload(success, message, ref_ph){
	console.log(message);
	function Remplace(expr,a,b) {
      var i=0
      while (i!=-1) {
         i=expr.indexOf(a,i);
         if (i>=0) {
            expr=expr.substring(0,i)+b+expr.substring(i+a.length);
            i+=b.length;
         }
      }
      return expr;
   }
    var result = '';
    if (success == 1){
		$('#sp_imageerror').hide();
		result = '<div class="correct_sms">The file name is '+message+'!</div>';
		index=parseFloat(document.getElementById("index").value);

		refrech();
		img_source=message.replace(/-sp-/g, "/");
		var extension=img_source.substring(img_source.lastIndexOf("."));
		var miniature=Remplace(img_source,extension,'-85x68.jpg');
		document.getElementById('image').innerHTML=document.getElementById('image').innerHTML+' &nbsp;'+ '<div class="photo" ref="'+ref_ph+'"><img width="85" height="68" class="img" ref="" src="'+miniature+'"><br><a rel="supp" ref="'+ref_ph+'" onClick="del_ph(\''+ref_ph+'\')">Supprimer</a></div>';
		document.getElementById('input').innerHTML=document.getElementById('input').innerHTML+ '<input name="ph[]" type="hidden" value="'+img_source+'" ref="'+ref_ph+'"/>';

		if (index==4)
		{
			document.getElementById('iframe').innerHTML='Max 4 images autoris&eacute;es';
			document.getElementById('Image').innerHTML='&nbsp;';
		}else
		{
			document.getElementById("index").value=index+1;
		}
    }

    else if (success == 2){
		document.getElementById("sp_imageerror").innerHTML='Echec d\'envoi de fichier ! Veuillez réessayer.';
		$('#sp_imageerror').fadeIn(500);
		refrech();
         }
	else if (success == 3){
		document.getElementById("sp_imageerror").innerHTML='Type de fichier non autorisé ! Echec d\'envoi.';
		$('#sp_imageerror').fadeIn(500);
		refrech();
         }
	else if (success == 4){
		document.getElementById("sp_imageerror").innerHTML='Echec upload photo : Taille photo minimale 336px de largeur x 280px de hauteur.';
		$('#sp_imageerror').fadeIn(500);
		refrech();
         }
	else if (success == 5){
		document.getElementById("sp_imageerror").innerHTML='Photo uploaded avec succes ! Aucun appercu n\' est disponible.';
		$('#sp_imageerror').fadeIn(500);
		refrech();
         }


    return true;
}
function refrech()
{
parent.uploadeframe.location='index.php';
}
 $('#prix_annonce').keyup(function() {
        var $th = $(this);
        $th.val( $th.val().replace(/[^0-9]/g, function(str) {  return ''; } ) );
    });

$(document).ready(function () {
  //envoie image
    Dropzone.autoDiscover = false;
    var $dropZone= new Dropzone("#dZUpload", {
        url: "./ajax/envoiefichiers.php",
        paramName: "myfile",
		maxFiles:4,
        addRemoveLinks: true,
        dictRemoveFile:'Supprimer Photo',
        dictCancelUpload:'',
        error: function (file, response) {
            file.previewElement.classList.add("dz-error");
        },
    });
    $dropZone.on('success',function (file, response) {
      $(file.previewElement.querySelectorAll("[data-dz-name]")).remove();
      if(response.length>4){
        file.previewElement.classList.add("dz-success");
        $(file.previewTemplate).find('.dz-details').append('<link href="'+response+'">');
        $(file.previewTemplate).find('.dz-details').append('<input name="ph[]" type="hidden" value="'+response+'">');
      }else{
        file.previewElement.classList.add("dz-error");
        var msg='Echec envoie';
        if(response==4){
          msg='Image trop petite, taille min 336x280';
        }
        if(response==3){
          msg='Type autorisé jpg,jpeg,gif,png';
        }
        if(response==2){
          msg='Image endommagée';
        }
        $(file.previewTemplate).find('.dz-error-message').html(msg);
        $(file.previewTemplate).find('.dz-error-message').css('opacity','1');
        setTimeout(function(){ $dropZone.removeFile(file); }, 6000);
      }
    });
    $dropZone.on('removedfile', function(file) {
      var tmpChar='<div>'+$(file.previewTemplate).find('.dz-details').html()+'</div>div>' ;
      tmpChar=$(tmpChar).find('link').attr("href");
      $.ajax({
          url: "./ajax/del-img.php",
          type: "POST",
          data: { "img" : tmpChar }
      });
    });
	$dropZone.on('maxfilesexceeded', function(file) {
		  alert("Maximum 4 photos sont acceptées!");
    });
});
</script>
<?php

if($the_post['cat_annonce']>0){?>
<script language="javascript" type="text/javascript">
$(document).ready(function(e) {

var valeur =<?php echo $the_post['cat_annonce']; ?>;
$('#cat_annonce option[value='+valeur+']').attr("selected", "selected");
      // do something
get_sous_categories();
<?php
if($the_post['sous_cat_annonce']>0){?>
var valeurDeux =<?php echo $the_post['sous_cat_annonce']; ?>;
$('#sous_cat_annonce option[value='+valeurDeux+']').attr("selected", "selected");
sous_cat_change();
<?php }?>
show_hide_fields();
<?php
if($the_post['gouvernerat_annonce']>0){?>
gov_change();
<?php }?>
	var arr = [<?php echo $tab_fields; ?> ];
  $.each(arr, function(index, valuef) {
  $('#' + valuef).addClass('invalid_field');
});

var arr2 = {<?php echo $acceptedvalues; ?> };
  $.each(arr2, function(index1, value1) {
	  if($('#'+index1).is('select')){
		$('#' + index1 +' option[value="'+value1+'"]').attr("selected", "selected");
}
});
});

</script>
<?php
}
?>
</body>
</html>
