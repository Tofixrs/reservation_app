--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


INSERT INTO public.room_types (id, size, description, name, price_per_day) VALUES (1, 4, '

Zapraszamy Cię do odkrycia naszego wyjątkowego apartamentu, który łączy w sobie niezrównany komfort oraz luksus na najwyższym poziomie. To miejsce, w którym każdy element wnętrza został zaprojektowany z myślą o wyjątkowym doświadczeniu, zapewniając gościom unikalną atmosferę, która przekracza najwyższe oczekiwania.

Nasz apartament zachwyca wyrafinowanym i ekskluzywnym wystrojem. Starannie dobrane meble, luksusowe tkaniny i unikalne elementy dekoracyjne tworzą wnętrze o niepowtarzalnym charakterze. Wystrój ten łączy w sobie nowoczesność z elegancją, zapewniając wyjątkowe wrażenia.', 'Apartament Deluxe', 200);
INSERT INTO public.room_types (id, size, description, name, price_per_day) VALUES (2, 2, '

Pokój premium w Hotelu Prezydenckim w Rzeszowie to synonim stylu, elegancji i komfortu. Nasz wyjątkowy design oraz dbałość o detale sprawiają, że ten pokój to prawdziwa perełka w naszej ofercie. Przygotowany z myślą o najbardziej wymagających Gościach, Pokój Premium to gwarancja luksusu na najwyższym poziomie.

Wnętrze tego pokoju zachwyca swoją elegancją i nowoczesnym stylem. Wygodne łóżka, które znajdują się w przestronnym wnętrzu, zapewnią Państwu komfortowy sen, pozwalając zregenerować siły po dniu pełnym wrażeń.
', 'Pokój Premium', 150);


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: reservation
--

INSERT INTO public.rooms (id, room_type_id) VALUES (1, 1);
INSERT INTO public.rooms (id, room_type_id) VALUES (2, 1);
INSERT INTO public.rooms (id, room_type_id) VALUES (3, 1);
INSERT INTO public.rooms (id, room_type_id) VALUES (4, 1);
INSERT INTO public.rooms (id, room_type_id) VALUES (5, 1);
INSERT INTO public.rooms (id, room_type_id) VALUES (6, 2);
INSERT INTO public.rooms (id, room_type_id) VALUES (7, 2);
INSERT INTO public.rooms (id, room_type_id) VALUES (8, 2);


--
-- Data for Name: reservation_rooms; Type: TABLE DATA; Schema: public; Owner: reservation
--

--
-- Data for Name: room_image_keys; Type: TABLE DATA; Schema: public; Owner: reservation
--

INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7e4YvxTNbcLC0AOyF1Zzxa5M8Sl9pEUfntKdP6', 2);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7e4M3HjxZbcLC0AOyF1Zzxa5M8Sl9pEUfntKdP', 1);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7eyjNlVbJaU8l02Gfw4Bo5EuQpvZP7LxjAcFzW', 1);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7eVGwFrF8vFbhnNAH8kB9DujmdcJCtlea2priI', 1);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7e9L5J0stNyWTrXYkVJZM9wta5uzoUSAgB2qjv', 1);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7e1p9WokPcK82SibFC4aArqDWTUPpEMsJkoXzl', 1);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7e4ofcICbcLC0AOyF1Zzxa5M8Sl9pEUfntKdP6', 1);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7e1FDFrFPcK82SibFC4aArqDWTUPpEMsJkoXzl', 1);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7emmR2Z1wzw054KHQC8dijtaY76SLWEcbgfJks', 1);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7euImITF9GeVCk4hQDlYtxJaXj5UO6pT0fdSZ1', 2);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7evKQ9BxDwVDCBHktrU13TgmZ8zQbMLNRnldEa', 2);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7ePjXq2dmrIeMzRLBj6sCOU2oJXHgkZwGDtnVf', 2);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7etudAv1hl0gbYJjFh3DrU4sBW1Zy26eTziLfu', 2);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7eOBUOHXGNtrFP6sUeRGxCQJBAbfd3hvpq4NOa', 2);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7eZzFamDXpOo1BC98HiTlE2qFJyjamX5hI7nsr', 2);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7eGbNxATdetU1jp0EF5RsJvl6rOkXw79I4yZcM', 2);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7eQ0eDcG3xE3tgGV8eIo97JTkuayjMSZiKn4WH', 2);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7ePf1DqSmrIeMzRLBj6sCOU2oJXHgkZwGDtnVf', 2);
INSERT INTO public.room_image_keys (image_key, "roomTypeId") VALUES ('Rn5VV9fTyU7eJFWn9aYstXqVudnipS3o6QsZBELG1yTO7IzN', 2);

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, false);


--
-- Name: email_verification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: reservation
--

SELECT pg_catalog.setval('public.email_verification_id_seq', 2, true);


--
-- Name: email_verification_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: reservation
--

SELECT pg_catalog.setval('public.email_verification_user_id_seq', 1, false);


--
-- Name: reservation_rooms_rerservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: reservation
--

SELECT pg_catalog.setval('public.reservation_rooms_rerservation_id_seq', 1, false);


--
-- Name: reservation_rooms_room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: reservation
--

SELECT pg_catalog.setval('public.reservation_rooms_room_id_seq', 1, false);


--
-- Name: reservations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: reservation
--

SELECT pg_catalog.setval('public.reservations_id_seq', 22, true);


--
-- Name: reservations_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: reservation
--

SELECT pg_catalog.setval('public.reservations_user_id_seq', 1, true);


--
-- Name: room_image_keys_roomTypeId_seq; Type: SEQUENCE SET; Schema: public; Owner: reservation
--

SELECT pg_catalog.setval('public."room_image_keys_roomTypeId_seq"', 1, false);


--
-- Name: room_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: reservation
--

SELECT pg_catalog.setval('public.room_types_id_seq', 2, true);


--
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: reservation
--

SELECT pg_catalog.setval('public.rooms_id_seq', 8, true);


--
-- Name: rooms_room_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: reservation
--

SELECT pg_catalog.setval('public.rooms_room_type_id_seq', 1, false);


--
-- Name: sessions_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: reservation
--

SELECT pg_catalog.setval('public.sessions_user_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: reservation
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- PostgreSQL database dump complete
--

