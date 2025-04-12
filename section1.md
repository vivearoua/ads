# Section 1: Core Database Structure

## Overview
This section focuses on implementing the fundamental database structure for the classified ads platform using PostgreSQL. The modern implementation includes:
- React frontend with TypeScript
- Tailwind CSS for responsive styling
- PostgreSQL backend with Prisma ORM
- REST API endpoints for data access
- Secure authentication with JWT tokens

## Tasks

### 1.1 Categories System
- [ ] Create `categories` table with fields:
  - id_categorie (PK)
  - url_categorie
  - libelle_categorie
- [ ] Create `sous_categories` table with fields:
  - id_sous_categorie (PK)
  - id_categorie (FK)
  - url_sous_categorie
  - libelle_sous_categorie
- [ ] Implement relationship between categories and subcategories
- [ ] Create indexes for efficient category lookups

### 1.2 Listings Management
- [ ] Create `annonces` table with fields:
  - id_annonce (PK)
  - id_annonceur (FK)
  - titre_annonce
  - description_annonce
  - prix
  - date_publication
  - etat_annonce
  - url_annonce
  - id_categorie, id_sous_categorie
  - gouvernorat, ville
  - Other specific attributes (marque, modele_id, type_service_id)
- [ ] Set up proper relationships with categories and subcategories
- [ ] Implement geographical relationships (gouvernorats_be, villes_be)
- [ ] Create indexes for search optimization

### 1.3 Metadata and Attributes
- [ ] Create supporting tables for specific attributes:
  - marques
  - modele
  - type_service
- [ ] Implement relationships with the main listings table
- [ ] Create validation rules for metadata

### 1.4 URL Structure Implementation
- [ ] Ensure URL structure follows pattern: site.com/[url_categorie]/[url_sous_categorie]
- [ ] Implement URL generation for listings: site.com/[url_annonce]
- [ ] Create URL validation and uniqueness checks
- [ ] Implement clean URL generation function based on existing `clean_url()` function
- [ ] Create URL redirection system for handling legacy URLs

### 1.5 Geographical Data Structure
- [ ] Create `gouvernorats_be` table with fields:
  - id_gouvernorat (PK)
  - libelle_gouvernorat
  - url_gouvernorat
- [ ] Create `villes_be` table with fields:
  - id_ville (PK)
  - libelle_ville
  - code_gouvernorat (FK)
  - url_ville
- [ ] Implement hierarchical relationship between regions and cities
- [ ] Create geographical search functionality

### 1.6 Search Optimization
- [ ] Implement full-text search capabilities using PostgreSQL's tsvector
- [ ] Create search indexes on frequently queried fields
- [ ] Implement faceted search for filtering by multiple criteria
- [ ] Create API endpoints for search functionality
- [ ] Develop caching strategy for frequent searches

## Dependencies
- Database server setup
- User management system (partial dependency for annonceur relationship)

## Test Data
- Added sample data for Annonce, Categorie and SousCategorie models
- Configured table mappings with @@map annotations

## Completion Criteria
- All tables created with proper relationships
- Test data successfully inserted
- Queries for listing categories and subcategories working correctly
- URL structure validated and functioning