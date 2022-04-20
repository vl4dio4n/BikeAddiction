--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-04-13 11:40:06

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

--
-- TOC entry 833 (class 1247 OID 24868)
-- Name: categ_biciclete; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.categ_biciclete AS ENUM (
    'mtb',
    'sosea',
    'bmx',
    'trekking',
    'copii',
    'electrice'
);


ALTER TYPE public.categ_biciclete OWNER TO postgres;

--
-- TOC entry 830 (class 1247 OID 24858)
-- Name: categ_produse; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.categ_produse AS ENUM (
    'biciclete',
    'piese',
    'accesorii',
    'echipamente'
);


ALTER TYPE public.categ_produse OWNER TO postgres;

--
-- TOC entry 839 (class 1247 OID 24895)
-- Name: roluri; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.roluri AS ENUM (
    'admin',
    'moderator',
    'comun'
);


ALTER TYPE public.roluri OWNER TO postgres;

--
-- TOC entry 827 (class 1247 OID 24794)
-- Name: subcateg_biciclete; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subcateg_biciclete AS ENUM (
    'mtb',
    'sosea',
    'bmx',
    'trekking',
    'copii'
);


ALTER TYPE public.subcateg_biciclete OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 24916)
-- Name: accesari; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accesari (
    id integer NOT NULL,
    ip character varying(100) NOT NULL,
    user_id integer,
    pagina character varying(500) NOT NULL,
    data_accesare timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.accesari OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 24915)
-- Name: accesari_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accesari_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accesari_id_seq OWNER TO postgres;

--
-- TOC entry 3356 (class 0 OID 0)
-- Dependencies: 213
-- Name: accesari_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accesari_id_seq OWNED BY public.accesari.id;


--
-- TOC entry 210 (class 1259 OID 24882)
-- Name: produse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produse (
    id integer NOT NULL,
    nume character varying(50) NOT NULL,
    descriere text,
    pret numeric(8,2) NOT NULL,
    an_fabricatie numeric(4,0) NOT NULL,
    categ_produse public.categ_produse DEFAULT 'biciclete'::public.categ_produse,
    categ_biciclete public.categ_biciclete,
    specificatii character varying[],
    imagine character varying(300),
    data_adaugare timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    autor_anunt character varying(100) NOT NULL,
    producator character varying(300),
    livrare boolean NOT NULL
);


ALTER TABLE public.produse OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 24881)
-- Name: produse_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produse_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.produse_id_seq OWNER TO postgres;

--
-- TOC entry 3358 (class 0 OID 0)
-- Dependencies: 209
-- Name: produse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produse_id_seq OWNED BY public.produse.id;


--
-- TOC entry 212 (class 1259 OID 24902)
-- Name: utilizatori; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilizatori (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    nume character varying(100) NOT NULL,
    prenume character varying(100) NOT NULL,
    parola character varying(500) NOT NULL,
    rol public.roluri DEFAULT 'comun'::public.roluri NOT NULL,
    email character varying(100) NOT NULL,
    culoare_chat character varying(50) NOT NULL,
    data_adaugare timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cod character varying(200),
    confirmat_mail boolean DEFAULT false
);


ALTER TABLE public.utilizatori OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 24901)
-- Name: utilizatori_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilizatori_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.utilizatori_id_seq OWNER TO postgres;

--
-- TOC entry 3360 (class 0 OID 0)
-- Dependencies: 211
-- Name: utilizatori_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilizatori_id_seq OWNED BY public.utilizatori.id;


--
-- TOC entry 3193 (class 2604 OID 24919)
-- Name: accesari id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari ALTER COLUMN id SET DEFAULT nextval('public.accesari_id_seq'::regclass);


--
-- TOC entry 3186 (class 2604 OID 24885)
-- Name: produse id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produse ALTER COLUMN id SET DEFAULT nextval('public.produse_id_seq'::regclass);


--
-- TOC entry 3189 (class 2604 OID 24905)
-- Name: utilizatori id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori ALTER COLUMN id SET DEFAULT nextval('public.utilizatori_id_seq'::regclass);


--
-- TOC entry 3350 (class 0 OID 24916)
-- Dependencies: 214
-- Data for Name: accesari; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3346 (class 0 OID 24882)
-- Dependencies: 210
-- Data for Name: produse; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (1, 'BICICLETA CANNONDALE HABIT CARBON 2 2021', 'O bicicleta de munte si un tovaras de aventura. Design progresiv, agilitate maxima si rezistenta dovedita.', 21995.00, 2021, 'biciclete', 'mtb', '{"full suspension",carbon,"Trail/All mountain"}', 'bicicleta1.png', '2022-03-29 18:11:42.156802', 'vl4dio4n', 'Cannondale', false);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (2, 'BICICLETA SPECIALIZED ROCKHOPPER', 'Strut your stuff high and low with the two-stepping Shimano 2x9 drivetrain on the Rockhopper Comp 2x. The size-specific Premium A1 Aluminum frame makes for the perfect dance partner with geometry that lets you attack twists and turns with sharp, responsive handling and tackle descents with confidence-inspiring stability. An SR SunTour XCM fork gets our RxTune treatment and hydraulic disc brakes keep up with whatever rhythm you throw at them, while a killer wheelset with Shimano hubs means you have got plenty of options when it comes to lacing up your dancing shoes.', 3399.00, 2020, 'biciclete', 'mtb', '{hardtail,aluminiu,"Cross Country"}', 'bicicleta2.png', '2022-03-29 18:12:05.00716', 'vl4dio4n', 'Specialized', true);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (3, 'BICICLETA CUBE ACCESS WS EXC', 'Combining comfort and performance in just the right blend, the Access WS Exc is your passport to ride-anywhere adventure. Featuring Shimano hydraulic disc brakes and a wide-ranging, slick-shifting Shimano transmission, it puts all-weather stopping power and fabulous hill-climbing ability at your fingertips. And the Suntour suspension fork - which improves comfort and control on rough surfaces, wherever you ride - even features a remote lockout, so you can enjoy bob-free climbing. Details, see?', 2775.00, 2021, 'biciclete', 'mtb', '{hardtail,aluminiu,"Cross Country"}', 'bicicleta3.png', '2022-03-29 18:12:05.00716', 'vl4dio4n', 'Cube', false);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (4, 'BICICLETA CUBE ACCESS WS EAZ', 'They say that power is nothing without control. Well, that is why we fitted the Access WS EAZ with strong, easy-to-use Tektro hydraulic disc brakes - so you can stop reliably, whatever the weather, road surface or trail conditions. Combined with the bump-swallowing comfort of a Suntour suspension fork and the wide range of Shimano s smooth-shifting 24-speed gear system, it means this is a bike you can rely on to expand your riding horizons. Just pick your adventure, and go.', 2535.00, 2020, 'biciclete', 'mtb', '{hardtail,aluminiu,"Cross Country"}', 'bicicleta4.png', '2022-03-29 18:12:05.00716', 'vl4dio4n', 'Cube', true);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (5, 'BICICLETA SPECIALIZED STUMPJUMPER', 'It is not just the S-Works that gets to enjoy all the benefits of carbon. In fact, the new Stumpjumper Comp Carbon 29 comes with the exact same full FACT 11m carbon chassis and rear-end. It is in the component department that we have made changes the Comp Carbon 29 is equipped with a strong list of no-nonsense components to ensure no budget stands in the way of a rider experiencing that perfect ride feel.', 20849.00, 2022, 'biciclete', 'mtb', '{"full suspension",carbon,"Trail/All mountain"}', 'bicicleta5.png', '2022-03-29 18:12:05.00716', 'vl4dio4n', 'Specialized', false);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (6, 'BICICLETA CANNONDALE SUPERSIX EVO', 'IA-TI ZBORUL CU CEA MAI RAPIDA SI USOARA BICICLETA DE LA CANNONDALE', 32995.00, 2022, 'biciclete', 'sosea', '{fix,carbon,Gravel}', 'bicicleta6.png', '2022-03-29 18:12:05.00716', 'vl4dio4n', 'Cannondale', true);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (7, 'BICICLETA CANNONDALE TOPSTONE', 'Un gravel bike cu suspensie, fara precedent. Este cea mai capabila bicicleta de off-road si cea mai confortabila bicicleta de sosea, creata vreodata de Cannondale.', 21995.00, 2022, 'biciclete', 'sosea', '{hardtail,carbon,Gravel}', 'bicicleta7.png', '2022-03-29 18:12:05.00716', 'vl4dio4n', 'Cannondale', false);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (8, 'BICICLETA CROSS TRAFFIC URBAN', 'Ghid marime', 4749.00, 2020, 'biciclete', 'trekking', '{hardtail,aluminiu,Urban}', 'bicicleta8.png', '2022-03-29 18:12:05.00716', 'vl4dio4n', 'Cross', true);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (9, 'BICICLETA CROSS ARENA', 'Ghid marime', 2549.00, 2020, 'biciclete', 'trekking', '{hardtail,aluminiu,Urban}', 'bicicleta9.png', '2022-03-29 18:12:05.00716', 'vl4dio4n', 'Cross', false);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (10, 'BICICLETA CUBE ACID', 'This is the bike that all youngsters are going to want - light, strong and equipped with everything they will need for off-road adventuring with friends and family. Hydraulic disc brakes are powerful and easy to control, with levers specially designed for small hands. The Suntour suspension fork improves comfort and control on rough trails, and the wide-ranging Microshift Advent 1x9 speed gears are easy to use and give a range that will make light work of any hill. Off-road adventures are just a few pedal strokes away...', 2599.00, 2021, 'biciclete', 'copii', '{hardtail,aluminiu,"Cross Country"}', 'bicicleta10.png', '2022-03-29 18:12:05.00716', 'vl4dio4n', 'Cube', true);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (11, 'BICICLETA CUBE CUBIE', 'Taking our inspiration from our range of adult mountain bikes, we created a proper off-roader in miniature. Its front and rear V-brakes - operated by levers designed specifically to suit small hands - show that the Cubie 180 SL is every inch a real, junior mountain bike. The chain guard keeps the transmission safely hidden, and the Schwalbe tyres are just like the ones fitted to mum or dad s mountain bike. The handling is designed to be both fun and safe, and you can rest assured that, like all our bikes, this one has passed our in-house safety tests with flying colours.', 1995.00, 2021, 'biciclete', 'copii', '{hardtail,aluminiu,"Cross Country"}', 'bicicleta11.png', '2022-03-29 18:12:05.00716', 'vl4dio4n', 'Cube', false);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (12, 'BICICLETA CUBE NURIDE HYBRID', 'The Nuride Hybrid Performance Allroad is one of a new breed of Bosch e-bikes that is designed to make two-wheeled adventures accessible to all. With a choice of Easy Entry, Trapeze and Men s frames it is easy to find the perfect fit for you. A 100mm suspension fork and grippy Schwalbe tyres make light work of even rough roads and tracks, while powerful Shimano hydraulic disc brakes ensure you re always in control. Bosch s Performance drive unit works seamlessly with Shimano s reliable 9-speed gears to help you tackle any route. And a full complement of equipment, from mudguards to lights and kickstand, just leaves you with one question to answer: where will you go next?', 13855.00, 2021, 'biciclete', 'electrice', '{hardtail,aluminiu,"Cross Country"}', 'bicicleta12.png', '2022-03-29 18:12:05.00716', 'vl4dio4n', 'Cube', true);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (13, 'BICICLETA CUBE KATHMANDU HYBRID', 'The Kathmandu Hybrid Pro 625 captures the freedom of two-wheeled exploration... and gives it a power boost. Comfortable, versatile and adaptable, its fourth-generation Bosch drive system and 625Wh battery is just the start. We fitted an X-Fusion air suspension fork with lockout for easy adjustability, then added a suspension seatpost and an adjustable stem - so you will be more comfortable, even on rougher roads. Shimano s Deore 1x11 gears provide a huge range and easy, fingertip shifting. And the full complement of accessories and sturdy Integrated Carrier mean you are set up to take any trip in your stride.', 16199.00, 2020, 'biciclete', 'electrice', '{hardtail,aluminiu,"Cross Country"}', 'bicicleta13.png', '2022-03-29 18:12:05.00716', 'vl4dio4n', 'Cube', false);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (14, 'SUBROSA BMX SONO', 'The 2021 Subrosa Sono is a sweet entry-level bike. Built from Subrosa, Shadow Conspiracy, and Rant components, this bike closes the gap between the Subrosa Altus and Subrosa Tiro. It features a sealed bottom bracket to keep things running smoothly and Rant Spring Brakes for improved stopping power. The durable frame, constructed from 100% 1020 high-tensile steel, improves longevity and provides a great ride. The black color scheme combined with red hubs and seat stitching looks exceptional and is sure to garner attention. This 20” bike is recommended for riders 7 and up ', 1845.00, 2022, 'biciclete', 'bmx', '{hardtail,otel,bmx}', 'bicicleta14.png', '2022-03-29 18:12:05.00716', 'vl4dio4n', 'Subrosa', true);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (15, 'BICICLETA ADRIATICA BMX FREESTYLE', 'The 2021 Subrosa Tiro is an awesome entry-level BMX bike. This bike is well-suited to jamming around town, hitting the trails, or slamming the pump track. The frame is constructed from high-tensile steel making this bike a durable tank. A sealed bottom bracket and rear hub ensure smooth performance and longevity. With a bunch of aftermarket parts from Subrosa, The Shadow Conspiracy, and Rant, the Tiro rides and looks super pro. In its black color scheme, this bike looks slick and clean with the tan stripe on the tires bringing a retro feel to it all. As part of their goal to make bikes for every rider, Subrosa offers the Tiro in 5 different toptube sizes: 18.5” (with 18” wheels), 20.5”, 20.75” (L), 21.0” (XL), and 21.3” (XXL). With 20” wheels, this bike is recommended for riders 7 and older', 1999.00, 2021, 'biciclete', 'bmx', '{hardtail,otel,bmx}', 'bicicleta15.png', '2022-03-29 18:12:05.00716', 'vl4dio4n', 'Subrosa', false);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (16, 'PINIOANE SunRace', '8-Speed, Lightweight Design', 83.00, 2021, 'piese', NULL, '{"8 pinioane",caseta}', 'pinioane1.png', '2022-03-29 18:13:13.066829', 'vl4dio4n', 'Shimano', true);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (17, 'CASSETTE SPROCKET', '10-Speed, Lightweight Design', 189.00, 2020, 'piese', NULL, '{"10 pinioane",caseta}', 'pinioane2.png', '2022-03-29 18:13:13.066829', 'vl4dio4n', 'Deore', true);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (18, 'POMPA PODEA SKS RENNKOMPRESSOR', 'Pompa solida, cu un caracter de cult. RENNKOMPRESSOR a fost cea mai populara pompa din ciclismul international de mai bine de 50 de ani si singurul stramos legitim al tuturor pompelor de suport pentru biciclete. Tubul metalic solid, baza din fonta, manometrul de precizie si manerul din lemn negru sunt dovada celei mai bune calitati made in Germany . Picioarele se pliaza pentru a facilita transportul.', 325.00, 2020, 'accesorii', NULL, '{650mm,otel,portocaliu}', 'pompa1.png', '2022-03-29 18:13:13.066829', 'vl4dio4n', 'SKS', false);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (19, 'POMPA PODEA SKS AIRWORK', 'Pompa de podea puternica, cu un aspect modern. Un must-have in orice atelier: pompa cu suport SKS AIRWORX 10.0 cu un aspect modern. Manerul moale la atingere cu manere confortabile incastrate permite pomparea fara efort pana la 10 bar. Baza solida din metal asigura o pozitie ferma si o parghie buna, astfel incat sa puteti pompa cu usurinta presiuni mai mari in anvelope.', 179.00, 2022, 'accesorii', NULL, '{1000mm,metal,galben}', 'pompa2.png', '2022-03-29 18:13:13.066829', 'vl4dio4n', 'SKS', true);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (20, 'MANUSI FOX SHIFT BLUE', 'The all-new BLUE LABEL 2.0 Gloves features unapparelled movement and weight reduction with industry-leading durability. The innovative RAW wrist design reduces cuff restriction while top of hand laser cut perforations increase ventilation. It’s a Gloves that is preferred by the SHIFT Syndicate and Geico Honda team for not only its performance but unmatched style. Add it to a matching jersey and Pants and it may be the extra touch needed to win some Lit Kit awards.', 199.00, 2021, 'echipamente', NULL, '{rosu,M}', 'manusi1.png', '2022-03-29 18:13:13.066829', 'vl4dio4n', 'Fox', false);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (21, 'MANUSI SPECIALIZED SOFTSHELL', 'Tehnologie 100g Primaloft insulation', 249.00, 2020, 'echipamente', NULL, '{negru,XXL}', 'manusi2.png', '2022-03-29 18:13:13.066829', 'vl4dio4n', 'Specialized', true);
INSERT INTO public.produse (id, nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, data_adaugare, autor_anunt, producator, livrare) VALUES (22, 'PANTOFI CICLISM SPECIALIZED 2FO ROOST', 'Pantofi foarte smecheri', 548.99, 2015, 'echipamente', NULL, '{negru,40}', 'pantofi1.png', '2022-04-07 22:02:10.996804', 'popastefan', 'Specialized', false);


--
-- TOC entry 3348 (class 0 OID 24902)
-- Dependencies: 212
-- Data for Name: utilizatori; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3361 (class 0 OID 0)
-- Dependencies: 213
-- Name: accesari_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accesari_id_seq', 1, false);


--
-- TOC entry 3362 (class 0 OID 0)
-- Dependencies: 209
-- Name: produse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produse_id_seq', 22, true);


--
-- TOC entry 3363 (class 0 OID 0)
-- Dependencies: 211
-- Name: utilizatori_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilizatori_id_seq', 1, false);


--
-- TOC entry 3204 (class 2606 OID 24924)
-- Name: accesari accesari_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari
    ADD CONSTRAINT accesari_pkey PRIMARY KEY (id);


--
-- TOC entry 3196 (class 2606 OID 24893)
-- Name: produse produse_nume_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produse
    ADD CONSTRAINT produse_nume_key UNIQUE (nume);


--
-- TOC entry 3198 (class 2606 OID 24891)
-- Name: produse produse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produse
    ADD CONSTRAINT produse_pkey PRIMARY KEY (id);


--
-- TOC entry 3200 (class 2606 OID 24912)
-- Name: utilizatori utilizatori_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori
    ADD CONSTRAINT utilizatori_pkey PRIMARY KEY (id);


--
-- TOC entry 3202 (class 2606 OID 24914)
-- Name: utilizatori utilizatori_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori
    ADD CONSTRAINT utilizatori_username_key UNIQUE (username);


--
-- TOC entry 3205 (class 2606 OID 24925)
-- Name: accesari accesari_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari
    ADD CONSTRAINT accesari_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.utilizatori(id);


--
-- TOC entry 3357 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE produse; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.produse TO vl4dio4n;


--
-- TOC entry 3359 (class 0 OID 0)
-- Dependencies: 209
-- Name: SEQUENCE produse_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.produse_id_seq TO vl4dio4n;


-- Completed on 2022-04-13 11:40:07

--
-- PostgreSQL database dump complete
--

