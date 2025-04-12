# Section 2: User Management System

## Overview
This section covers the implementation of user authentication, profiles, administrative capabilities, and user activity tracking for the classified ads platform. It focuses on the user experience from registration through account management and administrative oversight. We will implement this using modern authentication practices, secure password storage with bcrypt, and JWT for session management.

## Tasks

### 2.1 User Authentication System
- [ ] Create `annonceurs` table with fields:
  - id_annonceur (PK)
nce   - nom, tel, mail
  - password (hashed with bcrypt)
  - etat_annonceur
  - date_creation
  - derniere_connexion
  - token_reset
  - token_expiration
- [ ] Create `activation_annonceur` table with fields:
  - id_activation (PK)
  - id_annonceur (FK)
nce   - nbr_activation
  - token_activation
  - date_creation
- [ ] Implement user registration process with email validation
- [ ] Develop secure login/logout functionality with JWT tokens
- [ ] Create password reset mechanism with time-limited tokens
- [ ] Implement email verification system
- [ ] Add protection against brute force attacks
- [ ] Implement GDPR-compliant data handling

### 2.2 User Profile Management
- [ ] Create user profile pages (site.com/profil/[id_annonceur])
- [ ] Implement profile editing functionality with avatar upload
- [ ] Develop responsive user dashboard for managing listings
- [ ] Create user statistics display (publications, views, interactions)
- [ ] Implement favorites/saved searches functionality
- [ ] Add notification system for listing activity
- [ ] Create public profile option with privacy settings

### 2.3 Admin System
- [ ] Create `admin` table with fields:
  - id_admin (PK)
  - pseudo_admin, pwd_admin (hashed with bcrypt)
  - droits_admin (role-based permissions)
  - email_admin
  - derniere_connexion
  - ip_connexion
- [ ] Implement secure admin authentication with 2FA option
- [ ] Develop responsive admin dashboard (site.com/admin)
- [ ] Create comprehensive user management interface for admins
- [ ] Implement content moderation tools with flagging system
- [ ] Create admin activity logs for accountability
- [ ] Implement batch operations for listings management
- [ ] Add analytics dashboard for site statistics

### 2.4 Messaging and Contact System
- [ ] Create `repertoire` table with fields:
  - id (PK)
  - nom, email
  - date_creation
  - statut
- [ ] Create `messages` table with fields:
  - id_message (PK)
  - id_expediteur (FK)
  - id_destinataire (FK)
  - sujet
  - contenu
  - date_envoi
  - lu (boolean)
  - supprime_exp (boolean)
  - supprime_dest (boolean)
- [ ] Create `abus` table with fields:
  - id_abus (PK)
  - id_annonce (FK)
  - id_signaleur (FK)
  - motif
  - description
  - date_signalement
  - statut
- [ ] Implement real-time internal messaging system
- [ ] Develop comprehensive abuse reporting mechanism
- [ ] Create notification system for new messages
- [ ] Implement message threading for conversations
- [ ] Add attachment capability for messages

### 2.5 Activity Logging
- [ ] Create `logaction` table with fields:
  - id (PK)
  - annonce_id
  - user_id
  - action
  - date_action
  - ip_address
  - user_agent
- [ ] Create `logcount` table with fields:
  - id (PK)
  - user_id
  - nb_pub, nb_supp
  - nb_vues
  - nb_contacts
  - derniere_mise_a_jour
- [ ] Create `logpay` table with fields:
  - id (PK)
  - user_id
  - somme
  - echeance
  - methode_paiement
  - reference_transaction
  - statut_paiement
  - date_paiement
- [ ] Implement comprehensive activity tracking system
- [ ] Develop secure payment tracking functionality
- [ ] Create interactive admin interface for viewing and filtering logs
- [ ] Implement analytics dashboard for user activity
- [ ] Add export functionality for logs and reports
- [ ] Create automated alerts for suspicious activities

## Dependencies
- Core database structure (for relationships with listings)
- Email service integration
- Payment processing system (for premium features)

## Completion Criteria
- User registration and authentication working correctly
- Admin panel fully functional
- User profiles accessible and editable
- Activity logging capturing all relevant actions
- Payment tracking system operational