-- Used to create the database if it does not already exist
CREATE DATABASE if not exists pudhub_DB CHARACTER SET utf8;

-- Creates the table displays in the database pudhub_DB if it does not exist already
CREATE TABLE if not exists pudhub_DB.displays(
  dspy_ip VARCHAR(45) NOT NULL PRIMARY KEY,
  dspy_name VARCHAR(25) NOT NULL,
  dspy_file VARCHAR(50) NOT NULL,
  dspy_timer INT NOT NULL,
  dspy_modified BIGINT NOT NULL
);

-- Creates the table pages in the database pudhub_DB if it does not exist already
CREATE TABLE if not exists pudhub_DB.pages(
  pages_path VARCHAR(50) NOT NULL PRIMARY KEY,
  pages_modified BIGINT NOT NULL
);

-- Creates the table styles in the database pudhub_DB if it does not exist already
CREATE TABLE if not exists pudhub_DB.styles(
  styles_path VARCHAR(50) NOT NULL PRIMARY KEY,
  styles_modified BIGINT NOT NULL
);

-- Creates the table scripts in the database pudhub_DB if it does not exist already
CREATE TABLE if not exists pudhub_DB.scripts(
  scripts_path VARCHAR(50) NOT NULL PRIMARY KEY,
  scripts_modified BIGINT NOT NULL
);

-- Creates the table medias in the database pudhub_DB if it does not exist already
CREATE TABLE if not exists pudhub_DB.medias(
  medias_path VARCHAR(75) NOT NULL PRIMARY KEY,
  medias_modified BIGINT NOT NULL
);

-- dummy data
use pudhub_DB

insert into pages (pages_path, pages_modified) values ('/pages/default-display.html', 1500000000);
insert into pages (pages_path, pages_modified) values ('/pages/info-display-vertical.html', 1500000000);
insert into pages (pages_path, pages_modified) values ('/pages/info-display-horizontal.html', 1500000000);
insert into pages (pages_path, pages_modified) values ('/pages/video-display-horizontal.html', 1500000000);

insert into styles (styles_path, styles_modified) values ('/styles/root.css', 1500000000);
insert into styles (styles_path, styles_modified) values ('/styles/default-vertical.css', 1500000000);
insert into styles (styles_path, styles_modified) values ('/styles/default-horizontal.css', 1500000000);

insert into scripts (scripts_path, scripts_modified) values ('/scripts/root.js', 1500000000);
insert into scripts (scripts_path, scripts_modified) values ('/scripts/info-display-vertical.js', 1500000000);
insert into scripts (scripts_path, scripts_modified) values ('/scripts/info-display-horizontal.js', 1500000000);
insert into scripts (scripts_path, scripts_modified) values ('/scripts/video-display-horizontal.js', 1500000000);

insert into medias (medias_path, medias_modified) values ('/medias/pud_hub.png', 1500000000);
insert into medias (medias_path, medias_modified) values ('/medias/uop-logo-linear.jpg', 1500000000);
insert into medias (medias_path, medias_modified) values ('/medias/uop-logo-stacked.jpg', 1500000000);
insert into medias (medias_path, medias_modified) values ('/medias/warning-icon.png', 1500000000);
