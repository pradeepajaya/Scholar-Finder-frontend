INSERT INTO auth.users (email, password, role,is_active, is_verified)
VALUES ('colombo@uoc.lk', 'uoc','INSTITUTION', true, true)
RETURNING id;

INSERT INTO auth.users (email, password, role, is_active, is_verified)
VALUES ('peradeniya@pdn.ac.lk', 'pdn','INSTITUTION', true, true)
RETURNING id;

INSERT INTO auth.users (email, password, role, is_active, is_verified)
VALUES ('moratuwa@uom.lk', 'uom','INSTITUTION', true, true)
RETURNING id;

INSERT INTO auth.users (email, password, role, is_active, is_verified)
VALUES ('kelaniya@kln.ac.lk', 'kln','INSTITUTION', true, true)
RETURNING id;

INSERT INTO auth.users (email, password, role, is_active, is_verified)
VALUES ('jayewardenepura@sjp.ac.lk', 'sjp','INSTITUTION', true, true)
RETURNING id;

INSERT INTO auth.users (email, password, role, is_active, is_verified)
VALUES ('ruhuna@ruh.ac.lk', 'ruh','INSTITUTION', true, true)
RETURNING id;

INSERT INTO auth.users (email, password, role, is_active, is_verified)
VALUES ('openuni@ou.ac.lk', 'ou','INSTITUTION', true, true)
RETURNING id;

INSERT INTO auth.users (email, password, role, is_active, is_verified)
VALUES ('nsbm@nsbm.lk', 'nsbm','INSTITUTION', true, true)
RETURNING id;

INSERT INTO auth.users (email, password, role, is_active, is_verified)
VALUES ('iit@iit.ac.lk', 'iit','INSTITUTION', true, true)
RETURNING id;
