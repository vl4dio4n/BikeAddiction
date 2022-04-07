DROP TABLE produse;

DROP TYPE IF EXISTS categ_produse;
DROP TYPE IF EXISTS categ_biciclete;

CREATE TYPE categ_produse AS ENUM( 'biciclete', 'piese', 'accesorii', 'echipamente');
CREATE TYPE categ_biciclete AS ENUM( 'mtb', 'sosea', 'bmx', 'trekking', 'copii', 'electrice');
-- CREATE TYPE tipuri_produse AS ENUM('cofetarie', 'patiserie', 'gelaterie');

CREATE TABLE IF NOT EXISTS produse (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   an_fabricatie NUMERIC(4, 0) NOT NULL, 
   categ_produse categ_produse DEFAULT 'biciclete',
   categ_biciclete categ_biciclete DEFAULT NULL,
   specificatii VARCHAR [], --pot sa nu fie specificare deci nu punem NOT NULL
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp,
   autor_anunt VARCHAR (100) NOT NULL,
   producator VARCHAR(300),
   livrare BOOLEAN NOT NULL
);

INSERT INTO produse(nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, autor_anunt, producator, livrare) VALUES
('BICICLETA CANNONDALE HABIT CARBON 2 2021', 'O bicicleta de munte si un tovaras de aventura. Design progresiv, agilitate maxima si rezistenta dovedita.',
21995.00, 2021, 'biciclete', 'mtb', '{"full suspension","carbon","Trail/All mountain"}', 'bicicleta1.png', 'vl4dio4n', 'Cannondale', False);

INSERT INTO produse(nume, descriere, pret, an_fabricatie, categ_produse, categ_biciclete, specificatii, imagine, autor_anunt, producator, livrare) VALUES
('BICICLETA SPECIALIZED ROCKHOPPER', 'Strut your stuff high and low with the two-stepping Shimano 2x9 drivetrain on the Rockhopper Comp 2x. The size-specific Premium A1 Aluminum frame makes for the perfect dance partner with geometry that lets you attack twists and turns with sharp, responsive handling and tackle descents with confidence-inspiring stability. An SR SunTour XCM fork gets our RxTune treatment and hydraulic disc brakes keep up with whatever rhythm you throw at them, while a killer wheelset with Shimano hubs means you have got plenty of options when it comes to lacing up your dancing shoes.',
3399, 2020, 'biciclete', 'mtb', '{"hardtail","aluminiu","Cross Country"}', 'bicicleta2.png', 'vl4dio4n', 'Specialized', True),

('BICICLETA CUBE ACCESS WS EXC', 'Combining comfort and performance in just the right blend, the Access WS Exc is your passport to ride-anywhere adventure. Featuring Shimano hydraulic disc brakes and a wide-ranging, slick-shifting Shimano transmission, it puts all-weather stopping power and fabulous hill-climbing ability at your fingertips. And the Suntour suspension fork - which improves comfort and control on rough surfaces, wherever you ride - even features a remote lockout, so you can enjoy bob-free climbing. Details, see?',
2775.00, 2021, 'biciclete', 'mtb', '{"hardtail","aluminiu","Cross Country"}', 'bicicleta3.png', 'vl4dio4n', 'Cube', False),

('BICICLETA CUBE ACCESS WS EAZ', 'They say that power is nothing without control. Well, that is why we fitted the Access WS EAZ with strong, easy-to-use Tektro hydraulic disc brakes - so you can stop reliably, whatever the weather, road surface or trail conditions. Combined with the bump-swallowing comfort of a Suntour suspension fork and the wide range of Shimano s smooth-shifting 24-speed gear system, it means this is a bike you can rely on to expand your riding horizons. Just pick your adventure, and go.',
2535.00, 2020, 'biciclete', 'mtb', '{"hardtail","aluminiu","Cross Country"}', 'bicicleta4.png', 'vl4dio4n', 'Cube', True),

('BICICLETA SPECIALIZED STUMPJUMPER', 'It is not just the S-Works that gets to enjoy all the benefits of carbon. In fact, the new Stumpjumper Comp Carbon 29 comes with the exact same full FACT 11m carbon chassis and rear-end. It is in the component department that we have made changes the Comp Carbon 29 is equipped with a strong list of no-nonsense components to ensure no budget stands in the way of a rider experiencing that perfect ride feel.',
20849.00, 2022, 'biciclete', 'mtb', '{"full suspension","carbon","Trail/All mountain"}', 'bicicleta5.png', 'vl4dio4n', 'Specialized', False),

('BICICLETA CANNONDALE SUPERSIX EVO', 'IA-TI ZBORUL CU CEA MAI RAPIDA SI USOARA BICICLETA DE LA CANNONDALE',
32995.00, 2022, 'biciclete', 'sosea', '{"fix","carbon","Gravel"}', 'bicicleta6.png', 'vl4dio4n', 'Cannondale', True),

('BICICLETA CANNONDALE TOPSTONE', 'Un gravel bike cu suspensie, fara precedent. Este cea mai capabila bicicleta de off-road si cea mai confortabila bicicleta de sosea, creata vreodata de Cannondale.',
21995.00, 2022, 'biciclete', 'sosea', '{"hardtail","carbon","Gravel"}', 'bicicleta7.png', 'vl4dio4n', 'Cannondale', False),

('BICICLETA CROSS TRAFFIC URBAN', 'Ghid marime',
4749.00, 2020, 'biciclete', 'trekking', '{"hardtail","aluminiu","Urban"}', 'bicicleta8.png', 'vl4dio4n', 'Cross', True),

('BICICLETA CROSS ARENA', 'Ghid marime',
2549.00, 2020, 'biciclete', 'trekking', '{"hardtail","aluminiu","Urban"}', 'bicicleta9.png', 'vl4dio4n', 'Cross', False),

('BICICLETA CUBE ACID', 'This is the bike that all youngsters are going to want - light, strong and equipped with everything they will need for off-road adventuring with friends and family. Hydraulic disc brakes are powerful and easy to control, with levers specially designed for small hands. The Suntour suspension fork improves comfort and control on rough trails, and the wide-ranging Microshift Advent 1x9 speed gears are easy to use and give a range that will make light work of any hill. Off-road adventures are just a few pedal strokes away...',
2599.00, 2021, 'biciclete', 'copii', '{"hardtail","aluminiu","Cross Country"}', 'bicicleta10.png', 'vl4dio4n', 'Cube', True),

('BICICLETA CUBE CUBIE', 'Taking our inspiration from our range of adult mountain bikes, we created a proper off-roader in miniature. Its front and rear V-brakes - operated by levers designed specifically to suit small hands - show that the Cubie 180 SL is every inch a real, junior mountain bike. The chain guard keeps the transmission safely hidden, and the Schwalbe tyres are just like the ones fitted to mum or dad s mountain bike. The handling is designed to be both fun and safe, and you can rest assured that, like all our bikes, this one has passed our in-house safety tests with flying colours.',
1995.00, 2021, 'biciclete', 'copii', '{"hardtail","aluminiu","Cross Country"}', 'bicicleta11.png', 'vl4dio4n', 'Cube', False),

('BICICLETA CUBE NURIDE HYBRID', 'The Nuride Hybrid Performance Allroad is one of a new breed of Bosch e-bikes that is designed to make two-wheeled adventures accessible to all. With a choice of Easy Entry, Trapeze and Men s frames it is easy to find the perfect fit for you. A 100mm suspension fork and grippy Schwalbe tyres make light work of even rough roads and tracks, while powerful Shimano hydraulic disc brakes ensure you re always in control. Bosch s Performance drive unit works seamlessly with Shimano s reliable 9-speed gears to help you tackle any route. And a full complement of equipment, from mudguards to lights and kickstand, just leaves you with one question to answer: where will you go next?',
13855.00, 2021, 'biciclete', 'electrice', '{"hardtail","aluminiu","Cross Country"}', 'bicicleta12.png', 'vl4dio4n', 'Cube', True),

('BICICLETA CUBE KATHMANDU HYBRID', 'The Kathmandu Hybrid Pro 625 captures the freedom of two-wheeled exploration... and gives it a power boost. Comfortable, versatile and adaptable, its fourth-generation Bosch drive system and 625Wh battery is just the start. We fitted an X-Fusion air suspension fork with lockout for easy adjustability, then added a suspension seatpost and an adjustable stem - so you will be more comfortable, even on rougher roads. Shimano s Deore 1x11 gears provide a huge range and easy, fingertip shifting. And the full complement of accessories and sturdy Integrated Carrier mean you are set up to take any trip in your stride.',
16199.00, 2020, 'biciclete', 'electrice', '{"hardtail","aluminiu","Cross Country"}', 'bicicleta13.png', 'vl4dio4n', 'Cube', False),

('SUBROSA BMX SONO', 'The 2021 Subrosa Sono is a sweet entry-level bike. Built from Subrosa, Shadow Conspiracy, and Rant components, this bike closes the gap between the Subrosa Altus and Subrosa Tiro. It features a sealed bottom bracket to keep things running smoothly and Rant Spring Brakes for improved stopping power. The durable frame, constructed from 100% 1020 high-tensile steel, improves longevity and provides a great ride. The black color scheme combined with red hubs and seat stitching looks exceptional and is sure to garner attention. This 20” bike is recommended for riders 7 and up ',
1845.00, 2022, 'biciclete', 'bmx', '{"hardtail","otel","bmx"}', 'bicicleta14.png', 'vl4dio4n', 'Subrosa', True),

('BICICLETA ADRIATICA BMX FREESTYLE', 'The 2021 Subrosa Tiro is an awesome entry-level BMX bike. This bike is well-suited to jamming around town, hitting the trails, or slamming the pump track. The frame is constructed from high-tensile steel making this bike a durable tank. A sealed bottom bracket and rear hub ensure smooth performance and longevity. With a bunch of aftermarket parts from Subrosa, The Shadow Conspiracy, and Rant, the Tiro rides and looks super pro. In its black color scheme, this bike looks slick and clean with the tan stripe on the tires bringing a retro feel to it all. As part of their goal to make bikes for every rider, Subrosa offers the Tiro in 5 different toptube sizes: 18.5” (with 18” wheels), 20.5”, 20.75” (L), 21.0” (XL), and 21.3” (XXL). With 20” wheels, this bike is recommended for riders 7 and older',
1999.00, 2021, 'biciclete', 'bmx', '{"hardtail","otel","bmx"}', 'bicicleta15.png', 'vl4dio4n', 'Subrosa', False);

INSERT INTO produse(nume, descriere, pret, an_fabricatie, categ_produse, specificatii, imagine, autor_anunt, producator, livrare) VALUES
('PINIOANE SunRace', '8-Speed, Lightweight Design',
83.00, 2021, 'piese', '{"8 pinioane","caseta"}', 'pinioane1.png', 'vl4dio4n', 'Shimano', True),

('CASSETTE SPROCKET', '10-Speed, Lightweight Design',
189.00, 2020, 'piese', '{"10 pinioane","caseta"}', 'pinioane2.png', 'vl4dio4n', 'Deore', True),

('POMPA PODEA SKS RENNKOMPRESSOR', 'Pompa solida, cu un caracter de cult. RENNKOMPRESSOR a fost cea mai populara pompa din ciclismul international de mai bine de 50 de ani si singurul stramos legitim al tuturor pompelor de suport pentru biciclete. Tubul metalic solid, baza din fonta, manometrul de precizie si manerul din lemn negru sunt dovada celei mai bune calitati made in Germany . Picioarele se pliaza pentru a facilita transportul.',
325.00, 2020, 'accesorii', '{"650mm", "otel", "portocaliu"}', 'pompa1.png', 'vl4dio4n', 'SKS', False),

('POMPA PODEA SKS AIRWORK', 'Pompa de podea puternica, cu un aspect modern. Un must-have in orice atelier: pompa cu suport SKS AIRWORX 10.0 cu un aspect modern. Manerul moale la atingere cu manere confortabile incastrate permite pomparea fara efort pana la 10 bar. Baza solida din metal asigura o pozitie ferma si o parghie buna, astfel incat sa puteti pompa cu usurinta presiuni mai mari in anvelope.',
179.00, 2022, 'accesorii', '{"1000mm", "metal","galben"}', 'pompa2.png', 'vl4dio4n', 'SKS', True),

('MANUSI FOX SHIFT BLUE', 'The all-new BLUE LABEL 2.0 Gloves features unapparelled movement and weight reduction with industry-leading durability. The innovative RAW wrist design reduces cuff restriction while top of hand laser cut perforations increase ventilation. It’s a Gloves that is preferred by the SHIFT Syndicate and Geico Honda team for not only its performance but unmatched style. Add it to a matching jersey and Pants and it may be the extra touch needed to win some Lit Kit awards.',
199.00, 2021, 'echipamente', '{"rosu", "M"}', 'manusi1.png', 'vl4dio4n', 'Fox', False),

('MANUSI SPECIALIZED SOFTSHELL', 'Tehnologie 100g Primaloft insulation',
249.00, 2020, 'echipamente', '{"negru", "XXL"}', 'manusi2.png', 'vl4dio4n', 'Specialized', True);











