// MongoDB Update Script for Product Subcategories
// Generated: 2025-09-10T18:05:39.913Z
// Total Products: 43149
// Matched: 18671
// Unmatched: 24478

// This script groups products by their target subcategory
// You'll need to map these subcategory names to your actual subcategory IDs

const updates = {
  // shirts (1621 products)
  'shirts': [
    { id: '68be85ad094d08828def4547', name: 'Adv Unify Hybrid Jacket W' },
    { id: '68be85ad094d08828def456d', name: 'Adv Join Fz Jacket M' },
    { id: '68be85ad094d08828def4571', name: 'Progress Ls Basket Jersey Jr' },
    { id: '68be85ad094d08828def4573', name: 'Adv Unify Hybrid Jacket M' },
    { id: '68be85ad094d08828def4574', name: 'Evolve 2.0 Half Zip Jacket M' },
    { id: '68be85ad094d08828def4575', name: 'Adv Unify Hybrid Jacket W' },
    { id: '68be85ad094d08828def4578', name: 'Adv Join Fz Hoodie M' },
    { id: '68be85ad094d08828def457e', name: 'Adv Join Fz Hoodie W' },
    { id: '68be85ad094d08828def457f', name: 'Progress 2.0 Gk Ls Jersey M' },
    { id: '68be85ad094d08828def4581', name: 'Adv Join Hoodie M' },
    { id: '68be85ad094d08828def4585', name: 'Progress 2.0 Gk Ls Jersey W' },
    { id: '68be85ad094d08828def458a', name: 'Adv Join Rn Sweatshirt M' },
    { id: '68be85ad094d08828def458b', name: 'Adv Join Long Hoodie W' },
    { id: '68be85ad094d08828def458e', name: 'Adv Join Rn Sweatshirt W' },
    { id: '68be85ad094d08828def4641', name: 'Clark' },
    { id: '68be85ad094d08828def4642', name: 'Clare' },
    { id: '68be85ad094d08828def4643', name: 'Oxford' },
    { id: '68be85ad094d08828def4644', name: 'Cambridge' },
    { id: '68be85ad094d08828def4645', name: 'Garland' },
    { id: '68be85ad094d08828def4646', name: 'Libby' },
    { id: '68be85ad094d08828def4647', name: 'Stretch Shirt L/S' },
    { id: '68be85ad094d08828def4648', name: 'Stretch Shirt L/S Women' },
    { id: '68be85ad094d08828def4678', name: 'Craft Hoodie Community Zip Herr' },
    { id: '68be85ad094d08828def4679', name: 'Core Soul Full Zip Hood M' },
    { id: '68be85ad094d08828def467a', name: 'Adv Join Fz Jacket M' },
    { id: '68be85ad094d08828def467b', name: 'Evolve 2.0 Half Zip Jacket W' },
    { id: '68be85ad094d08828def467e', name: 'Evolve 2.0 Half Zip Jacket Jr' },
    { id: '68be85ad094d08828def467f', name: 'Adv Urban Lt Padded Overshirt Uni' },
    { id: '68be85ad094d08828def4681', name: 'Squad Go Fz Jacket W' },
    { id: '68be85ad094d08828def4687', name: 'Core Soul Full Zip Jkt M' },
    { id: '68be85ad094d08828def468a', name: 'Core Soul Full Zip Hood W' },
    { id: '68be85ad094d08828def468b', name: 'Core Soul Full Zip Jkt W' },
    { id: '68be85ad094d08828def468d', name: 'Evolve 2.0 Brushed Hood Jkt Jr' },
    { id: '68be85ad094d08828def468e', name: 'Community 2.0 Zip Jkt W' },
    { id: '68be85ad094d08828def4690', name: 'Craft Hoodie Community Zip Dam' },
    { id: '68be85ad094d08828def4691', name: 'Craft Hoodie Community Junior' },
    { id: '68be85ad094d08828def4692', name: 'Evolve 2.0 Crewneck M' },
    { id: '68be85ad094d08828def46b6', name: 'Basic Roundneck' },
    { id: '68be85ad094d08828def46b7', name: 'Basic Cardigan' },
    { id: '68be85ad094d08828def46b8', name: 'Basic Half Zip' },
    { id: '68be85ad094d08828def46b9', name: 'Basic-T L/S' },
    { id: '68be85ad094d08828def46ba', name: 'Basic Active-T Junior' },
    { id: '68be85ad094d08828def46bb', name: 'Basic Cardigan Women' },
    { id: '68be85ad094d08828def46bc', name: 'Classic Cardigan' },
    { id: '68be85ad094d08828def46bd', name: 'Classic Half Zip' },
    { id: '68be85ad094d08828def46be', name: 'Basic Active Cardigan' },
    { id: '68be85ad094d08828def46bf', name: 'Classic Roundneck' },
    { id: '68be85ad094d08828def46c0', name: 'Premium OC Roundneck' },
    { id: '68be85ad094d08828def46c1', name: 'Basic-T L/S Women' },
    { id: '68be85ad094d08828def46c2', name: 'Premium OC Cardigan' },
    { id: '68be85ad094d08828def46c3', name: 'Basic Active-T L/S' },
    { id: '68be85ad094d08828def46c4', name: 'Basic Micro Fleece Jacket' },
    { id: '68be85ad094d08828def46c6', name: 'Ducan' },
    { id: '68be85ad094d08828def46c7', name: 'Basic Active Half Zip' },
    { id: '68be85ad094d08828def46c8', name: 'Carolina L/S' },
    { id: '68be85ad094d08828def46c9', name: 'Craig' },
    { id: '68be85ad094d08828def46ca', name: 'Premium OC Cardigan Women' },
    { id: '68be85ad094d08828def46cc', name: 'Elgin' },
    { id: '68be85ad094d08828def46cd', name: 'Basic Micro Fleece Jacket Women' },
    { id: '68be85ad094d08828def46ce', name: 'Premium OC Roundneck Women' },
    { id: '68be85ad094d08828def46d0', name: 'Newport' },
    { id: '68be85ad094d08828def46d1', name: 'Basic Roundneck Junior' },
    { id: '68be85ad094d08828def46d2', name: 'Ezel' },
    { id: '68be85ad094d08828def46d3', name: 'Basic Cardigan Junior' },
    { id: '68be85ad094d08828def46d4', name: 'Aston' },
    { id: '68be85ad094d08828def46d5', name: 'Classic Cardigan Women' },
    { id: '68be85ad094d08828def46d6', name: 'Basic Active Roundneck' },
    { id: '68be85ad094d08828def46d7', name: 'Basic Active-T L/S Women' },
    { id: '68be85ad094d08828def46d9', name: 'Premium Fashion-T L/S' },
    { id: '68be85ad094d08828def46da', name: 'Premium Fashion-T L/S Women' },
    { id: '68be85ad094d08828def46db', name: 'Miami Roundneck' },
    { id: '68be85ad094d08828def46dc', name: 'Basic Active Half Zip Junior' },
    { id: '68be85ad094d08828def46dd', name: 'Ambition Half Zip' },
    { id: '68be85ad094d08828def4710', name: 'Community 2.0 Zip Jkt W' },
    { id: '68be85ad094d08828def47ac', name: 'Evolve 2.0 Crewneck W' },
    { id: '68be85ad094d08828def47ad', name: 'Core Soul Hood Sweatshirt M' },
    { id: '68be85ad094d08828def47ae', name: 'Core Soul Hood Sweatshirt W' },
    { id: '68be85ad094d08828def47af', name: 'Craft Hoodie Community Dam' },
    { id: '68be85ad094d08828def47b0', name: 'Core Soul Crew Sweatshirt M' },
    { id: '68be85ad094d08828def47b1', name: 'Craft Uppvärmningströja Progress Herr' },
    { id: '68be85ad094d08828def47b2', name: 'Pro Control Seamless Jersey W' },
    { id: '68be85ad094d08828def47b6', name: 'Core Soul Crew Sweatshirt W' },
    { id: '68be85ad094d08828def47bd', name: 'Craft Collegetröja Progress GK Junior' },
    { id: '68be85ad094d08828def47be', name: 'Craft Collegetröja Progress GK Dam' },
    { id: '68be85ad094d08828def47bf', name: 'Active Comfort Ls 2 M' },
    { id: '68be85ad094d08828def47c0', name: 'Active Comfort Ls Hz 2 M' },
    { id: '68be85ad094d08828def47c1', name: 'Active Comfort Ls Hz 2 W' },
    { id: '68be85ad094d08828def47c2', name: 'Active Comfort Ls 2 W' },
    { id: '68be85ad094d08828def47c3', name: 'Ambition Roundneck' },
    { id: '68be85ad094d08828def47c6', name: 'Miami Cardigan' },
    { id: '68be85ad094d08828def47c7', name: 'Miami Half Zip' },
    { id: '68be85ad094d08828def47c8', name: 'Miami PRO Roundneck' },
    { id: '68be85ad094d08828def47c9', name: 'Miami Cropped' },
    { id: '68be85ad094d08828def47ca', name: 'Miami PRO Roundneck Women' },
    { id: '68be85ae094d08828def4a1e', name: 'Berkeley Zip-Tröja Brockton' },
    { id: '68be85ae094d08828def4a1f', name: 'Berkeley Tröja Brockton' },
    { id: '68be85ae094d08828def4a20', name: 'Berkeley Tröja Wilton' },
    { id: '68be85ae094d08828def4a21', name: 'Berkeley V-ringad Tröja Brockton' },
    { id: '68be85ae094d08828def4a22', name: 'Berkeley V-ringad Tröja Brockton Dam' },
    { id: '68be85ae094d08828def4a23', name: 'Berkeley Sweatshirt Alfie' },
    // ... and 1521 more products
  ],

  // jackets (1395 products)
  'jackets': [
    { id: '68be85ad094d08828def4545', name: 'Core Light Padded Jacket M' },
    { id: '68be85ad094d08828def4546', name: 'Rush 2.0 Training Jacket M' },
    { id: '68be85ad094d08828def4548', name: 'Evolve Down Jacket M' },
    { id: '68be85ad094d08828def454a', name: 'Evolve 2.0 Full Zip Jacket M' },
    { id: '68be85ad094d08828def454c', name: 'Adv Explore Power Fleece Hood Jkt M' },
    { id: '68be85ad094d08828def454d', name: 'Evolve Down Jacket W' },
    { id: '68be85ad094d08828def454e', name: 'Core Light Padded Jacket W' },
    { id: '68be85ad094d08828def454f', name: 'Core Explore Shell Jacket M' },
    { id: '68be85ad094d08828def4551', name: 'Core Unify Wind Jacket M' },
    { id: '68be85ad094d08828def4553', name: 'Evolve Down Jacket Jr' },
    { id: '68be85ad094d08828def4554', name: 'Core Explore Lt. Insulation Jkt M' },
    { id: '68be85ad094d08828def4557', name: 'Evolve 2.0 Full Zip Jacket Jr' },
    { id: '68be85ad094d08828def4559', name: 'Adv Explore Lt. Down Jkt M' },
    { id: '68be85ad094d08828def455a', name: 'Adv Explore Shell Jacket M' },
    { id: '68be85ad094d08828def455d', name: 'Adv Explore Lightweight Jacket M' },
    { id: '68be85ad094d08828def4563', name: 'Evolve Rain Jacket W' },
    { id: '68be85ad094d08828def4564', name: 'Adv Explore Lt. Down Jkt W' },
    { id: '68be85ad094d08828def4565', name: 'Craft Regnjacka Herr' },
    { id: '68be85ad094d08828def4566', name: 'Core Explore Lt. Insulation Jkt W' },
    { id: '68be85ad094d08828def4569', name: 'Core Explore Shell Jacket W' },
    { id: '68be85ad094d08828def456c', name: 'Adv Explore Power Fleece Hood Jkt W' },
    { id: '68be85ad094d08828def45e7', name: 'Classic Rain Jacket' },
    { id: '68be85ad094d08828def45e8', name: 'Stafford' },
    { id: '68be85ad094d08828def45e9', name: 'Hudson' },
    { id: '68be85ad094d08828def45ea', name: 'Zip puller 50-p' },
    { id: '68be85ad094d08828def45eb', name: 'Milford Jacket' },
    { id: '68be85ad094d08828def45ec', name: 'Basic Rain Jacket' },
    { id: '68be85ad094d08828def45ed', name: 'Colorado' },
    { id: '68be85ad094d08828def45ef', name: 'Hudson Women' },
    { id: '68be85ad094d08828def45f0', name: 'Padded Hoody Softshell' },
    { id: '68be85ad094d08828def45f1', name: 'Hudson Junior' },
    { id: '68be85ad094d08828def45f2', name: 'Kingslake' },
    { id: '68be85ad094d08828def45f3', name: 'Hardy' },
    { id: '68be85ad094d08828def45f4', name: 'Basic Polar Fleece Jacket' },
    { id: '68be85ad094d08828def45f5', name: 'Bomber' },
    { id: '68be85ad094d08828def45f6', name: 'Milford Jacket Women' },
    { id: '68be85ad094d08828def45f7', name: 'Key West' },
    { id: '68be85ad094d08828def45f9', name: 'Waco' },
    { id: '68be85ad094d08828def45fa', name: 'Padded Hoody Softshell Women' },
    { id: '68be85ad094d08828def45fb', name: 'Idaho' },
    { id: '68be85ad094d08828def45fc', name: 'Waco Women' },
    { id: '68be85ad094d08828def45fd', name: 'Utah Jacket' },
    { id: '68be85ad094d08828def45fe', name: 'Padded Softshell Jacket' },
    { id: '68be85ad094d08828def45ff', name: 'Grayland' },
    { id: '68be85ad094d08828def4600', name: 'Padded Softshell Jacket Women' },
    { id: '68be85ad094d08828def4601', name: 'Utah Jacket Women' },
    { id: '68be85ad094d08828def4602', name: 'Grayland Women' },
    { id: '68be85ad094d08828def4603', name: 'Classic Softshell Jacket' },
    { id: '68be85ad094d08828def4604', name: 'Idaho Women' },
    { id: '68be85ad094d08828def4605', name: 'Classic Shell Jacket' },
    { id: '68be85ad094d08828def4606', name: 'Classic Softshell Hoody' },
    { id: '68be85ad094d08828def4607', name: 'Classic Softshell Jacket Women' },
    { id: '68be85ad094d08828def46c5', name: 'Basic Polar Fleece Jacket' },
    { id: '68be85ad094d08828def46cb', name: 'Key West' },
    { id: '68be85ad094d08828def46de', name: 'Classic Softshell Hoody Women' },
    { id: '68be85ad094d08828def46df', name: 'Classic Shell Jacket Women' },
    { id: '68be85ad094d08828def46e0', name: 'Idaho Junior' },
    { id: '68be85ad094d08828def46e1', name: 'Classic Softshell Jacket Junior' },
    { id: '68be85ad094d08828def46e2', name: 'Padded Hoody Softshell Junior' },
    { id: '68be85ad094d08828def46ea', name: 'Zip puller 50-p' },
    { id: '68be85ad094d08828def4703', name: 'Adv Explore Softshell 2.0 Jkt M' },
    { id: '68be85ad094d08828def4704', name: 'Adv Explore Lightweight Jacket W' },
    { id: '68be85ad094d08828def4705', name: 'Adv Explore Power Fleece Jkt M' },
    { id: '68be85ad094d08828def4706', name: 'Evolve 2.0 Brushed Hood Jkt M' },
    { id: '68be85ad094d08828def4707', name: 'Core Explore Softshell 2.0 Jkt M' },
    { id: '68be85ad094d08828def4708', name: 'Adv Explore Shell Jacket W' },
    { id: '68be85ad094d08828def4709', name: 'Adv Explore Lt. Down Hybrid Jkt M' },
    { id: '68be85ad094d08828def470a', name: 'Adv Join Windbreaker W' },
    { id: '68be85ad094d08828def470b', name: 'Evolve 2.0 Brushed Hood Jkt W' },
    { id: '68be85ad094d08828def470c', name: 'Craft Regnjacka Dam' },
    { id: '68be85ad094d08828def470d', name: 'Adv Explore Softshell 2.0 Jkt W' },
    { id: '68be85ad094d08828def470e', name: 'Adv Explore Power Fleece Jkt W' },
    { id: '68be85ad094d08828def470f', name: 'Core Explore Softshell 2.0 Jkt W' },
    { id: '68be85ad094d08828def4711', name: 'Adv Explore Lt. Down Hybrid Jk' },
    { id: '68be85ad094d08828def4712', name: 'Craft Regnjacka Junior' },
    { id: '68be85ad094d08828def4713', name: 'Adv Join Windbreaker M' },
    { id: '68be85ad094d08828def4714', name: 'Craft Vindjacka Dam' },
    { id: '68be85ad094d08828def47f8', name: 'Windrunner Jacket' },
    { id: '68be85ad094d08828def47f9', name: 'Bomber Jacket' },
    { id: '68be85ad094d08828def47fa', name: 'Nylon Bomber Jacket' },
    { id: '68be85ad094d08828def47fd', name: 'Ladies´ Nylon Bomber Jacket' },
    { id: '68be85ad094d08828def48a6', name: 'THC DUBLINERS. Vindjacka (unisex)' },
    { id: '68be85ad094d08828def48f2', name: 'Ponchie - PEVA-regnjacka med huva / barn' },
    { id: '68be85ad094d08828def48f3', name: 'Robyn - ROBYN UNISEX JACKET PADDED' },
    { id: '68be85ae094d08828def493d', name: 'Mecox RPET fleecejacka' },
    { id: '68be85ae094d08828def4940', name: 'Timber RPET softshelljacka' },
    { id: '68be85ae094d08828def4a8b', name: 'Berkeley Jacka Commuter Parka' },
    { id: '68be85ae094d08828def4a8c', name: 'Berkeley Jacka Norwood' },
    { id: '68be85ae094d08828def4a8d', name: 'Berkeley Jacka Commuter Parka Dam' },
    { id: '68be85ae094d08828def4a8e', name: 'Berkeley Bomberjacka Brooks' },
    { id: '68be85ae094d08828def4a8f', name: 'Berkeley Jacka Norwood Dam' },
    { id: '68be85ae094d08828def4a90', name: 'Carmel Car Coat' },
    { id: '68be85ae094d08828def4a91', name: 'Berkeley Bomberjacka Brooks Dam' },
    { id: '68be85ae094d08828def4a92', name: 'W´s Carmel Car Coat' },
    { id: '68be85ae094d08828def4a93', name: 'W´s Carmel Jacket' },
    { id: '68be85ae094d08828def4a94', name: 'Delano Jacket' },
    { id: '68be85ae094d08828def4a95', name: 'Doyle Fleece Jacket' },
    { id: '68be85ae094d08828def4a96', name: 'Commuter Padded Jacket' },
    { id: '68be85ae094d08828def4a97', name: 'W´s Delano Jacket' },
    { id: '68be85ae094d08828def4a98', name: 'Delano Hybrid Jacket' },
    // ... and 1295 more products
  ],

  // caps (651 products)
  'caps': [
    { id: '68be85ad094d08828def4599', name: 'CHILKA. Barnkeps i polyester' },
    { id: '68be85ad094d08828def45cd', name: 'Saco' },
    { id: '68be85ad094d08828def45ce', name: 'Kyle' },
    { id: '68be85ad094d08828def45cf', name: 'Texas Cap' },
    { id: '68be85ad094d08828def45d0', name: 'Baily' },
    { id: '68be85ad094d08828def45d1', name: 'Hubert' },
    { id: '68be85ad094d08828def45d2', name: 'Moody' },
    { id: '68be85ad094d08828def45d3', name: 'Hubert Patch' },
    { id: '68be85ad094d08828def45d4', name: 'Davis' },
    { id: '68be85ad094d08828def45d5', name: 'George' },
    { id: '68be85ad094d08828def45d6', name: 'Davis Kids' },
    { id: '68be85ad094d08828def45d7', name: 'Milas' },
    { id: '68be85ad094d08828def45d8', name: 'Otto' },
    { id: '68be85ad094d08828def45d9', name: 'Bucket Hat' },
    { id: '68be85ad094d08828def4639', name: 'Top - basebollkeps med 6 paneler 265' },
    { id: '68be85ad094d08828def4788', name: 'Buffalo - Keps med 6 paneler' },
    { id: '68be85ad094d08828def4790', name: 'Bilgola+ - Solhatt av pappershalm' },
    { id: '68be85ad094d08828def4791', name: 'Sunny - 5 panel basebollkeps' },
    { id: '68be85ad094d08828def482d', name: 'Bilgola+ - Solhatt av pappershalm' },
    { id: '68be85ad094d08828def4842', name: 'Sanvi basebollkeps' },
    { id: '68be85ad094d08828def48b8', name: 'CLAIRE. Sandwich-keps i 100% polyester' },
    { id: '68be85ad094d08828def48d7', name: 'Keps Blåkläder 20750000' },
    { id: '68be85ad094d08828def4913', name: 'RYAN. Keps gjord av (återvunnen 65%) borstad bomull' },
    { id: '68be85ae094d08828def494a', name: 'Gibson basebollkeps' },
    { id: '68be85ae094d08828def4960', name: 'Keps Blåkläder 92290000' },
    { id: '68be85ae094d08828def4a08', name: 'Capo - basebollkeps med 5 paneler 130' },
    { id: '68be85ae094d08828def4ac4', name: 'Rebicap basebollkeps' },
    { id: '68be85af094d08828def4b1c', name: 'Low Profile Vintage Cap' },
    { id: '68be85af094d08828def4b1d', name: 'Snapback Trucker' },
    { id: '68be85af094d08828def4b1e', name: 'Original 5 Panel Cap' },
    { id: '68be85af094d08828def4b1f', name: 'Low Profile 6 Panel Dad Cap' },
    { id: '68be85af094d08828def4b20', name: 'Teamwear Competition Cap' },
    { id: '68be85af094d08828def4b21', name: 'Army Cap' },
    { id: '68be85af094d08828def4b23', name: 'Athleisure 6 Panel Cap' },
    { id: '68be85af094d08828def4b24', name: 'Ultimate 5 Panel Cap - Sandwich Peak' },
    { id: '68be85af094d08828def4b25', name: 'Ultimate 5 Panel Cap' },
    { id: '68be85af094d08828def4b26', name: '5 Panel Snapback Rapper Cap' },
    { id: '68be85af094d08828def4b27', name: 'Junior Original 5 Panel Cap' },
    { id: '68be85af094d08828def4b28', name: 'Pro-Style Heavy Brushed Cotton Cap' },
    { id: '68be85af094d08828def4b29', name: 'Original Flat Peak Snapback' },
    { id: '68be85af094d08828def4b2a', name: 'Authentic Baseball Cap' },
    { id: '68be85af094d08828def4b2b', name: 'Heritage Cord Cap' },
    { id: '68be85af094d08828def4b2c', name: 'Camo Army Cap' },
    { id: '68be85af094d08828def4b2d', name: 'Original Flat Peak 6 Panel Trucker' },
    { id: '68be85af094d08828def4b2e', name: 'Ultimate 6 Panel Cap' },
    { id: '68be85af094d08828def4b2f', name: 'Low Profile Heavy Cotton Drill Cap' },
    { id: '68be85af094d08828def4b30', name: 'Truckerkeps Micronit Snapback' },
    { id: '68be85af094d08828def4b31', name: 'Heritage Baker Boy Cap' },
    { id: '68be85af094d08828def4b32', name: 'Keps Authentic 5 Panel' },
    { id: '68be85af094d08828def4b33', name: 'Coolmax® Flow Mesh Cap' },
    { id: '68be85af094d08828def4b34', name: 'Truckerkeps Suede Snapback' },
    { id: '68be85af094d08828def4b35', name: 'Urbanwear 6 Panel Cap' },
    { id: '68be85af094d08828def4b36', name: 'Air Mesh 6 Panel Cap' },
    { id: '68be85af094d08828def4b37', name: 'Faux Suede 6 Panel Cap' },
    { id: '68be85af094d08828def4b38', name: 'Urbanwear 5 Panel Snapback' },
    { id: '68be85af094d08828def4b39', name: 'Recycled Pro-Style Cap' },
    { id: '68be85af094d08828def4b3a', name: 'Urbanwear 6 Panel Snapback' },
    { id: '68be85af094d08828def4b3b', name: 'Organic Cotton 6 Panel Dad Cap' },
    { id: '68be85af094d08828def4b3c', name: 'Outdoor 5 Panel Camper Cap' },
    { id: '68be85af094d08828def4b3d', name: 'Organic Cotton Unstructured 5 Panel Cap' },
    { id: '68be85af094d08828def4b3e', name: 'Relaxed 5 Panel Vintage Cap' },
    { id: '68be85af094d08828def4b3f', name: 'Removable Patch Snapback Trucker' },
    { id: '68be85af094d08828def4b40', name: 'Original Flat Peak 6 Panel Snapback' },
    { id: '68be85af094d08828def4b81', name: 'BENEDICT. Keps av återvunnen polyester (100 % rPET)' },
    { id: '68be85af094d08828def4bfb', name: 'Bahamas - Keps med 6 paneler i bomull' },
    { id: '68be85af094d08828def4c11', name: 'Junior Snapback Trucker' },
    { id: '68be85af094d08828def4c12', name: 'Organic Cotton 5 Panel Cap' },
    { id: '68be85af094d08828def4c13', name: 'EarthAware® Classic Organic Cotton 5 Panel Cap' },
    { id: '68be85af094d08828def4c14', name: 'EarthAware® Classic OrganicCotton 6 Panel Cap' },
    { id: '68be85af094d08828def4c15', name: 'EarthAware® Organic Cotton Canvas 6 Panel Cap' },
    { id: '68be85af094d08828def4c16', name: 'EarthAware® OrganicCotton Stretch-Fit Cap' },
    { id: '68be85af094d08828def4c17', name: 'Pitcher Snapback' },
    { id: '68be85af094d08828def4c18', name: 'Signature Stretch-Fit Baseball' },
    { id: '68be85af094d08828def4c3a', name: 'Darrell Cap' },
    { id: '68be85af094d08828def4c3b', name: 'Hendrix Cap' },
    { id: '68be85af094d08828def4ca2', name: 'Frio Cap' },
    { id: '68be85af094d08828def4ca3', name: 'Shawmut Cap' },
    { id: '68be85af094d08828def4ca4', name: 'Solana Cap' },
    { id: '68be85af094d08828def4ca5', name: 'Hugo Cap' },
    { id: '68be85af094d08828def4ca6', name: 'Putnam Cap' },
    { id: '68be85af094d08828def4ca7', name: 'Ace Cap' },
    { id: '68be85af094d08828def4ca8', name: 'Grid Cap' },
    { id: '68be85af094d08828def4ca9', name: 'Marley Cap' },
    { id: '68be85af094d08828def4d03', name: 'Zappa Cap' },
    { id: '68be85af094d08828def4d04', name: 'Cornell Cap' },
    { id: '68be85af094d08828def4d24', name: 'Amstrong Cap' },
    { id: '68be85af094d08828def4d93', name: 'Bally cap' },
    { id: '68be85af094d08828def4d9a', name: 'Gailes cap' },
    { id: '68be85af094d08828def4da4', name: 'Links raincap' },
    { id: '68be85af094d08828def4e24', name: 'Aaron RPET basebollkeps' },
    { id: '68be85af094d08828def4ef9', name: 'Gailes plain cap' },
    { id: '68be85b0094d08828def4fe6', name: 'Keps Child' },
    { id: '68be85b0094d08828def505c', name: 'Keps Snap Curved' },
    { id: '68be85b0094d08828def5067', name: 'Keps Popular' },
    { id: '68be85b0094d08828def5069', name: 'Keps i mocka Orion' },
    { id: '68be85b0094d08828def5087', name: 'Keps Snap (Barn)' },
    { id: '68be85b0094d08828def50b9', name: 'Keps Trucker' },
    { id: '68be85b0094d08828def50bb', name: 'Keps New Mesh' },
    { id: '68be85b0094d08828def50c8', name: 'Keps Snap Solid' },
    { id: '68be85b0094d08828def5118', name: 'Keps Turned' },
    // ... and 551 more products
  ],

  // pants (594 products)
  'pants': [
    { id: '68be85ad094d08828def45da', name: 'Basic Pants' },
    { id: '68be85ad094d08828def45db', name: 'Bend' },
    { id: '68be85ad094d08828def45dc', name: 'Cargo Pocket' },
    { id: '68be85ad094d08828def45dd', name: '5-Pocket Stretch' },
    { id: '68be85ad094d08828def45de', name: 'Hollis' },
    { id: '68be85ad094d08828def45df', name: '5-Pocket Stretch Women' },
    { id: '68be85ad094d08828def45e0', name: 'Elastic Belt' },
    { id: '68be85ad094d08828def45e1', name: 'Basic Pants Junior' },
    { id: '68be85ad094d08828def45e2', name: 'Odessa' },
    { id: '68be85ad094d08828def45e3', name: 'Basic Active Shorts' },
    { id: '68be85ad094d08828def45e4', name: 'Basic Active Shorts Junior' },
    { id: '68be85ad094d08828def45e5', name: 'Venice' },
    { id: '68be85ad094d08828def45e6', name: 'Miami Pants' },
    { id: '68be85ad094d08828def4612', name: 'Extend Shorts W' },
    { id: '68be85ad094d08828def4613', name: 'Rush 2.0 Tights W' },
    { id: '68be85ad094d08828def4617', name: 'Rush 2.0 Tights M' },
    { id: '68be85ad094d08828def4618', name: 'Adv Join Sweat Shorts M' },
    { id: '68be85ad094d08828def4619', name: 'Ability Shorts M' },
    { id: '68be85ad094d08828def461a', name: 'Adv Join Sweat Pant W' },
    { id: '68be85ad094d08828def461b', name: 'Community 2.0 Shorts M' },
    { id: '68be85ad094d08828def461c', name: 'Craft Knickers Rush Herr' },
    { id: '68be85ad094d08828def461d', name: 'Evolve 2.0 Pants W' },
    { id: '68be85ad094d08828def461e', name: 'Adv Join Sweat Shorts W' },
    { id: '68be85ad094d08828def4620', name: 'Craft Tights Rush Dam' },
    { id: '68be85ad094d08828def4621', name: 'Rush 2.0 Training Pants W' },
    { id: '68be85ad094d08828def4622', name: 'Ability 9" Boxer M' },
    { id: '68be85ad094d08828def4623', name: 'Ability 9" Boxer W' },
    { id: '68be85ad094d08828def4625', name: 'Community 2.0 Pants M' },
    { id: '68be85ad094d08828def4626', name: 'Collective 7/8 Tights W' },
    { id: '68be85ad094d08828def4627', name: 'Ability Shorts W' },
    { id: '68be85ad094d08828def4628', name: 'Squad Go Pant Jr' },
    { id: '68be85ad094d08828def4629', name: 'Squad Go Pant W' },
    { id: '68be85ad094d08828def4719', name: 'Community 2.0 Shorts W' },
    { id: '68be85ad094d08828def471a', name: 'Rush 2.0 Short Tights Jr' },
    { id: '68be85ad094d08828def471b', name: 'Rush 2.0 Hot Pant Jr' },
    { id: '68be85ad094d08828def471f', name: 'Core Soul Zip Sweatpants Jr' },
    { id: '68be85ad094d08828def4720', name: 'Core Soul Sweatshorts Jr' },
    { id: '68be85ad094d08828def4721', name: 'Craft Mjukisshorts Community Dam' },
    { id: '68be85ad094d08828def4722', name: 'Craft Mjukisshorts Community Herr' },
    { id: '68be85ad094d08828def4723', name: 'Craft Mjukisbyxor Community Dam' },
    { id: '68be85ad094d08828def4724', name: 'Core Soul Sweatpants Jr' },
    { id: '68be85ad094d08828def4726', name: 'Progress 3/4 Pants W' },
    { id: '68be85ad094d08828def4727', name: 'Craft Mjukisshorts Community Junior' },
    { id: '68be85ad094d08828def4729', name: 'Progress 3/4 Pants Jr' },
    { id: '68be85ad094d08828def47ff', name: 'Active Comfort Pants 2 M' },
    { id: '68be85ad094d08828def4800', name: 'Active Comfort Pants 2 W' },
    { id: '68be85af094d08828def4d94', name: 'Cleek flex trousers' },
    { id: '68be85af094d08828def4d9f', name: 'Mellion Stretch trousers' },
    { id: '68be85af094d08828def4da7', name: 'Links raintrousers' },
    { id: '68be85af094d08828def4e5b', name: 'Elite capri' },
    { id: '68be85af094d08828def4e69', name: 'Links raintrousers' },
    { id: '68be85af094d08828def4e71', name: 'Bounce raintrousers' },
    { id: '68be85af094d08828def4e72', name: 'Bounce raintrousers' },
    { id: '68be85b2094d08828def580a', name: 'Basic Pants Junior' },
    { id: '68be85b2094d08828def580e', name: 'Mjukisbyxa Premium med Mudd Barn' },
    { id: '68be85b2094d08828def580f', name: 'Kids Elasticated Cuff Jog Pants' },
    { id: '68be85b2094d08828def5819', name: 'Kids Performance Shorts' },
    { id: '68be85b2094d08828def5820', name: 'Junior Sweat Pants' },
    { id: '68be85b2094d08828def5821', name: 'Kids Performance Shorts' },
    { id: '68be85b3094d08828def590c', name: 'Suncadia Kjol' },
    { id: '68be85b3094d08828def5948', name: 'ProJob - Shorts' },
    { id: '68be85b3094d08828def5949', name: 'ProJob - Shorts' },
    { id: '68be85b3094d08828def594a', name: 'ProJob - Shorts dam' },
    { id: '68be85b3094d08828def594b', name: 'ProJob - Shorts' },
    { id: '68be85b3094d08828def594c', name: 'ProJob - Shorts en iso 20471 klass 2/1' },
    { id: '68be85b3094d08828def594d', name: 'ProJob - Shorts en iso 20471 klass 2/1' },
    { id: '68be85b3094d08828def594e', name: 'ProJob - Shorts stretch' },
    { id: '68be85b3094d08828def594f', name: 'ProJob - Shorts stretch dam' },
    { id: '68be85b3094d08828def5950', name: 'ProJob - Piratbyxa stretch' },
    { id: '68be85b3094d08828def5951', name: 'ProJob - Piratbyxa en iso 20471 klass 2/1' },
    { id: '68be85b3094d08828def5952', name: 'ProJob - Shorts stretch dam' },
    { id: '68be85b3094d08828def5953', name: 'ProJob - Shortsn7510 shorts 9910-viz' },
    { id: '68be85b3094d08828def5954', name: 'ProJob - Arbetsshorts damn7514 arbetsshorts dam 9910-viz' },
    { id: '68be85b3094d08828def595a', name: 'Evolve Shorts Jr' },
    { id: '68be85b3094d08828def595b', name: 'Evolve Pants Jr' },
    { id: '68be85b3094d08828def595c', name: 'Evolve Shorts M' },
    { id: '68be85b3094d08828def595e', name: 'Evolve Slim Pants M' },
    { id: '68be85b3094d08828def5960', name: 'Progress 2.0 Shorts Jr' },
    { id: '68be85b3094d08828def5961', name: 'Evolve Zip Pocket Shorts M' },
    { id: '68be85b3094d08828def5962', name: 'Pants Warm Jr' },
    { id: '68be85b3094d08828def5963', name: 'Craft Vadderade Byxor Herr' },
    { id: '68be85b3094d08828def5964', name: 'Evolve Pants W' },
    { id: '68be85b3094d08828def5965', name: 'Evolve Slim Pants M' },
    { id: '68be85b3094d08828def5966', name: 'Evolve Zip Pocket Shorts W' },
    { id: '68be85b3094d08828def5967', name: 'Evolve Shorts W' },
    { id: '68be85b3094d08828def5969', name: 'Adv Explore Tech Pants M' },
    { id: '68be85b3094d08828def596a', name: 'Adv Unify Pants M' },
    { id: '68be85b3094d08828def596b', name: 'Adv Unify Pants W' },
    { id: '68be85b3094d08828def596c', name: 'Pants Warm W' },
    { id: '68be85b3094d08828def597e', name: 'ProJob - Shorts' },
    { id: '68be85b3094d08828def5980', name: 'ProJob - Shorts stretch' },
    { id: '68be85b3094d08828def5987', name: 'Serviceshorts' },
    { id: '68be85b3094d08828def598b', name: 'Performance Shorts' },
    { id: '68be85b3094d08828def5a1c', name: 'Adv Explore Tech Shorts W' },
    { id: '68be85b3094d08828def5a1e', name: 'Adv Nordic Ski Club Tights W' },
    { id: '68be85b3094d08828def5a20', name: 'Rush 2.0 Training Pants M' },
    { id: '68be85b3094d08828def5a25', name: 'Extend Shorts M' },
    { id: '68be85b3094d08828def5afe', name: 'Rush 2.0 Tights W' },
    { id: '68be85b3094d08828def5b00', name: 'Ability Shorts M' },
    { id: '68be85b3094d08828def5b01', name: 'Adv Join Sweat Pant W' },
    // ... and 494 more products
  ],

  // backpacks (557 products)
  'backpacks': [
    { id: '68be85ad094d08828def4761', name: 'Genève, datorryggsäck 15,6"' },
    { id: '68be85ad094d08828def4762', name: 'Florens, datorryggsäck 15,6"' },
    { id: '68be85ad094d08828def4807', name: 'Escape, backpack Bergen' },
    { id: '68be85ad094d08828def4811', name: 'Flight, backpack' },
    { id: '68be85ad094d08828def4830', name: 'Bai Roll - 15" dataryggsäck med rulltopp' },
    { id: '68be85ad094d08828def483a', name: 'MOTION BACKPACK. 600D och polypropenryggsäck' },
    { id: '68be85ad094d08828def483b', name: 'URBAN BACKPACK. 14"" laptopryggsäck i softshell och tarpaulin' },
    { id: '68be85ad094d08828def488b', name: 'Reykjavik, datorryggsäck plus 15,6' },
    { id: '68be85ad094d08828def488e', name: 'Reykjavik, datorryggsäck slim 15,6' },
    { id: '68be85ad094d08828def489e', name: 'Flight, backpack' },
    { id: '68be85ad094d08828def48fb', name: 'Duffy, backpack 14"' },
    { id: '68be85ad094d08828def48fc', name: 'Escape, backpack Bergen' },
    { id: '68be85ad094d08828def48fe', name: 'Duffy, backpack 15"' },
    { id: '68be85ae094d08828def4935', name: 'Backpack Bags' },
    { id: '68be85ae094d08828def496e', name: 'Scubaroll - Scubabag i vattentät RPET' },
    { id: '68be85ae094d08828def499b', name: 'ALASCA. Vandringsryggsäck med vattentät beläggning' },
    { id: '68be85af094d08828def4b63', name: 'Ryggsäck i polyester (600D) Dave' },
    { id: '68be85af094d08828def4c0b', name: 'Bai Backpack - 15" dataryggsäck PU' },
    { id: '68be85af094d08828def4c4d', name: 'Stockholm Backpack' },
    { id: '68be85af094d08828def4c57', name: 'Madrid Backpack' },
    { id: '68be85af094d08828def4cc3', name: 'Kamet - Rolltop-ryggsäck 390 gr/m²' },
    { id: '68be85af094d08828def4cc5', name: 'Hige - Ryggsäck 600D RPET-polyester' },
    { id: '68be85af094d08828def4ccd', name: 'Sumbag - 15" dataryggsäck' },
    { id: '68be85af094d08828def4ce3', name: 'ATENAS. 600D laptopryggsäck med 210D 17.3" foder' },
    { id: '68be85af094d08828def4d08', name: 'Buenos Aires Backpack' },
    { id: '68be85af094d08828def4dbe', name: 'LUGANE. 600D ryggsäck' },
    { id: '68be85af094d08828def4dcb', name: 'Vilnius Backpack' },
    { id: '68be85af094d08828def4dda', name: 'Warsaw Backpack' },
    { id: '68be85af094d08828def4ddb', name: 'Copenhagen Backpack' },
    { id: '68be85af094d08828def4ddc', name: 'Vienna Backpack' },
    { id: '68be85af094d08828def4dfa', name: 'Ryggsäck polyester (600D) Glynn' },
    { id: '68be85af094d08828def4e98', name: 'Kylväska ryggsäck i polyester (600D) Nicholas' },
    { id: '68be85af094d08828def4e9c', name: 'Ryggsäck i polyester (210D) med dragsko Isolde' },
    { id: '68be85af094d08828def4ea6', name: 'COVENTRY. Helt vadderad laptopryggsäck i 300D återvunnen högdensitetspolyester och 210D återvunnen p' },
    { id: '68be85af094d08828def4ec4', name: 'Ellison RPET-ryggsäck' },
    { id: '68be85b0094d08828def4f8b', name: 'GENOA BPACK. Stöldskyddsryggsäck i 600D återvunnen polyester med hög densitet' },
    { id: '68be85b0094d08828def5089', name: 'Ryggsäck i polyester (600D) Carlito' },
    { id: '68be85b0094d08828def5091', name: 'Bangkok Roll - Rolltop dataryggsäck 600D' },
    { id: '68be85b0094d08828def50cb', name: 'Flap-ryggsäck av RPET-polyester (300D) Lyric' },
    { id: '68be85b0094d08828def50e7', name: 'Challenger RPET-ryggsäck' },
    { id: '68be85b0094d08828def5105', name: 'Korovin - 15"" mjuk PU-dataryggsäck' },
    { id: '68be85b0094d08828def512b', name: 'Xpanda - Expanderbar ryggsäck 600D RPET' },
    { id: '68be85b0094d08828def517f', name: 'Ryggsäck i RPET filt Avery' },
    { id: '68be85b0094d08828def51b2', name: 'Duodraw RPET-väska med dragsko' },
    { id: '68be85b0094d08828def51bc', name: 'Slippu RPET ryggsäck för bärbar dator' },
    { id: '68be85b0094d08828def51c0', name: 'Harriot RPET-ryggsäck' },
    { id: '68be85b0094d08828def51e0', name: 'Ryggsäck av RPET-polyester (600D) Olive' },
    { id: '68be85b0094d08828def51e1', name: 'Polyester ryggsäck i RPET celeste' },
    { id: '68be85b0094d08828def51e5', name: 'Ryggsäck av polycanvas (300D) Seth' },
    { id: '68be85b0094d08828def51e6', name: 'Ryggsäck i RPET filt Eleanor' },
    { id: '68be85b0094d08828def51f6', name: 'Moreiro RPET dry bag-ryggsäck' },
    { id: '68be85b0094d08828def51ff', name: 'Arkas RPET-ryggsäck' },
    { id: '68be85b0094d08828def5222', name: 'SuboBag Back RPET-ryggsäck med tryck' },
    { id: '68be85b0094d08828def5230', name: 'Ryggsäck i RPET filt med dragsko Maya' },
    { id: '68be85b0094d08828def5235', name: 'SuboBag Back RPET-ryggsäck med tryck' },
    { id: '68be85b0094d08828def5236', name: 'SuboBag Folback vikbar RPET-ryggsäck med tryck' },
    { id: '68be85b0094d08828def5250', name: 'Laptop-ryggsäck i Polyester (600D) Nicolas' },
    { id: '68be85b0094d08828def5254', name: 'SuboBag Back Mini RPET-ryggsäck med tryck' },
    { id: '68be85b0094d08828def526d', name: 'SuboBag Picoback RPET-ryggsäck med tryck' },
    { id: '68be85b0094d08828def5284', name: 'Ryggsäck av PU-läder Senta' },
    { id: '68be85b0094d08828def528a', name: 'Rulltoppsryggsäck av RPET-polyester (600D) Evie' },
    { id: '68be85b0094d08828def52d0', name: 'Ace Aware RPET Free On Board reseväska' },
    { id: '68be85b1094d08828def533b', name: 'rPET (300D) polyester laptop ryggsäck Eulalia' },
    { id: '68be85b1094d08828def5389', name: 'Ryggsäck i rPET (600D) Henrik' },
    { id: '68be85b1094d08828def53f9', name: 'Ryggsäck i återvunnen polybomull (330 g) Thaddeus' },
    { id: '68be85b1094d08828def54c1', name: 'Ryggsäck med roll-top, av rPET polyester,(600D), Yani' },
    { id: '68be85b9094d08828def6d7d', name: 'Non-Woven Promobag GRS RPET ryggsäck' },
    { id: '68be85be094d08828def7d7b', name: 'Pine Valley Padel Ryggsäck' },
    { id: '68be85bf094d08828def7fe4', name: 'Thule EnRoute ryggsäck 23 l' },
    { id: '68be85bf094d08828def7ff7', name: 'Bobby Soft, stöldskyddad ryggsäck' },
    { id: '68be85bf094d08828def8091', name: 'Armond Aware RPET Free On Board travel pack' },
    { id: '68be85bf094d08828def8092', name: 'Ace Aware RPET Free On Board reseväska' },
    { id: '68be85bf094d08828def80b0', name: 'Bobby Explore ryggsäck' },
    { id: '68be85bf094d08828def80b1', name: 'Impact AWARE Urban outdoor ryggsäck' },
    { id: '68be85bf094d08828def80b4', name: 'Impact AWARE hikingryggsäck 18L' },
    { id: '68be85bf094d08828def8160', name: 'Impact AWARE 15" laptopryggsäck i 16 oz. återvunnen canvas' },
    { id: '68be85bf094d08828def8161', name: 'Impact AWARE 1200D 15.6"" modern laptopryggsäck' },
    { id: '68be85bf094d08828def820d', name: 'Thule Exeo Backpack 28L. Aegean Blue' },
    { id: '68be85bf094d08828def820e', name: 'Thule Indago Backpack 23L. Aegean Blue' },
    { id: '68be85bf094d08828def821c', name: 'Recycled Roll-Top Backpack' },
    { id: '68be85bf094d08828def821f', name: 'Recycled Backpack' },
    { id: '68be85bf094d08828def8265', name: 'Boomerang ryggsäck 22L' },
    { id: '68be85bf094d08828def826b', name: 'Stratta 15 laptopväska 15L' },
    { id: '68be85bf094d08828def82ba', name: 'Thule Notus Backpack 20L. Aegean Blue' },
    { id: '68be85bf094d08828def82d0', name: 'Ryggsäck R-PET' },
    { id: '68be85bf094d08828def82d2', name: 'Recycled Mini Twin Handle Roll-Top Backpack' },
    { id: '68be85bf094d08828def82fe', name: 'Trails utomhusryggsäck på 6,5 l av GRS RPET' },
    { id: '68be85bf094d08828def834c', name: 'GRS RPET Felt PromoBag Plus ryggsäck' },
    { id: '68be85bf094d08828def834d', name: 'Boutique Backpack' },
    { id: '68be85bf094d08828def834f', name: 'Ecowings Funky Falcon Backpack ryggsäck' },
    { id: '68be85bf094d08828def8353', name: 'Case Logic Commence Recycled Backpack 15,6 inch' },
    { id: '68be85bf094d08828def837f', name: 'Oregon Cooler Backpack' },
    { id: '68be85bf094d08828def839c', name: 'Joey 15" laptopväska med rullstängning av GRS-återvunnen canvas 15 liter' },
    { id: '68be85bf094d08828def83a3', name: 'Impact AWARE 15" laptopryggsäck i 16 oz. återvunnen canvas' },
    { id: '68be85bf094d08828def83a4', name: 'Impact AWARE 1200D 15.6"" modern laptopryggsäck' },
    { id: '68be85bf094d08828def83a5', name: 'Armond 15.6" deluxe laptopryggsäck AWARE RPET' },
    { id: '68be85bf094d08828def83a6', name: 'Impact AWARE 300D two tone lyxig 15.6" laptopryggsäck' },
    { id: '68be85bf094d08828def83a8', name: 'Bizz ryggsäck' },
    { id: '68be85bf094d08828def83a9', name: 'Impact AWARE Urban outdoor ryggsäck' },
    { id: '68be85bf094d08828def83ab', name: 'Herschel Retreat återvunnen datorryggsäck 23 liter' },
    // ... and 457 more products
  ],

  // laptop-bags (555 products)
  'laptop-bags': [
    { id: '68be85ad094d08828def472a', name: 'Case Logic Advantage 14" Attaché. Svart' },
    { id: '68be85ad094d08828def472b', name: 'Case Logic Advantage 15,6" Attaché. Svart' },
    { id: '68be85ad094d08828def4757', name: 'Florens, datorväska dam 15"' },
    { id: '68be85ad094d08828def4759', name: 'Sandhamn, ryggsäck' },
    { id: '68be85ad094d08828def475b', name: 'Florens, datorväska 2­fack 15,6"' },
    { id: '68be85ad094d08828def4806', name: 'Escape, rollTop Dull rubber PU 17"' },
    { id: '68be85ad094d08828def4825', name: 'Escape, backpack Bergen' },
    { id: '68be85ad094d08828def4870', name: 'Case Logic 10" PC / iPad® Sleeve. Brun och rött' },
    { id: '68be85ad094d08828def4871', name: 'Case Logic PC Bag. Brown' },
    { id: '68be85ad094d08828def488a', name: 'Escape, backpack Dull rubber PU 15"' },
    { id: '68be85ad094d08828def4893', name: 'Escape, backpack Dull rubber PU 17"' },
    { id: '68be85ad094d08828def4899', name: 'Escape, computerbag/sleeve 15"' },
    { id: '68be85ad094d08828def48fd', name: 'Escape, rollTop Dull rubber PU 17"' },
    { id: '68be85ae094d08828def4923', name: 'Case Logic Bag for iPad/Laptop 11". Dress Blue' },
    { id: '68be85ae094d08828def4939', name: 'Jacob RNYLON ryggsäck' },
    { id: '68be85ae094d08828def4943', name: 'Astor RPET-ryggsäck' },
    { id: '68be85ae094d08828def49e3', name: 'Carnegie RPET-ryggsäck' },
    { id: '68be85ae094d08828def4ac3', name: 'Refelt Docu Dokumentväska av RPET-filt' },
    { id: '68be85ae094d08828def4ac9', name: 'Rebyss Roll ryggsäck i återvunnen bomull' },
    { id: '68be85ae094d08828def4ae0', name: 'Laugar - 15"" smidig dataryggsäck' },
    { id: '68be85af094d08828def4b83', name: 'BUSINESS. 300D 100% rPET ryggsäck för laptop' },
    { id: '68be85af094d08828def4c51', name: 'New York Backpack' },
    { id: '68be85af094d08828def4c56', name: 'Milan Backpack' },
    { id: '68be85af094d08828def4c6f', name: 'RE-BOSTON. 2 Tone återvunnen nylon vattentät laptopryggsäck med 210D återvunnet polyester' },
    { id: '68be85af094d08828def4d02', name: 'Edinburgh Backpack' },
    { id: '68be85af094d08828def4d05', name: 'Sydney Backpack' },
    { id: '68be85af094d08828def4d09', name: 'Amsterdam Backpack' },
    { id: '68be85af094d08828def4d0b', name: 'Oslo Backpack' },
    { id: '68be85af094d08828def4d17', name: 'Lisbon Backpack' },
    { id: '68be85af094d08828def4d1b', name: 'Wellington Backpack' },
    { id: '68be85af094d08828def4d21', name: 'Berlin Backpack' },
    { id: '68be85af094d08828def4dd6', name: 'Tallin Backpack' },
    { id: '68be85af094d08828def4de6', name: 'Abrantes Backpack' },
    { id: '68be85af094d08828def4dfb', name: 'Ryggsäck lätt SCHWARZWOLF PIRIN' },
    { id: '68be85af094d08828def4e78', name: 'Cape Town Backpack' },
    { id: '68be85af094d08828def4e79', name: 'Prague Backpack' },
    { id: '68be85af094d08828def4e7f', name: 'Budapest Backpack' },
    { id: '68be85af094d08828def4e80', name: 'Bucharest Backpack' },
    { id: '68be85af094d08828def4e8b', name: 'Paris Backpack' },
    { id: '68be85af094d08828def4e99', name: 'Ryggsäck i återvunnen polybomull (330 g) Seraphina' },
    { id: '68be85af094d08828def4ea3', name: 'FELPY SLEEVE. Laptopväska i återvunnen filt (100% rPET)' },
    { id: '68be85af094d08828def4ecd', name: 'Stanford RPET-ryggsäck' },
    { id: '68be85af094d08828def4ed1', name: 'Leirur - 15"" dataryggsäck' },
    { id: '68be85b0094d08828def4f0a', name: 'GENOA. Vadderad laptopväska i 600D återvunnen polyester med hög densitet 15"' },
    { id: '68be85b0094d08828def4f3c', name: 'Stanford RPET-ryggsäck' },
    { id: '68be85b0094d08828def5018', name: 'Rollex RPET-ryggsäck' },
    { id: '68be85b0094d08828def5051', name: 'Kellogg Ryggsäck för RPET-dokument' },
    { id: '68be85b0094d08828def50d2', name: 'Rebyss Back ryggsäck i återvunnen bomull' },
    { id: '68be85b0094d08828def50dd', name: 'Ducket RPET-ryggsäck' },
    { id: '68be85b0094d08828def50df', name: 'Doheny ryggsäck' },
    { id: '68be85b0094d08828def50e9', name: 'Prenson RPET-ryggsäck' },
    { id: '68be85b0094d08828def5110', name: 'Laptopfodral i RPET filt Emilia' },
    { id: '68be85b0094d08828def515d', name: 'Laptopväska i RPET filt Layla' },
    { id: '68be85b0094d08828def5175', name: 'Laptopfodral i filt RPET Jonathan' },
    { id: '68be85b0094d08828def518c', name: 'Pullex RPU-ryggsäck' },
    { id: '68be85b0094d08828def518d', name: 'Eaton RPET Ryggsäck för dokument' },
    { id: '68be85b0094d08828def5192', name: 'Mellon RPET-ryggsäck' },
    { id: '68be85b0094d08828def5198', name: 'Antistöld-ryggsäck för laptop av RPET-polyester (300D) Callio' },
    { id: '68be85b0094d08828def51f4', name: 'Melville RPET-ryggsäck' },
    { id: '68be85b0094d08828def5204', name: 'Refelt Courier RPET budväska i filt' },
    { id: '68be85b0094d08828def5216', name: 'Refelt Roll RPET-ryggsäck av filt' },
    { id: '68be85b0094d08828def5217', name: 'SuboBag Slimback RPET-ryggsäck för bärbar dator med tryck' },
    { id: '68be85b0094d08828def5220', name: 'Refelt Comp Laptopväska i RPET-filt' },
    { id: '68be85b0094d08828def522e', name: 'Rulltoppsryggsäck i polyester (600D) Oberon' },
    { id: '68be85b0094d08828def5286', name: 'Ryggsäck i rPET polyester (300D) Malcolm' },
    { id: '68be85b0094d08828def52b4', name: 'Ryggsäck i återvunnen polybomull (330 gsm) Osric' },
    { id: '68be85b0094d08828def52b8', name: 'Ryggsäck i rPET polyester (300D) Mallory' },
    { id: '68be85b1094d08828def5306', name: 'Ryggsäck i rPET polyester (300D) Mallory' },
    { id: '68be85b1094d08828def5310', name: 'Thule Crossover 2 Boarding Bag 25L. Svart' },
    { id: '68be85bf094d08828def7fe8', name: 'MMV Luton Portfölj' },
    { id: '68be85bf094d08828def7fe9', name: 'MMV Luton Laptopfodral' },
    { id: '68be85bf094d08828def7ffd', name: 'Byron 15,6 tums ryggsäck med rullöppning på 18 l av GRS RPET' },
    { id: '68be85bf094d08828def80ad', name: 'Joey 14" laptopfodral av GRS-återvunnen canvas 2 liter' },
    { id: '68be85bf094d08828def80b6', name: 'Impact AWARE ryggsäck i 16 oz. återvunnen canvas' },
    { id: '68be85bf094d08828def80b7', name: 'Impact AWARE 300D RPET casual ryggsäck' },
    { id: '68be85bf094d08828def8222', name: 'Nolan Recycle RPET ryggsäck' },
    { id: '68be85bf094d08828def825d', name: 'Bobby Hero Small, stöldskyddad ryggsäck' },
    { id: '68be85bf094d08828def8261', name: 'Byron 15,6 tums ryggsäck med rullöppning på 18 l av GRS RPET' },
    { id: '68be85bf094d08828def8262', name: 'Trails ryggsäck 24L' },
    { id: '68be85bf094d08828def8264', name: 'Soft Daypack' },
    { id: '68be85bf094d08828def8266', name: 'Bobby Hero Regular, stöldskyddad ryggsäck' },
    { id: '68be85bf094d08828def8267', name: 'Cover GRS RPET stöldskyddad ryggsäck 18L' },
    { id: '68be85bf094d08828def8268', name: 'Bobby Hero XL, stöldskyddad ryggsäck' },
    { id: '68be85bf094d08828def8269', name: 'Bobby Hero Small, stöldskyddad ryggsäck' },
    { id: '68be85bf094d08828def826c', name: 'Byron 15,6 tums ryggsäck med rullöppning på 18 l av GRS RPET' },
    { id: '68be85bf094d08828def826d', name: 'Compu 15.6" Datorryggsäck 14L' },
    { id: '68be85bf094d08828def826e', name: 'Vault RFID 15" datorryggsäck 16L' },
    { id: '68be85bf094d08828def826f', name: 'Soft Daypack' },
    { id: '68be85bf094d08828def8270', name: 'Hoss 15,6 laptop-ryggsäck 16L' },
    { id: '68be85bf094d08828def82f7', name: 'Cover GRS RPET stöldskyddad ryggsäck 18L' },
    { id: '68be85bf094d08828def82f8', name: 'Hoss 15,6 upprullningsbar laptopväska återvunnen GRS 12 liter' },
    { id: '68be85bf094d08828def82f9', name: 'Basic laptopväska 15' },
    { id: '68be85bf094d08828def82fa', name: 'Impact AWARE RPET Basic 15.6" laptopryggsäck' },
    { id: '68be85bf094d08828def82fb', name: 'Canvas laptopryggsäck, PVC-fri' },
    { id: '68be85bf094d08828def82fc', name: 'Impact AWARE RPET 15.6" laptopväska' },
    { id: '68be85bf094d08828def82fd', name: 'Impact AWARE RPET stöldskyddad 15.6" laptopryggsäck' },
    { id: '68be85bf094d08828def82ff', name: 'PU 15.6" laptopryggsäck' },
    { id: '68be85bf094d08828def8300', name: 'Bobby Bizz 2.0 stöldskyddad ryggsäck & laptopväska' },
    { id: '68be85bf094d08828def8399', name: 'Bobby Bizz 2.0 stöldskyddad ryggsäck & laptopväska' },
    { id: '68be85bf094d08828def839b', name: 'Joey 14" laptopfodral av GRS-återvunnen canvas 2 liter' },
    // ... and 455 more products
  ],

  // sportflaskor (455 products)
  'sportflaskor': [
    { id: '68be85ad094d08828def4636', name: 'Rebig Moss - Enväggig flaska 750ml' },
    { id: '68be85ad094d08828def469b', name: 'PORTIS GLASS. Glasflaska med PP-lock 500 mL' },
    { id: '68be85ad094d08828def469d', name: 'LANDSCAPE L. Sportflaska i aluminium med karbinhake 800 mL' },
    { id: '68be85ad094d08828def46a1', name: 'COLLINA. Aluminiumflaska med karbinhake 540 mL' },
    { id: '68be85ad094d08828def47a9', name: 'QUETA. Aluminiumflaska med bambulock 550 ml' },
    { id: '68be85ad094d08828def47aa', name: 'TYSON. PETG sportflaska 1230 ml' },
    { id: '68be85ad094d08828def482f', name: 'Chai - Glasflaska 500 ml i  fodral' },
    { id: '68be85ad094d08828def4849', name: 'Dolba RPET-flaska' },
    { id: '68be85ad094d08828def4868', name: 'BISTRO 450. Plastflaska 450ml' },
    { id: '68be85ad094d08828def48dc', name: 'Dolba RPET-flaska' },
    { id: '68be85ad094d08828def48e3', name: 'Pumori Isolerad flaska' },
    { id: '68be85ad094d08828def48f4', name: 'Sea - Tritan Renew?-flaska 500ml' },
    { id: '68be85ad094d08828def4901', name: 'SHAWN. Sportflaska i 100% recycled aluminium 660 mL' },
    { id: '68be85ae094d08828def4947', name: 'Zoboo Aluminiumflaska' },
    { id: '68be85ae094d08828def49d8', name: 'Pemboo RPET-flaska' },
    { id: '68be85ae094d08828def4a0d', name: 'Athena Plus - Flaska med enkel vägg 750 ml' },
    { id: '68be85ae094d08828def4a12', name: 'Bay - Tritan Renew?-flaska 650ml' },
    { id: '68be85ae094d08828def4a80', name: 'RE-LANDSCAPE M. Återvunnen aluminiumflaska med karbinhake 530 mL' },
    { id: '68be85af094d08828def4b61', name: 'Flaska i RPET (750 ml)  Timothy' },
    { id: '68be85af094d08828def4b6f', name: 'RE-LANDSCAPE M. Återvunnen aluminiumflaska med karbinhake 530 mL' },
    { id: '68be85af094d08828def4bc9', name: 'Recouver Isolerad flaska' },
    { id: '68be85af094d08828def4bca', name: 'Monbo Aluminiumflaska' },
    { id: '68be85af094d08828def4bfc', name: 'Florence Sing - Flaska med enkel vägg 500 ml' },
    { id: '68be85af094d08828def4c00', name: 'Athena Mid - Flaska med enkel vägg 500 ml' },
    { id: '68be85af094d08828def4c09', name: 'Sound - Tritan Renew?-flaska 800ml' },
    { id: '68be85af094d08828def4c32', name: 'Flaska RPET Lila (500 ml)' },
    { id: '68be85af094d08828def4c41', name: 'Mississippi 550 Bottle' },
    { id: '68be85af094d08828def4c46', name: 'Mississippi 1100 Bottle' },
    { id: '68be85af094d08828def4c48', name: 'Mississippi 450 Bottle' },
    { id: '68be85af094d08828def4c4b', name: 'Mississippi 800 Bottle' },
    { id: '68be85af094d08828def4c60', name: 'Volga Bottle' },
    { id: '68be85af094d08828def4c92', name: 'Recouver Isolerad flaska' },
    { id: '68be85af094d08828def4ccb', name: 'Spot - Flaska med enkel vägg 500 ml' },
    { id: '68be85af094d08828def4d27', name: 'Arkansas 500 Bottle' },
    { id: '68be85af094d08828def4dca', name: 'Arkansas 500 Bottle' },
    { id: '68be85af094d08828def4dcd', name: 'Yukon Bottle' },
    { id: '68be85af094d08828def4dcf', name: 'Mackenzie Bottle' },
    { id: '68be85af094d08828def4ddd', name: 'Indus Bottle' },
    { id: '68be85af094d08828def4de3', name: 'Arkansas 350 Bottle' },
    { id: '68be85af094d08828def4dea', name: 'Mississippi 450P Bottle' },
    { id: '68be85af094d08828def4e2d', name: 'Reskin RPE sportflaska' },
    { id: '68be85af094d08828def4e82', name: 'Mississippi 800P Bottle' },
    { id: '68be85af094d08828def4e85', name: 'Mississippi 550P Bottle' },
    { id: '68be85af094d08828def4e86', name: 'Mississippi 1100P Bottle' },
    { id: '68be85af094d08828def4ebb', name: 'Monbo XL Aluminiumflaska' },
    { id: '68be85af094d08828def4ed6', name: 'Kolapsi - Hopvikbar flaska 500ml' },
    { id: '68be85af094d08828def4eef', name: 'La Plata Bottle' },
    { id: '68be85af094d08828def4ef0', name: 'Zambezi 1500 Bottle' },
    { id: '68be85af094d08828def4ef2', name: 'Parana Bottle' },
    { id: '68be85af094d08828def4ef3', name: 'Zambezi 1000 Bottle' },
    { id: '68be85b0094d08828def4f14', name: 'Flaska RPET Ahmed' },
    { id: '68be85b0094d08828def4f86', name: 'rPET flaska (600 ml) Ruth' },
    { id: '68be85b0094d08828def4ff9', name: 'Tottle - RPET-flaska 750 ml' },
    { id: '68be85b0094d08828def5021', name: 'Fitty RPET sportflaska' },
    { id: '68be85b0094d08828def5026', name: 'Repetto RPET-flaska' },
    { id: '68be85b0094d08828def502e', name: 'rPET flaska 500 ml Laia' },
    { id: '68be85b0094d08828def5034', name: 'Sporttle - RPET-flaska 500 ml' },
    { id: '68be85b0094d08828def5043', name: 'Kumba RPET-flaska' },
    { id: '68be85b0094d08828def5044', name: 'Colba RPET-flaska' },
    { id: '68be85b0094d08828def507f', name: 'Glasflaska (500 ml) Anouk' },
    { id: '68be85b0094d08828def508c', name: 'RPET-drickflaska (1000 ml) Brinley' },
    { id: '68be85b0094d08828def509b', name: 'Fitba RPET sportflaska' },
    { id: '68be85b0094d08828def509c', name: 'Resip RPET-flaska' },
    { id: '68be85b0094d08828def50e8', name: 'Pemba Creative RPET-flaska' },
    { id: '68be85b0094d08828def50ec', name: 'Geiser - Flaska enkelvägg 700 ml' },
    { id: '68be85b0094d08828def50ed', name: 'Isforden Mark - Sportflaska RPET 1L' },
    { id: '68be85b0094d08828def50f4', name: 'Isjforden - RPET flaska 700 ml' },
    { id: '68be85b0094d08828def5140', name: 'Dricksflaska rPET enkelväggig (750 ml) Aisling' },
    { id: '68be85b0094d08828def516a', name: 'Glasflaska (500 ml) Maxwell' },
    { id: '68be85b0094d08828def5185', name: 'Pemba Creative RPET-flaska' },
    { id: '68be85b0094d08828def5231', name: 'rPET flaska (730 ml) Manfred' },
    { id: '68be85b0094d08828def5233', name: 'Hopfällbar dricksflaska i silikon (550 ml) Erin' },
    { id: '68be85ba094d08828def6f36', name: 'Vildmark Retro 0.5L' },
    { id: '68be85ba094d08828def6f37', name: 'Vildmark Sport 0.5L' },
    { id: '68be85ba094d08828def6f64', name: 'Contigo® Jackson 2.0 720 ml drickflaska' },
    { id: '68be85ba094d08828def6f68', name: 'Contigo® Ashland Tritan? Renew from Eastman 720 ml' },
    { id: '68be85ba094d08828def6f6a', name: 'Contigo® Cortland Tritan? Renew from Eastman 720 ml' },
    { id: '68be85ba094d08828def6fdd', name: 'Vildmark Retro 0.5L' },
    { id: '68be85ba094d08828def6fe2', name: 'Contigo® Cortland Tritan? Renew from Eastman 720 ml' },
    { id: '68be85be094d08828def7ca4', name: 'H2O Active® Eco Base 650 ml sportflaska med uppfällbart lock' },
    { id: '68be85be094d08828def7ca5', name: 'H2O Active® Base 650 ml sportflaska med piplock' },
    { id: '68be85be094d08828def7ca6', name: 'H2O Active® Eco Base 650 ml sportflaska med kupollock' },
    { id: '68be85be094d08828def7ca8', name: 'H2O Active® Bop 500 ml sportflaska med piplock' },
    { id: '68be85be094d08828def7caa', name: 'H2O Active® Eco Base 650 ml sportflaska med piplock' },
    { id: '68be85be094d08828def7cab', name: 'Baseline® Plus 650 ml sportflaska med sportlock' },
    { id: '68be85be094d08828def7cac', name: 'H2O Active® Base 650 ml sportflaska med uppfällbart lock' },
    { id: '68be85be094d08828def7cad', name: 'H2O Active® Pulse 600 ml sportflaska med piplock' },
    { id: '68be85be094d08828def7caf', name: 'HydroFlex 500 ml klämbar sportflaska' },
    { id: '68be85be094d08828def7cb0', name: 'Baseline® Plus grip 500 ml sportflaska med sportlock' },
    { id: '68be85be094d08828def7cb2', name: 'Baseline® Plus 500 ml flaska med sportlock' },
    { id: '68be85be094d08828def7cb3', name: 'Supra 1 l vakuumisolerad sportflaska i koppar med två lock' },
    { id: '68be85be094d08828def7cb4', name: 'Baseline® Plus 750 ml flaska med sportlock' },
    { id: '68be85be094d08828def7cb5', name: 'Baseline® Plus 500 ml sportflaska med uppfällbart lock' },
    { id: '68be85be094d08828def7cb7', name: 'Baseline® Plus grip 500 ml sportflaska med uppfällbart lock' },
    { id: '68be85be094d08828def7cb8', name: 'Baseline® Plus grip 750 ml sportflaska med sportlock' },
    { id: '68be85be094d08828def7cb9', name: 'Baseline® Plus grip 750 ml sportflaska med uppfällbart lock' },
    { id: '68be85be094d08828def7cba', name: 'Bodhi 500 ml sportflaska' },
    { id: '68be85be094d08828def7cbb', name: 'Baseline® Plus 750 ml sportflaska med uppfällbart lock' },
    { id: '68be85be094d08828def7cbc', name: 'H2O Active® Base 650 ml sportflaska med kupollock' },
    { id: '68be85be094d08828def7cbd', name: 'Baseline® Plus 650 ml sportflaska med uppfällbart lock' },
    // ... and 355 more products
  ],

  // beanies (443 products)
  'beanies': [
    { id: '68be85ad094d08828def459c', name: 'CARL. återvunnen polyester (100% rPET) unisex mössa' },
    { id: '68be85ad094d08828def45a6', name: 'HAWK. återvunnen polyester (100% rPET) unisex mössa' },
    { id: '68be85ad094d08828def47f1', name: 'Jersey Beanie' },
    { id: '68be85ad094d08828def47f3', name: 'Heavy Knit Beanie' },
    { id: '68be85ae094d08828def4969', name: 'Shimas Hat - Stickad mössa med julmotiv' },
    { id: '68be85ae094d08828def4974', name: 'Edda junior - trikåmössa' },
    { id: '68be85ae094d08828def4975', name: 'Sotarmössa Tor - Akryl' },
    { id: '68be85ae094d08828def4976', name: 'Mimer - fleecefoder' },
    { id: '68be85ae094d08828def4977', name: 'Menja - pannband' },
    { id: '68be85ae094d08828def4978', name: 'Sunna - trikåmössa' },
    { id: '68be85ae094d08828def4979', name: 'Embla - trikåmössa' },
    { id: '68be85ae094d08828def497a', name: 'Tyra - Fairtrade' },
    { id: '68be85ae094d08828def497b', name: 'Frigg - supportermössa' },
    { id: '68be85ae094d08828def497c', name: 'Edda - trikåmössa' },
    { id: '68be85ae094d08828def497d', name: 'Einar - stickad mössa' },
    { id: '68be85ae094d08828def497e', name: 'Ymer - stickad mössa' },
    { id: '68be85ae094d08828def497f', name: 'Oden - stickad mössa' },
    { id: '68be85ae094d08828def4980', name: 'Bure - stickad mössa' },
    { id: '68be85ae094d08828def4981', name: 'Arvid - sportmössa i Lyocell' },
    { id: '68be85ae094d08828def4af6', name: 'Original Cuffed Beanie' },
    { id: '68be85ae094d08828def4af7', name: 'Snowstar® Beanie' },
    { id: '68be85ae094d08828def4af8', name: 'Original Pull-On Beanie' },
    { id: '68be85ae094d08828def4af9', name: 'Original Pom Pom Beanie' },
    { id: '68be85ae094d08828def4afa', name: 'Sotarmössa - Heritage' },
    { id: '68be85ae094d08828def4afb', name: 'Oversized Cuffed Beanie' },
    { id: '68be85ae094d08828def4afc', name: 'Corkscrew Pom Pom Beanie' },
    { id: '68be85ae094d08828def4afd', name: 'Original Patch Beanie' },
    { id: '68be85ae094d08828def4afe', name: 'Snowstar® Patch Beanie' },
    { id: '68be85ae094d08828def4aff', name: 'Skepparmössa - Trawler' },
    { id: '68be85ae094d08828def4b00', name: 'Snowstar® Two-Tone Beanie' },
    { id: '68be85ae094d08828def4b01', name: 'Faux Fur Pop Pom Chunky Beanie' },
    { id: '68be85ae094d08828def4b02', name: 'Stadium Beanie' },
    { id: '68be85ae094d08828def4b03', name: 'Fair Isle Snowstar® Beanie' },
    { id: '68be85ae094d08828def4b04', name: 'Hemsedal Cotton Beanie' },
    { id: '68be85ae094d08828def4b05', name: 'Thermal Snowstar® Beanie' },
    { id: '68be85ae094d08828def4b06', name: 'Jersey Beanie' },
    { id: '68be85ae094d08828def4b07', name: 'Recycled Fleece Hood' },
    { id: '68be85ae094d08828def4b08', name: 'Chunky Ribbed Beanie' },
    { id: '68be85ae094d08828def4b09', name: 'Cable Knit Melange Beanie' },
    { id: '68be85ae094d08828def4b0a', name: 'Verbier Fur Pop Pom Chunky Beanie' },
    { id: '68be85ae094d08828def4b0b', name: 'Hemsedal Cotton Slouch Beanie' },
    { id: '68be85ae094d08828def4b0c', name: 'Blizzard Bobble Beanie' },
    { id: '68be85ae094d08828def4b0d', name: 'Ombré Beanie' },
    { id: '68be85ae094d08828def4b0e', name: 'Slouch Beanie' },
    { id: '68be85ae094d08828def4b0f', name: 'Junior Fur Pom Pom Chunky Beanie' },
    { id: '68be85ae094d08828def4b10', name: 'Junior Snowstar® Beanie' },
    { id: '68be85ae094d08828def4b11', name: 'Thinsulate Patch Beanie' },
    { id: '68be85ae094d08828def4b12', name: 'Junior Reflective Bobble Beanie' },
    { id: '68be85ae094d08828def4b13', name: 'Engineered Knit Ribbed Beanie' },
    { id: '68be85ae094d08828def4b14', name: 'Hygge Beanie' },
    { id: '68be85ae094d08828def4b15', name: 'Junior Original Cuffed Beanie' },
    { id: '68be85af094d08828def4b16', name: 'Reflective Beanie' },
    { id: '68be85af094d08828def4b17', name: 'Junior Original Pom Pom Beanie' },
    { id: '68be85af094d08828def4b18', name: 'Harbour Beanie' },
    { id: '68be85af094d08828def4b19', name: 'Active Performance Beanie' },
    { id: '68be85af094d08828def4b1a', name: 'Recycled Snowstar Beanie' },
    { id: '68be85af094d08828def4b1b', name: 'Organic Cotton Original Cuffed Beanie' },
    { id: '68be85af094d08828def4bd5', name: 'Hygge Striped Beanie' },
    { id: '68be85af094d08828def4bd6', name: 'Original Deep Cuffed Beanie' },
    { id: '68be85af094d08828def4bd7', name: 'Recycled Original Cuffed Beanie' },
    { id: '68be85af094d08828def4bd8', name: 'Organic Cotton Snowstar Beanie' },
    { id: '68be85af094d08828def4bd9', name: 'Classic Waffle Knit Beanie' },
    { id: '68be85af094d08828def4bda', name: 'Merino Beanie' },
    { id: '68be85af094d08828def4bdb', name: 'Water Repellent Thermal Snowstar Beanie' },
    { id: '68be85af094d08828def4bdc', name: 'Recycled Fleece Cuffed Beanie' },
    { id: '68be85af094d08828def4bdd', name: 'Recycled Mini Fisherman Beanie' },
    { id: '68be85af094d08828def4bde', name: 'Organic Cotton Waffle Beanie' },
    { id: '68be85af094d08828def4bdf', name: 'Classic Engineered Deep Cuffed Beanie' },
    { id: '68be85af094d08828def4be0', name: 'Recycled Original Pull-On Beanie' },
    { id: '68be85af094d08828def4be1', name: 'Water Repellent Thermal Elements Beanie' },
    { id: '68be85af094d08828def4be2', name: 'Removable Patch Thinsulate Beanie' },
    { id: '68be85af094d08828def4be3', name: 'Recycled Fleece Pull-On Beanie' },
    { id: '68be85af094d08828def4be4', name: 'Water Repellent Active Beanie' },
    { id: '68be85af094d08828def4be5', name: 'Fashion Patch Beanie' },
    { id: '68be85af094d08828def4be6', name: 'Deep Cuffed Tonal Patch Beanie' },
    { id: '68be85af094d08828def4be7', name: 'Apres Beanie' },
    { id: '68be85af094d08828def4be8', name: 'Cosy Ribbed Beanie' },
    { id: '68be85af094d08828def4be9', name: 'Striped Fan Beanie' },
    { id: '68be85af094d08828def4bea', name: 'Circular Fashion Patch Beanie' },
    { id: '68be85af094d08828def4beb', name: 'Junior Corkscrew Pom Pom Beanie' },
    { id: '68be85af094d08828def4bec', name: 'Polylana® Original Cuffed Beanie' },
    { id: '68be85af094d08828def4bed', name: 'Circular Patch Beanie' },
    { id: '68be85af094d08828def4bef', name: 'Applique" Patch Pom Beanie' },
    { id: '68be85af094d08828def4bf0', name: 'Organic Cotton Engineered Patch Beanie' },
    { id: '68be85af094d08828def4bf1', name: 'Original Deep Cuffed Striped Beanie' },
    { id: '68be85af094d08828def4bf2', name: 'Appliqué Patch Beanie' },
    { id: '68be85af094d08828def4bf3', name: 'Polylana® Ribbed Beanie' },
    { id: '68be85af094d08828def4bf4', name: 'Multi-Sport Fan Beanie' },
    { id: '68be85af094d08828def4bf5', name: 'Organic Cotton Kids Beanie' },
    { id: '68be85af094d08828def4bf6', name: 'Colour Block Beanie' },
    { id: '68be85af094d08828def4bf7', name: 'Zip Patch Beanie' },
    { id: '68be85af094d08828def4bf8', name: 'Chunky Knitted Patch Beanie' },
    { id: '68be85af094d08828def4c54', name: 'Tupac Beanie' },
    { id: '68be85af094d08828def4c58', name: 'Cobain Beanie' },
    { id: '68be85af094d08828def4c5c', name: 'Marley Beanie' },
    { id: '68be85af094d08828def4cb3', name: 'Oversized Hand-Knitted Beanie' },
    { id: '68be85af094d08828def4d77', name: 'Capnit - Unisex mössa RPET polyester' },
    { id: '68be85b0094d08828def502d', name: 'Mössa Kontrast' },
    { id: '68be85b0094d08828def506b', name: 'Shimas Light - Stickad julmössa LED' },
    { id: '68be85b0094d08828def50cd', name: 'Mössa Jersey' },
    // ... and 343 more products
  ],

  // keychains (371 products)
  'keychains': [
    { id: '68be85ad094d08828def475f', name: 'Florens, nyckelring' },
    { id: '68be85ad094d08828def4783', name: 'Polly - Flytande nyckelringsarmband' },
    { id: '68be85ad094d08828def4837', name: 'Strokey - Nyckelring med PU-rem' },
    { id: '68be85ad094d08828def4878', name: 'Gancho - Karbinhake i aluminium.' },
    { id: '68be85ad094d08828def48ee', name: 'Parcelo nyckelring med papperskniv' },
    { id: '68be85ae094d08828def493b', name: 'Ralubiner nyckelring' },
    { id: '68be85ae094d08828def493c', name: 'Woody Plus C anpassad nyckelring' },
    { id: '68be85ae094d08828def4946', name: 'Woody Plus D anpassad nyckelring' },
    { id: '68be85ae094d08828def49d9', name: 'Woody Plus A anpassad nyckelring' },
    { id: '68be85ae094d08828def49e4', name: 'Raboo minificklampa' },
    { id: '68be85ae094d08828def4a0c', name: 'Tokley - Nyckelring + kundvagnsmynt ?1' },
    { id: '68be85ae094d08828def4abb', name: 'Woody Plus B anpassad nyckelring' },
    { id: '68be85ae094d08828def4acc', name: 'RaluCart nyckelring för vagnmynt' },
    { id: '68be85ae094d08828def4ae1', name: 'Multikey - Nyckelring + kundvagnsmynt 1?' },
    { id: '68be85af094d08828def4bc8', name: 'Rutto flasköppnare ficklampa' },
    { id: '68be85af094d08828def4c9f', name: 'Wokke nyckelring, oval' },
    { id: '68be85af094d08828def4ce4', name: '11147. Nyckelring' },
    { id: '68be85af094d08828def4d67', name: 'Ralutag nyckelring' },
    { id: '68be85b0094d08828def4ffc', name: 'Lircle - Nyckelring i rund form' },
    { id: '68be85b0094d08828def5035', name: 'Louse - Husformad nyckelring' },
    { id: '68be85b0094d08828def5037', name: 'Lar - Bilformad nyckelring' },
    { id: '68be85b0094d08828def5046', name: 'Biropi nyckelring med flasköppnare' },
    { id: '68be85b0094d08828def5161', name: 'Nyckelring av äppelläder och PU Sabrina' },
    { id: '68be85b0094d08828def51b3', name: 'Multilevel multifunktionell nyckelring' },
    { id: '68be85b0094d08828def51c1', name: 'Woody Strap nyckelring med tryck, rektangel' },
    { id: '68be85b0094d08828def51fc', name: 'Nitidus nyckelring' },
    { id: '68be85b0094d08828def5200', name: 'Bookey nyckelring, rektangel' },
    { id: '68be85b0094d08828def5206', name: 'Ritidus nyckelring' },
    { id: '68be85b0094d08828def520c', name: 'Sitidus nyckelring' },
    { id: '68be85b0094d08828def5213', name: 'Speculo nyckelring' },
    { id: '68be85b0094d08828def5218', name: 'Spinitus nyckelring' },
    { id: '68be85b5094d08828def6385', name: 'Carrera Recycled Alu öppnare / nyckelring' },
    { id: '68be85b6094d08828def648b', name: 'Rallop nyckelring med flasköppnare' },
    { id: '68be85b8094d08828def6974', name: 'Imba - Husformad nyckering' },
    { id: '68be85b8094d08828def6976', name: 'Reflexväst Nyckelring med tryck' },
    { id: '68be85b8094d08828def6977', name: 'Polly - Flytande nyckelringsarmband' },
    { id: '68be85b8094d08828def697a', name: 'Boutique Key Clip' },
    { id: '68be85b8094d08828def697c', name: 'CreaFob specialtillverkad nyckelring' },
    { id: '68be85b8094d08828def697d', name: 'Skyway' },
    { id: '68be85b8094d08828def697e', name: 'Bobby' },
    { id: '68be85b8094d08828def697f', name: 'Industrial' },
    { id: '68be85b8094d08828def6981', name: 'Felty nyckelring med tryck, rektangel' },
    { id: '68be85b8094d08828def6990', name: 'Sanlight - Nyckelrings lampa' },
    { id: '68be85b8094d08828def6991', name: 'Arizo - Aluminium ficklampa i nyckelrin' },
    { id: '68be85b8094d08828def6992', name: 'Litop - Ficklampa med nyckelring' },
    { id: '68be85b8094d08828def6993', name: 'Nyckelhållare, med lampa ABS 2-in-1' },
    { id: '68be85b8094d08828def6994', name: 'Nyckelring Lampa med tryck' },
    { id: '68be85b8094d08828def6995', name: 'Loi - Nyckelring med LED-lampa' },
    { id: '68be85b8094d08828def6996', name: 'Ficklampa, 2-i-1, med nyckelring, i aluminium, Anna' },
    { id: '68be85b8094d08828def6997', name: 'LERGAN. Nyckelring i aluminium med 3 LED-lamper' },
    { id: '68be85b8094d08828def6998', name: 'Minificklampa, i aluminium, med karbinhake, Tracy' },
    { id: '68be85b8094d08828def699b', name: 'Waipei minificklampa' },
    { id: '68be85b8094d08828def699c', name: 'Taipei minificklampa' },
    { id: '68be85b8094d08828def699d', name: 'Raboo minificklampa' },
    { id: '68be85b8094d08828def699e', name: 'Rutto flasköppnare ficklampa' },
    { id: '68be85b8094d08828def699f', name: 'Tao Nyckelring med tryck' },
    { id: '68be85b8094d08828def69a2', name: 'Timor karbinhake med nyckelring' },
    { id: '68be85b8094d08828def69a3', name: 'LED-lampa Nyckelring Astro med tryck' },
    { id: '68be85b8094d08828def69a4', name: 'Castor nyckelring med LED-lampa' },
    { id: '68be85b8094d08828def69a5', name: 'Korthållare med tryck' },
    { id: '68be85b8094d08828def6a00', name: 'Columbus - Nyckelring med imitationsläder' },
    { id: '68be85b8094d08828def6a01', name: 'Suora - Nyckelring av RPET-filt' },
    { id: '68be85b8094d08828def6a02', name: 'Strokey - Nyckelring med PU-rem' },
    { id: '68be85b8094d08828def6a03', name: 'Gancho - Karbinhake i aluminium.' },
    { id: '68be85b8094d08828def6a04', name: 'Louse - Husformad nyckelring' },
    { id: '68be85b8094d08828def6a05', name: 'Lar - Bilformad nyckelring' },
    { id: '68be85b8094d08828def6a06', name: 'Nyckelring aluminium Älg 55x60 mm' },
    { id: '68be85b8094d08828def6a08', name: 'Voti - Nyckelring' },
    { id: '68be85b8094d08828def6a09', name: 'Docka - Nyckelring' },
    { id: '68be85b8094d08828def6a2d', name: 'Öppnare med tryck' },
    { id: '68be85b8094d08828def6a2e', name: 'Tokenring - Kundvagnsmynt ?1' },
    { id: '68be85b8094d08828def6a2f', name: 'Nyckelringsöppnare med tryck' },
    { id: '68be85b8094d08828def6a36', name: 'Multikey - Nyckelring + kundvagnsmynt 1?' },
    { id: '68be85b8094d08828def6acb', name: 'BAITT. Aluminiumnyckelring med kapsylöppnare' },
    { id: '68be85b8094d08828def6acd', name: 'Flytande Nyckelring XL' },
    { id: '68be85b8094d08828def6ad1', name: 'Kundvagnspolett Nyckelring med tryck' },
    { id: '68be85b8094d08828def6ad2', name: 'Nyckelring Utdragbar ABS, Bruno' },
    { id: '68be85b8094d08828def6ad3', name: 'Elton - Nyckelring' },
    { id: '68be85b8094d08828def6ad9', name: 'Eli - Nyckelring' },
    { id: '68be85b8094d08828def6ada', name: 'Personlarm i ABS Harold' },
    { id: '68be85b8094d08828def6bf1', name: '7303 | Valenta Key Organizer' },
    { id: '68be85b8094d08828def6bf2', name: 'Nyckelring paracord R-PET' },
    { id: '68be85b8094d08828def6bf4', name: 'Carabiner GRS Recycled Alu karbinhake' },
    { id: '68be85b9094d08828def6cc5', name: 'Nyckelring med Öppnare' },
    { id: '68be85b9094d08828def6ccd', name: 'Kalit - Nyckelring' },
    { id: '68be85b9094d08828def6cce', name: 'Call me!!! - Nyckelring' },
    { id: '68be85b9094d08828def6cd3', name: 'CarabineKey karbinhake' },
    { id: '68be85b9094d08828def6cd4', name: 'GRIPITCH. Nyckelring i metall och nät' },
    { id: '68be85b9094d08828def6cda', name: 'Eloy nyckelring' },
    { id: '68be85b9094d08828def6cdb', name: 'ALBRIGHT. Nyckelring i metall och PU' },
    { id: '68be85b9094d08828def6cde', name: 'LeatherKey nyckelbricka' },
    { id: '68be85b9094d08828def6ce7', name: 'Nyckelring med flasköppnare' },
    { id: '68be85b9094d08828def6ced', name: 'Trolex nyckelring för vagnmynt' },
    { id: '68be85b9094d08828def6d49', name: 'WATOH. Rund nyckelring i metall och PU' },
    { id: '68be85b9094d08828def6d4a', name: 'Filt - Nyckelring i filt' },
    { id: '68be85b9094d08828def6d4b', name: 'GRS RPET Felt Keyring nyckelring' },
    { id: '68be85b9094d08828def6d4e', name: 'Boutique Circular Key Clip' },
    { id: '68be85b9094d08828def6da3', name: 'Latto ficklampa' },
    { id: '68be85b9094d08828def6da4', name: 'Samy nyckelring' },
    { id: '68be85b9094d08828def6da5', name: 'Russel' },
    // ... and 271 more products
  ],

  // folders (369 products)
  'folders': [
    { id: '68be85c2094d08828def8ec8', name: 'Gummibandsmapp kartong u.kl. A4' },
    { id: '68be85c5094d08828def98ca', name: 'Mapp LYRECO A4 3-klaff 280g 50/fp' },
    { id: '68be85c5094d08828def98cb', name: 'Gummibandsmapp EXACOMPTA 3-k PP A4 4/fp' },
    { id: '68be85c5094d08828def98cc', name: 'Gummibandsmapp EXACOMPTA 3-kl ECO' },
    { id: '68be85c5094d08828def98cd', name: 'Mapp LYRECO A4 3-klaff 280g 50/fp' },
    { id: '68be85c5094d08828def98ce', name: 'Mapp LYRECO A4 3-klaff 280g 50/fp' },
    { id: '68be85c5094d08828def98cf', name: 'Gummibandsmapp EXACOMPTA 3-kl ECO' },
    { id: '68be85c5094d08828def98d0', name: 'Gummibandsmapp IDERAMA 3k PP s.färg10/fp' },
    { id: '68be85c5094d08828def98d1', name: 'Gummibandsmapp 3-klaff A4 600' },
    { id: '68be85c5094d08828def98d2', name: 'Gummibandsmapp 3-klaff A4 600' },
    { id: '68be85c5094d08828def98d3', name: 'Gummibandsmapp EXACOMPTA 3-kl ECO' },
    { id: '68be85c5094d08828def98d4', name: 'Gummibandsmapp LYRECO A4 3-kl 10/fp' },
    { id: '68be85c5094d08828def98d5', name: 'Gummibandsmapp EXACOMPTA 3kl A4 425g grö' },
    { id: '68be85c5094d08828def98d6', name: 'Gummibandsmapp 3-klaff A4 600' },
    { id: '68be85c5094d08828def98d7', name: 'Mapp LYRECO A4 3-klaff 280g 50/fp' },
    { id: '68be85c5094d08828def98d8', name: 'Gummibandsmapp FOREVER sort.f 25/fp' },
    { id: '68be85c5094d08828def98d9', name: 'Gummibandsmapp kartong u.kl. A4' },
    { id: '68be85c5094d08828def98da', name: 'Gummibandsmapp PP BeB. 3-kl A4 s.f. 4/fp' },
    { id: '68be85c5094d08828def98db', name: 'Gummibandsmapp EXACOMPTA 3-klaff A4' },
    { id: '68be85c5094d08828def98dc', name: 'Mapp LYRECO A4 1-klaff 250g 100/fp' },
    { id: '68be85c5094d08828def98dd', name: 'Gummibandsmapp EXACOMPTA 3kl A4 425' },
    { id: '68be85c5094d08828def98de', name: 'Gummibandsmapp LYRECO kart A4 10/fp' },
    { id: '68be85c5094d08828def98df', name: 'Gummibandsmapp kartong 3-kl A4' },
    { id: '68be85c5094d08828def98e1', name: 'Gummibandsmapp LYRECO A4 3-kl sva 10/fp' },
    { id: '68be85c5094d08828def98e2', name: 'Gummibandsmapp EXACOMPTA 3-klaff A4' },
    { id: '68be85c5094d08828def98e3', name: 'Gummibandsmapp EXACOMPTA 3kl A4' },
    { id: '68be85c5094d08828def98e4', name: 'Gummibandsmapp EXACOMPTA 3-kl ECO' },
    { id: '68be85c5094d08828def98e5', name: 'Gummibandsmapp u.kl. EXACOMPTA A4' },
    { id: '68be85c5094d08828def99f7', name: 'Magnetficka PVC A5 stående antireflex' },
    { id: '68be85c5094d08828def99f8', name: 'Magnetficka PVC A3 Stående Klar' },
    { id: '68be85c5094d08828def99fa', name: 'Magnetficka PVC A5 liggande Klar' },
    { id: '68be85c5094d08828def99fc', name: 'Magnetficka PVC A5 liggande antireflex' },
    { id: '68be85c5094d08828def99fe', name: 'Magnetficka PVC A4 liggande antireflex' },
    { id: '68be85c5094d08828def99ff', name: 'Plastficka signal A4 0,11mm 100/fp' },
    { id: '68be85c5094d08828def9a04', name: 'Plastficka A4 liggande f pall/korg 10/fp' },
    { id: '68be85c5094d08828def9aad', name: 'Gummibandsmapp EXACOMPTA 3-klaff A4' },
    { id: '68be85c5094d08828def9aae', name: 'Gummibandsmapp u.kl. EXACOMPTA A4' },
    { id: '68be85c5094d08828def9aaf', name: 'Gummibandsmapp u.kl. EXACOMPTA A4' },
    { id: '68be85c5094d08828def9ab0', name: 'Gummibandsmapp EXACOMPTA 3-klaff A4 sort' },
    { id: '68be85c5094d08828def9ab1', name: 'Expandermapp 12-fack 240x330x35mm svart' },
    { id: '68be85c5094d08828def9ab2', name: 'Mapp LYRECO A4 1-klaff 250g 100/fp' },
    { id: '68be85c5094d08828def9ab3', name: 'Gummibandsmapp LYRECO kart A4 10/fp' },
    { id: '68be85c5094d08828def9ab4', name: 'Gummibandsmapp plast 3-kl A4 transp vit' },
    { id: '68be85c5094d08828def9ab5', name: 'Gummibandsmapp LYRECO kart A4 10/fp' },
    { id: '68be85c5094d08828def9ab6', name: 'Gummibandsmapp kartong u.kl. A4' },
    { id: '68be85c5094d08828def9ab7', name: 'Gummibandsmapp kartong 3-kl A4' },
    { id: '68be85c5094d08828def9ab8', name: 'Gummibandsmapp LYRECO kart A4 10/fp' },
    { id: '68be85c5094d08828def9ab9', name: 'Gummibandsmapp EXACOMPTA 3-kl ECO' },
    { id: '68be85c5094d08828def9aba', name: 'Gummibandsmapp EXACOMPTA 3-klaff A4' },
    { id: '68be85c5094d08828def9abb', name: 'Gummibandsmapp u.kl. EXACOMPTA A4' },
    { id: '68be85c5094d08828def9abd', name: 'Mapp LYRECO A4 1-klaff 250g 100/fp' },
    { id: '68be85c5094d08828def9abe', name: 'Gummibandsmapp EXACOMPTA 3-kl ficka' },
    { id: '68be85c5094d08828def9abf', name: 'Gummibandsmapp kartong 3-kl A4' },
    { id: '68be85c5094d08828def9ac0', name: 'Gummibandsmapp EXACOMPTA PP sort.f 10/fp' },
    { id: '68be85c5094d08828def9ac1', name: 'Gummibandsmapp u.kl. EXACOMPTA A4' },
    { id: '68be85c5094d08828def9ac2', name: 'Mapp FOREVER recy sort.färg 100/fp' },
    { id: '68be85c5094d08828def9ac4', name: 'Gummibandsmapp 3-klaff A4 600' },
    { id: '68be85c5094d08828def9ac5', name: 'Gummibandsmapp u.kl. EXACOMPTA A4' },
    { id: '68be85c5094d08828def9ac6', name: 'Gummibandsmapp EXACOMPTA 3-klaff A4' },
    { id: '68be85c5094d08828def9ac8', name: 'Gummibandsmapp 3-klaff A4 600' },
    { id: '68be85c5094d08828def9ac9', name: 'Gummibandsmapp kartong u.kl. A4' },
    { id: '68be85c5094d08828def9acb', name: 'Gummibandsmapp kartong 3-kl A4' },
    { id: '68be85c5094d08828def9acc', name: 'Gummibandsmapp u.kl. EXACOMPTA A4' },
    { id: '68be85c5094d08828def9acd', name: 'Gummibandsmapp EXACOMPTA 3-kl A4' },
    { id: '68be85c5094d08828def9ace', name: 'Mapp EXACOMPTA 3-kl kartong 280g A4' },
    { id: '68be85c5094d08828def9acf', name: 'Gummibandsmapp EXACOMPTA 3-kl ECO' },
    { id: '68be85c5094d08828def9ad0', name: 'Gummibandsmapp EXACOMPTA 3-kl 425g sort.' },
    { id: '68be85c5094d08828def9ad1', name: 'Gummibandsmapp u.kl. A4 plast transp.' },
    { id: '68be85c5094d08828def9ad2', name: 'Gummibandsmapp u.kl. A4 plast' },
    { id: '68be85c5094d08828def9ad3', name: 'Gummibandsmapp LEITZ recy u-kl A4 svart' },
    { id: '68be85c5094d08828def9ad6', name: 'Gummibandsmapp u.kl. A4 plast' },
    { id: '68be85c6094d08828def9c26', name: 'Plastficka LYRECO A5 0,08 präg 100/fp' },
    { id: '68be85c6094d08828def9c2c', name: 'Plastficka LYRECO A4 0,08 klar 100/fp' },
    { id: '68be85c6094d08828def9c2e', name: 'Plastficka NOKI A4 klar 0,10mm 100/fp' },
    { id: '68be85c6094d08828def9c2f', name: 'Samlingsmapp LYRECO A4 250g 100/fp' },
    { id: '68be85c6094d08828def9c30', name: 'Plastfodral LYRECO budget A6 0,13 25/fp' },
    { id: '68be85c6094d08828def9c31', name: 'Plastficka LYRECO A3L 0,08 klar 10/fp' },
    { id: '68be85c6094d08828def9c32', name: 'Magnetficka PVC A3 liggande antireflex' },
    { id: '68be85c6094d08828def9c33', name: 'Plastficka LEITZ PP 0,13 A4' },
    { id: '68be85c6094d08828def9c34', name: 'Plastficka LYRECO A4 0,08 präg 25/fp' },
    { id: '68be85c6094d08828def9c35', name: 'Plastficka LYRECO A4 eco 0,045 100/fp' },
    { id: '68be85c6094d08828def9c36', name: 'Plastfodral LYRECO budget A4 0,13 25/fp' },
    { id: '68be85c6094d08828def9c37', name: 'Plastficka NOKI A3 prägl.90 mic 10/fp' },
    { id: '68be85c6094d08828def9c38', name: 'Plastficka LEITZ PP 0,075 A4 Box' },
    { id: '68be85c6094d08828def9c39', name: 'Plastficka signal A4 0,11mm 100/fp' },
    { id: '68be85c6094d08828def9c3a', name: 'Plastficka signal A4 0,11mm 100/fp' },
    { id: '68be85c6094d08828def9c3b', name: 'Magnetficka PVC A3 liggande Klar' },
    { id: '68be85c6094d08828def9c43', name: 'Magnetficka PVC A4 stående antireflex' },
    { id: '68be85c6094d08828def9c44', name: 'Plastficka signal A4 0,11mm 100/fp' },
    { id: '68be85c6094d08828def9c45', name: 'Plastficka EXACOMPTA A4 0,06mm präglad' },
    { id: '68be85c6094d08828def9c46', name: 'Magnetficka PVC A4 stående Klar' },
    { id: '68be85c6094d08828def9c47', name: 'Magnetficka PVC A3 Stående antireflex' },
    { id: '68be85c6094d08828def9c48', name: 'Magnetficka PVC A4 liggande Klar' },
    { id: '68be85c6094d08828def9c49', name: 'Plastficka LEITZ Prem 0,18 m.klaff 5/fp' },
    { id: '68be85c6094d08828def9c4a', name: 'Plastficka EXACOMPTA exp.flik A4 10/fp' },
    { id: '68be85c6094d08828def9c53', name: 'Plastficka LYRECO A3 0,08 klar 10/fp' },
    { id: '68be85c6094d08828def9c54', name: 'Plastficka LYRECO A4+ premium 0,12 25/fp' },
    { id: '68be85c6094d08828def9c55', name: 'Plastficka NOKI A4 prägl.0,12mm100/fp' },
    { id: '68be85c6094d08828def9c56', name: 'Plastficka signal A4 0,11mm 100/fp' },
    { id: '68be85c6094d08828def9c57', name: 'Plastficka LYRECO A4 0,08 präg 100/fp' },
    // ... and 269 more products
  ],

  // cooler-bags (320 products)
  'cooler-bags': [
    { id: '68be85ad094d08828def464b', name: 'Asivik RPET-kylväska' },
    { id: '68be85ad094d08828def4818', name: 'Reykjavik, kylväska låg' },
    { id: '68be85ad094d08828def4822', name: 'Reykjavik, kylväska hög' },
    { id: '68be85ae094d08828def4a82', name: 'CANCUN. Kylväska i 600D återvunnen polyester med justerbart band 7 L' },
    { id: '68be85ae094d08828def4ade', name: 'Recoba Colour - Kylväska i återvunnen bomull' },
    { id: '68be85af094d08828def4b7d', name: 'ROMA L. Kylväska som ryggsäck stoppad i återvunnen polyester 600D ripstop 16L' },
    { id: '68be85af094d08828def4b85', name: 'ROMA M. Vadderad kylväska i återvunnen polyester 600D ripstop 11 L' },
    { id: '68be85af094d08828def4c95', name: 'Paamiu RPET-kylväska' },
    { id: '68be85af094d08828def4d22', name: 'Florence M Cooler' },
    { id: '68be85af094d08828def4d25', name: 'Florence L Cooler' },
    { id: '68be85af094d08828def4dbf', name: 'CANCUN LARGE. Kylväska i 600D, återvunnen polyester, med justerbar vävband 14 L' },
    { id: '68be85af094d08828def4dce', name: 'Munich L Cooler' },
    { id: '68be85af094d08828def4dd1', name: 'Munich M Cooler' },
    { id: '68be85af094d08828def4df4', name: 'Kylväska i polyester (210T) Hal' },
    { id: '68be85af094d08828def4e45', name: 'Koeler - 600D RPET kylväska' },
    { id: '68be85af094d08828def4e77', name: 'Dublin Cooler' },
    { id: '68be85af094d08828def4e87', name: 'Athens Cooler' },
    { id: '68be85af094d08828def4e88', name: 'Reykjavik Cooler' },
    { id: '68be85af094d08828def4e8f', name: 'Kylväska i polyester (600D) och RPET Isabella' },
    { id: '68be85b0094d08828def4f12', name: 'Kylväska i polyester (600D) Dieter' },
    { id: '68be85b0094d08828def4f59', name: 'Chill - 600D RPET kylväska' },
    { id: '68be85b0094d08828def4f90', name: 'CreaCool 4 Skräddarsydd kylväska' },
    { id: '68be85b0094d08828def4f9e', name: 'Kiatak kylväska' },
    { id: '68be85b0094d08828def4fa3', name: 'Inuit RPET-kylväska' },
    { id: '68be85b0094d08828def4fac', name: 'Wooler - Kylväska av non-woven RPET' },
    { id: '68be85b0094d08828def4fb2', name: 'Kira - 300D RPET kylväska 37L' },
    { id: '68be85b0094d08828def4fd2', name: 'Kiatak kylväska' },
    { id: '68be85b0094d08828def4fd3', name: 'CreaCool Vertical Skräddarsydd kylväska' },
    { id: '68be85b0094d08828def502b', name: 'RPET kylväska Troy' },
    { id: '68be85b0094d08828def511c', name: 'Kylväska polyester (600D) Alejandro' },
    { id: '68be85b0094d08828def5169', name: 'Kylväska i bomull (280 gr/m²) Alex' },
    { id: '68be85b0094d08828def5170', name: 'Kylväska i bomull (280 gr/m²) Alex' },
    { id: '68be85b0094d08828def5189', name: 'Blacol RPET-kylväska' },
    { id: '68be85b0094d08828def51be', name: 'Chilltop Ryggsäck med RPET-kylare' },
    { id: '68be85b0094d08828def51f0', name: 'Kylväska av RPET polyester (300D) Gael' },
    { id: '68be85b0094d08828def51fe', name: 'CreaCool Aqua kylväska för flaskor med tryck' },
    { id: '68be85b0094d08828def5203', name: 'Cubocol RPU-kylväska' },
    { id: '68be85b0094d08828def521c', name: 'CreaSnack Panino kylväska med tryck' },
    { id: '68be85b0094d08828def521d', name: 'CreaCool Draw kylväska med dragsko med tryck' },
    { id: '68be85b0094d08828def521e', name: 'CreaCool Draw Kids kylväska med dragsko för barn med tryck' },
    { id: '68be85b2094d08828def56f6', name: 'Carry Kylkorg' },
    { id: '68be85b9094d08828def6c68', name: 'Shoppingbag med Kylfack' },
    { id: '68be85be094d08828def7d6f', name: 'Carry Kylkorg' },
    { id: '68be85bf094d08828def7ffe', name: 'Tundra GRS RPET kylryggsäck 12L' },
    { id: '68be85bf094d08828def809d', name: 'Spectrum kylväska för 6 burkar 4L' },
    { id: '68be85bf094d08828def809e', name: 'Oslo kylväska 13L' },
    { id: '68be85bf094d08828def809f', name: 'Oriole kylgympapåse, för 12 burkar, med dragsko 5L' },
    { id: '68be85bf094d08828def80a0', name: 'Stockholm vikbar kylväska 10L' },
    { id: '68be85bf094d08828def80a3', name: 'Tundra GRS RPET kylryggsäck 12L' },
    { id: '68be85bf094d08828def80a6', name: 'Basic kylväska' },
    { id: '68be85bf094d08828def80a7', name: 'Kylryggsäck, 10L' },
    { id: '68be85bf094d08828def80a8', name: 'Kylväska Cooler PVC-fri' },
    { id: '68be85bf094d08828def80a9', name: 'Kylväska med korkdetaljer' },
    { id: '68be85bf094d08828def80af', name: 'Tierra kylryggsäck' },
    { id: '68be85bf094d08828def80b3', name: 'Joey lunchkylväska av GRS-återvunnen canvas med plats för 9 burkar 6 liter' },
    { id: '68be85bf094d08828def815f', name: 'Impact AWARE stor kylväska' },
    { id: '68be85bf094d08828def8162', name: 'Impact AWARE kylväska i 16 oz. återvunnen canvas' },
    { id: '68be85bf094d08828def81a4', name: 'Impact AWARE  Urban outdoor kylväska' },
    { id: '68be85bf094d08828def81a6', name: 'Impact AWARE stor kylväska' },
    { id: '68be85bf094d08828def81a7', name: 'Panama kylväska för stranden med snörhandtag av återvunnen GRS 23L' },
    { id: '68be85bf094d08828def81a8', name: 'EcoFold hopvikbar kylväska av RPET på 15 l' },
    { id: '68be85bf094d08828def81aa', name: 'Roam crossbody-väska av återvunnet GRS-material' },
    { id: '68be85bf094d08828def81ab', name: 'Renew AWARE rPET lunchkylväska' },
    { id: '68be85bf094d08828def81ad', name: 'Black+Blum 16L Isolerad Tote-/Kylväska' },
    { id: '68be85bf094d08828def8223', name: 'Recycled Twin Handle Cooler Backpack' },
    { id: '68be85bf094d08828def8226', name: 'Cuba - 600D RPET kylväska för burkar' },
    { id: '68be85bf094d08828def8227', name: 'Casey - Kylväska' },
    { id: '68be85bf094d08828def8228', name: 'Plicool - Ihopvikbar kylväska' },
    { id: '68be85bf094d08828def8229', name: 'Koeler - 600D RPET kylväska' },
    { id: '68be85bf094d08828def822a', name: 'Chill - 600D RPET kylväska' },
    { id: '68be85bf094d08828def822b', name: 'Wooler - Kylväska av non-woven RPET' },
    { id: '68be85bf094d08828def822c', name: 'Kira - 300D RPET kylväska 37L' },
    { id: '68be85bf094d08828def822e', name: 'Saltö - kylväska' },
    { id: '68be85bf094d08828def82d1', name: 'RPET Freshcooler-XL kylväska' },
    { id: '68be85bf094d08828def82d6', name: 'Carry Kylkorg' },
    { id: '68be85bf094d08828def82d7', name: 'Timi  - Kylväska' },
    { id: '68be85bf094d08828def82d8', name: 'Kylväska' },
    { id: '68be85bf094d08828def82d9', name: 'Kylväska' },
    { id: '68be85bf094d08828def82da', name: 'Kylväska, för 6 burkar (33 cl), Arlene' },
    { id: '68be85bf094d08828def82db', name: 'Kylväska Lunch Cooler' },
    { id: '68be85bf094d08828def82dc', name: 'Hopvikbar Kylväska' },
    { id: '68be85bf094d08828def82dd', name: 'Tilos - Kylväska' },
    { id: '68be85bf094d08828def82de', name: 'Kylbox Klassisk 10L' },
    { id: '68be85bf094d08828def82e0', name: 'Kos - Kylväska' },
    { id: '68be85bf094d08828def82e1', name: 'CoolMate GRS RPET kylväska' },
    { id: '68be85bf094d08828def82e2', name: 'Kylväska polyester (420D) Juno' },
    { id: '68be85bf094d08828def82e7', name: 'Hopfällbar Kylväska' },
    { id: '68be85bf094d08828def82e8', name: 'IZMIR. Kylväska 3 L i non-woven (80 g/m²)' },
    { id: '68be85bf094d08828def82e9', name: 'Milos - Kylväska - non-woven' },
    { id: '68be85bf094d08828def82ea', name: 'Recycled Twin Handle Cooler Backpack' },
    { id: '68be85bf094d08828def82eb', name: 'Kylväska polyester (600D) Grace' },
    { id: '68be85bf094d08828def82ec', name: 'Stråla - Kylväska' },
    { id: '68be85bf094d08828def8376', name: 'JEDDAH. Kylväska 3 L i 600D' },
    { id: '68be85bf094d08828def8377', name: 'Kylbaväska, i polyester (600D), Joey' },
    { id: '68be85bf094d08828def8378', name: 'Kylväska Polyester (420D) Nikki' },
    { id: '68be85bf094d08828def8379', name: 'Kylväska Presenning Becky' },
    { id: '68be85bf094d08828def837a', name: 'Kylväska Polyester (420D) Theon' },
    { id: '68be85bf094d08828def837b', name: 'Kylväska' },
    { id: '68be85bf094d08828def837c', name: 'Fresco kylväska' },
    { id: '68be85bf094d08828def837d', name: 'Kylväska, lunch väska, i polyester (420D), Sarah' },
    // ... and 220 more products
  ],

  // toys (317 products)
  'toys': [
    { id: '68be85ad094d08828def4857', name: 'Bath Bombs Kit V. Pedagogiskt spel levereras med en 190T vikbar presentpåse' },
    { id: '68be85ad094d08828def48a7', name: 'BRYCE. Fotboll i PVC' },
    { id: '68be85ad094d08828def48b3', name: 'Crayon Factory Kit II. Pedagogiskt spel levereras med en 190T vikbar presentpåse' },
    { id: '68be85ad094d08828def48b4', name: '2 in 1 Fossil Excavation Kit V. Pedagogiskt spel levereras med en 190T vikbar presentpåse' },
    { id: '68be85ad094d08828def48b6', name: 'Fossil Excavation Kit V. Pedagogiskt spel levereras med en 190T vikbar presentpåse' },
    { id: '68be85ad094d08828def4908', name: 'Bath Bombs Kit IV. Pedagogiskt spel levereras med en non-woven presentpåse (80 g/m²)' },
    { id: '68be85ad094d08828def490a', name: 'Modeling Dough Factory Kit II. Pedagogiskt spel levereras med en 190T vikbar presentpåse' },
    { id: '68be85ad094d08828def490d', name: 'Fossil Excavation Kit IV. Pedagogiskt spel levereras med en non-woven presentpåse (80 g/m²)' },
    { id: '68be85ad094d08828def4914', name: 'Makeup Studio Kit II. Pedagogiskt spel levereras med en 190T vikbar presentpåse' },
    { id: '68be85ad094d08828def491a', name: 'Ancient Egypt Excavation Kit IV. Pedagogiskt spel levereras med en non-woven presentpåse (80 g/m²)' },
    { id: '68be85ae094d08828def4968', name: 'Cirkely - Nyckelring antistress bollform' },
    { id: '68be85ae094d08828def4986', name: 'Ancient Egypt Excavation Kit V. Pedagogiskt spel levereras med en 190T vikbar presentpåse' },
    { id: '68be85af094d08828def4b77', name: 'BRANSON. Klassisk konsol med 26 spel i ABS' },
    { id: '68be85af094d08828def4c06', name: 'Starly - PU antistress-stjärna' },
    { id: '68be85af094d08828def4c9c', name: 'ColoBook eget färgläggningshäfte, mandala' },
    { id: '68be85af094d08828def4d66', name: 'Coloxil 12 eget färgsättningsset, mandala' },
    { id: '68be85af094d08828def4e2b', name: 'Cubix antistressboll' },
    { id: '68be85b0094d08828def4f50', name: 'Wooyo Colour yo-yo' },
    { id: '68be85b0094d08828def4f57', name: 'Kiddo - Pennfodral med färgpennor' },
    { id: '68be85b0094d08828def506f', name: 'Rudolph - Julren med hoodie' },
    { id: '68be85b0094d08828def50e1', name: 'Typoo antistress nyckelring' },
    { id: '68be85b0094d08828def51bf', name: 'Cumulus antistressboll' },
    { id: '68be85b0094d08828def51fd', name: 'Thomas antistressboll' },
    { id: '68be85b0094d08828def520a', name: 'Ingenio antistressboll' },
    { id: '68be85b8094d08828def6a35', name: 'Cirkely - Nyckelring antistress bollform' },
    { id: '68be85be094d08828def7dad', name: 'Descanso - Anti-stress boll' },
    { id: '68be85be094d08828def7dae', name: 'Duck - Badanka' },
    { id: '68be85be094d08828def7daf', name: 'Squarax - Anti-stress kvadrat' },
    { id: '68be85be094d08828def7db0', name: 'Cloudy - Molnformad anti stressboll' },
    { id: '68be85be094d08828def7db1', name: 'Cirkely - Nyckelring antistress bollform' },
    { id: '68be85be094d08828def7db2', name: 'Starly - PU antistress-stjärna' },
    { id: '68be85be094d08828def7db4', name: 'ColourBall stressboll' },
    { id: '68be85be094d08828def7db6', name: 'CHILL. Anti-stress PU-skum' },
    { id: '68be85be094d08828def7db9', name: 'Sopla - Såpbubblor' },
    { id: '68be85be094d08828def7dbb', name: 'LittleDuck badanka' },
    { id: '68be85be094d08828def7dbc', name: 'Tuta i PP Bruce' },
    { id: '68be85be094d08828def7dc3', name: 'Shoop flygplan' },
    { id: '68be85be094d08828def7dc9', name: 'HoodedBear gosebjörn' },
    { id: '68be85be094d08828def7dca', name: 'BEAR. Nalle mjusdjur med t-shirt på' },
    { id: '68be85be094d08828def7df1', name: 'BRYCE. Fotboll i PVC' },
    { id: '68be85be094d08828def7df2', name: 'Pancho' },
    { id: '68be85be094d08828def7e37', name: 'Relixa antistressboll' },
    { id: '68be85be094d08828def7e38', name: 'Jimmy' },
    { id: '68be85be094d08828def7e39', name: 'Typoo antistress nyckelring' },
    { id: '68be85be094d08828def7e3a', name: 'Thomas antistressboll' },
    { id: '68be85be094d08828def7e46', name: 'FILIPINAS. MDF strandracketar' },
    { id: '68be85be094d08828def7e47', name: 'Såpbubblor Kaila' },
    { id: '68be85be094d08828def7e48', name: 'Crayon Factory Kit II. Pedagogiskt spel levereras med en 190T vikbar presentpåse' },
    { id: '68be85be094d08828def7e49', name: '2 in 1 Fossil Excavation Kit V. Pedagogiskt spel levereras med en 190T vikbar presentpåse' },
    { id: '68be85be094d08828def7e4b', name: 'Fossil Excavation Kit V. Pedagogiskt spel levereras med en 190T vikbar presentpåse' },
    { id: '68be85be094d08828def7e4c', name: 'Bath Bombs Kit IV. Pedagogiskt spel levereras med en non-woven presentpåse (80 g/m²)' },
    { id: '68be85be094d08828def7eca', name: 'Modeling Dough Factory Kit II. Pedagogiskt spel levereras med en 190T vikbar presentpåse' },
    { id: '68be85be094d08828def7ecb', name: 'Fossil Excavation Kit IV. Pedagogiskt spel levereras med en non-woven presentpåse (80 g/m²)' },
    { id: '68be85be094d08828def7ecd', name: 'Ancient Egypt Excavation Kit IV. Pedagogiskt spel levereras med en non-woven presentpåse (80 g/m²)' },
    { id: '68be85be094d08828def7ece', name: '2 in 1 Fossil Excavation Kit IV. Pedagogiskt spel levereras med en non-woven presentpåse (80 g/m²)' },
    { id: '68be85be094d08828def7ecf', name: 'Ancient Egypt Excavation Kit V. Pedagogiskt spel levereras med en 190T vikbar presentpåse' },
    { id: '68be85be094d08828def7ed1', name: 'BRANSON. Klassisk konsol med 26 spel i ABS' },
    { id: '68be85be094d08828def7ed2', name: 'Sorell 6 st kritor i set' },
    { id: '68be85be094d08828def7f22', name: 'Blowy bubbelblåsare' },
    { id: '68be85be094d08828def7f24', name: 'Poyo yo-yo' },
    { id: '68be85be094d08828def7f25', name: 'Mincok kockset för barn' },
    { id: '68be85be094d08828def7f26', name: 'Bubles bubbelflaska' },
    { id: '68be85be094d08828def7f27', name: 'Zigi' },
    { id: '68be85be094d08828def7f3f', name: 'Coloxil 12 eget färgsättningsset, mandala' },
    { id: '68be85be094d08828def7f7b', name: 'Skipix hopprep' },
    { id: '68be85be094d08828def7f7c', name: 'Juppix hopprep' },
    { id: '68be85be094d08828def7f7d', name: 'Negril' },
    { id: '68be85ca094d08828defa95e', name: 'Ritningssats Plywood Thessaly' },
    { id: '68be85ca094d08828defab85', name: 'Plyschleksak leopard Lauren' },
    { id: '68be85ca094d08828defab91', name: 'Plyschtiger Skylar' },
    { id: '68be85ca094d08828defabf4', name: 'Plyshpanda Ivy' },
    { id: '68be85ca094d08828defabf8', name: 'Träpatiensspel Joel' },
    { id: '68be85ca094d08828defabfe', name: 'Plyschleksak flodhäst Eliana' },
    { id: '68be85ca094d08828defac02', name: 'Plyschleksak lejon Serenity' },
    { id: '68be85ca094d08828defacb6', name: 'Examensbjörn i plysch Magnus' },
    { id: '68be85ca094d08828defacbd', name: 'Plyschapa Sophie' },
    { id: '68be85cb094d08828defacc0', name: 'Plyschgiraff Paisley' },
    { id: '68be85cb094d08828defacd6', name: 'Plyschleksak hund Hailey' },
    { id: '68be85cb094d08828defad7d', name: 'Plyschleksak giraff Rick' },
    { id: '68be85cb094d08828defad7e', name: 'Plyschleksak giraff Naomi' },
    { id: '68be85cb094d08828defadc7', name: 'Chaxon Eco anpassad krituppsättning' },
    { id: '68be85cb094d08828defadcd', name: 'Chaxon anpassad krituppsättning' },
    { id: '68be85cb094d08828defaeab', name: 'Plyschleksak omvändbar Isla' },
    { id: '68be85cb094d08828defaeb1', name: 'Plyschleksak hund Liza' },
    { id: '68be85cb094d08828defaeb4', name: 'Plyschleksak hund Valentina' },
    { id: '68be85cb094d08828defaf52', name: 'Furgone antistressboll' },
    { id: '68be85cb094d08828defafac', name: 'Träpusselspel Skyla' },
    { id: '68be85cb094d08828defafad', name: 'Plyschleksak ren Everly' },
    { id: '68be85cb094d08828defb015', name: 'Bandito antistressboll' },
    { id: '68be85cb094d08828defb01c', name: 'Selanis färgläggningsset' },
    { id: '68be85cb094d08828defb022', name: 'Retrump RPET plyschelefant' },
    { id: '68be85cb094d08828defb028', name: 'Colozzy eget färgläggningspussel' },
    { id: '68be85cb094d08828defb02e', name: 'Crossboo magiskt pussel' },
    { id: '68be85cb094d08828defb032', name: 'Rebark RPET plyschhund' },
    { id: '68be85cc094d08828defb0bf', name: 'Flamingo i plysch Alicia' },
    { id: '68be85cc094d08828defb17c', name: 'Rehowl RPET plysch apa' },
    { id: '68be85cc094d08828defb182', name: 'Sonny munspel' },
    { id: '68be85cc094d08828defb184', name: 'Remoo RPET plyschko' },
    { id: '68be85cc094d08828defb35e', name: 'Brainboo magiskt pussel' },
    { id: '68be85cd094d08828defb4fa', name: 'Rezimi RABS minipussel' },
    // ... and 217 more products
  ],

  // shoes (315 products)
  'shoes': [
    { id: '68be85ad094d08828def4556', name: 'Basic Backpack' },
    { id: '68be85ad094d08828def455e', name: 'Basic Bag' },
    { id: '68be85ad094d08828def455f', name: 'Smart Backpack' },
    { id: '68be85ad094d08828def4560', name: 'Sportbag' },
    { id: '68be85ad094d08828def4561', name: 'Backpack II' },
    { id: '68be85ad094d08828def456b', name: '2-in-1 bag 42L' },
    { id: '68be85ad094d08828def456e', name: '2-in-1 bag 75L' },
    { id: '68be85ae094d08828def4a18', name: 'Berkeley Mockasko Chelsea Suede' },
    { id: '68be85af094d08828def4b86', name: 'Bologna - väska' },
    { id: '68be85af094d08828def4b87', name: 'Douglas Weekend - väska' },
    { id: '68be85af094d08828def4b88', name: 'Verona - väska' },
    { id: '68be85af094d08828def4b89', name: 'Sorrento - necessär' },
    { id: '68be85b0094d08828def52c7', name: 'VINGA Baltimore weekendbag' },
    { id: '68be85b0094d08828def52c9', name: 'VINGA Hunton weekendbag' },
    { id: '68be85b0094d08828def52cb', name: 'VINGA Sortino weekendbag' },
    { id: '68be85b0094d08828def52cc', name: 'VINGA Bosler  RCS återvunnen canvas dufflebag' },
    { id: '68be85b0094d08828def52d2', name: 'VINGA Baltimore RCS 24h weekendbag' },
    { id: '68be85b0094d08828def52d3', name: 'VINGA Baltimore RCS weekend backpack' },
    { id: '68be85b1094d08828def5311', name: 'Sky Travelbag' },
    { id: '68be85b2094d08828def589e', name: 'Craft Löparsko V150 Engineered Dam' },
    { id: '68be85b2094d08828def589f', name: 'Craft Löparsko V150 Engineered Herr' },
    { id: '68be85b2094d08828def58a0', name: 'Pacer M' },
    { id: '68be85b3094d08828def5903', name: 'VINGA Baltimore RCS återvunnen polyester bagagetag' },
    { id: '68be85b8094d08828def6ac1', name: 'VINGA Hilo AWARE återvunnen canvas maxi tote bag' },
    { id: '68be85b8094d08828def6b7a', name: 'Neutral - Beach Bag' },
    { id: '68be85b8094d08828def6bc9', name: 'Fairtrade Gympapåse' },
    { id: '68be85b8094d08828def6bca', name: 'Gymbag | ryggsäck' },
    { id: '68be85b8094d08828def6bce', name: 'Craft Gympapåse Squad' },
    { id: '68be85b8094d08828def6bd4', name: 'Sport Gym' },
    { id: '68be85b8094d08828def6bdc', name: 'Gym Bag' },
    { id: '68be85b8094d08828def6bfd', name: 'Fairtrade Gympapåse' },
    { id: '68be85b8094d08828def6bfe', name: 'Fairtrade Bomullskasse Twill med dubbla handtag' },
    { id: '68be85b8094d08828def6bff', name: 'Fairtrade Bomullskasse Twill med kontrast handtag' },
    { id: '68be85b8094d08828def6c00', name: 'Fairtrade Bomullskasse Panama' },
    { id: '68be85b8094d08828def6c02', name: 'Fairtrade Bomullskasse Twill med långt axelband' },
    { id: '68be85b8094d08828def6c03', name: 'Neutral - Tiger Cotton Shopping Bag w. Long Handles' },
    { id: '68be85b8094d08828def6c04', name: 'Neutral - Tiger Cotton Twill bomullskasse' },
    { id: '68be85b9094d08828def6c53', name: 'Kasse i bomull' },
    { id: '68be85b9094d08828def6c61', name: 'Sky Shopper' },
    { id: '68be85b9094d08828def6cf3', name: 'Cottover Tote Bag' },
    { id: '68be85b9094d08828def6cf7', name: 'Cottover Tote Bag Heavy Large' },
    { id: '68be85b9094d08828def6cf9', name: 'Organic Cotton Mini Mesh Grocery Bag' },
    { id: '68be85b9094d08828def6d8a', name: 'Twill bomullskasse med långa handtag Fairtrade' },
    { id: '68be85b9094d08828def6d8b', name: 'Bomullskasse med långa handtag Fairtrade' },
    { id: '68be85b9094d08828def6d8c', name: 'Fairtrade Bomullskasse Twill med dubbla handtag' },
    { id: '68be85b9094d08828def6d8d', name: 'Fairtrade Bomullskasse Twill med kontrast handtag' },
    { id: '68be85b9094d08828def6d91', name: 'EarthAware Organic Yoga Tote Bag' },
    { id: '68be85b9094d08828def6e0b', name: 'Neutral - Panama tote bag med dragkedja' },
    { id: '68be85ba094d08828def6efa', name: 'Oversized Canvas Tote Bag' },
    { id: '68be85ba094d08828def6f3a', name: 'EarthAware Organic Boat Bag' },
    { id: '68be85ba094d08828def6fb1', name: 'Key Tote Bag (GOTS)' },
    { id: '68be85be094d08828def7de6', name: 'EarthAware Organic Yoga Mat Bag' },
    { id: '68be85be094d08828def7ed9', name: 'VINGA Bosler GRS återvunnen canvas necessär' },
    { id: '68be85be094d08828def7f31', name: 'Sorrento - necessär' },
    { id: '68be85be094d08828def7fc1', name: 'VINGA Baltimore weekendbag' },
    { id: '68be85be094d08828def7fc7', name: 'VINGA Bosler  RCS återvunnen canvas dufflebag' },
    { id: '68be85bf094d08828def7fee', name: 'Craft Gympapåse Squad' },
    { id: '68be85bf094d08828def7fef', name: 'Adv Entity Travel Backpack 25L' },
    { id: '68be85bf094d08828def7ff0', name: 'Adv Entity Duffel 70 L' },
    { id: '68be85bf094d08828def7ff1', name: 'Ability Shoe Backpack 26L' },
    { id: '68be85bf094d08828def7ff3', name: 'Adv Entity Duffel 50 L' },
    { id: '68be85bf094d08828def7ff4', name: 'Craft Träningsväska Squad Duffel Medium' },
    { id: '68be85bf094d08828def7ff5', name: 'Ability Backpack 27L' },
    { id: '68be85bf094d08828def7ff6', name: 'Ability Duffel 38L' },
    { id: '68be85bf094d08828def7ffa', name: 'Ability Practice Backpack 24L' },
    { id: '68be85bf094d08828def7ffb', name: 'Craft Träningsväska Squad Duffel Large' },
    { id: '68be85bf094d08828def7ffc', name: 'Pro Control 2 Layer Equipment Small Bag 65L' },
    { id: '68be85bf094d08828def804b', name: 'VINGA Baltimore RCS essentials bag' },
    { id: '68be85bf094d08828def8085', name: 'Strandväska Nautical' },
    { id: '68be85bf094d08828def8094', name: 'VINGA Baltimore RCS weekend backpack' },
    { id: '68be85bf094d08828def8095', name: 'VINGA Bermond RCS återvunnet PU weekendbag' },
    { id: '68be85bf094d08828def8096', name: 'VINGA Marlow RCS återvunnen polyester weekend bag' },
    { id: '68be85bf094d08828def8101', name: 'Bologna - väska' },
    { id: '68be85bf094d08828def8104', name: 'Basic Bag' },
    { id: '68be85bf094d08828def810b', name: 'Sportbag' },
    { id: '68be85bf094d08828def810d', name: 'Sport Bag' },
    { id: '68be85bf094d08828def810e', name: 'Sport Bag Large' },
    { id: '68be85bf094d08828def8116', name: 'Active Line Sportbag big' },
    { id: '68be85bf094d08828def8121', name: 'Club Line Sportbag' },
    { id: '68be85bf094d08828def812f', name: '2-in-1 bag 42L' },
    { id: '68be85bf094d08828def8132', name: '2-in-1 bag 75L' },
    { id: '68be85bf094d08828def815d', name: 'Spirit Travelbag (RPET)' },
    { id: '68be85bf094d08828def815e', name: 'Melange Travelbag' },
    { id: '68be85bf094d08828def81bb', name: 'Fairtrade Gympapåse' },
    { id: '68be85bf094d08828def81bf', name: 'Craft Gympapåse Squad' },
    { id: '68be85bf094d08828def81c3', name: 'Sport Gym' },
    { id: '68be85bf094d08828def81cb', name: 'Gym Bag' },
    { id: '68be85bf094d08828def81db', name: 'Canvas Toilet Case' },
    { id: '68be85bf094d08828def8218', name: 'Twill bomullskasse med långa handtag Fairtrade' },
    { id: '68be85bf094d08828def8219', name: 'Bomullskasse med långa handtag Fairtrade' },
    { id: '68be85bf094d08828def821a', name: 'Fairtrade Bomullskasse Twill med dubbla handtag' },
    { id: '68be85bf094d08828def824f', name: 'Silver Line Travelbag' },
    { id: '68be85bf094d08828def8255', name: 'Sporty Line S50 Travelbag' },
    { id: '68be85bf094d08828def825f', name: 'VINGA Baltimore backpack' },
    { id: '68be85bf094d08828def8260', name: 'VINGA Baltimore travel backpack' },
    { id: '68be85bf094d08828def826a', name: 'VINGA Baltimore datorväska' },
    { id: '68be85bf094d08828def828b', name: 'VINGA Baltimore tote bag' },
    { id: '68be85bf094d08828def8293', name: 'VINGA Baltimore RCS sling bag' },
    { id: '68be85bf094d08828def82aa', name: 'Sky Shopper' },
    { id: '68be85bf094d08828def82c6', name: 'Bomullskasse med korta handtag Fairtrade' },
    // ... and 215 more products
  ],

  // sweatshirts-collegetrojor (307 products)
  'sweatshirts-collegetrojor': [
    { id: '68be85ad094d08828def4632', name: 'Columbia - COLUMBIA UNISEX SWEATSHIRT' },
    { id: '68be85ad094d08828def47e6', name: 'Heavy Hoody' },
    { id: '68be85ad094d08828def47e9', name: 'Basic Hoody' },
    { id: '68be85ad094d08828def47ea', name: 'Basic Oversize Hoody' },
    { id: '68be85ad094d08828def47eb', name: 'Ladies´ Basic Hoody' },
    { id: '68be85ad094d08828def47ec', name: 'Basic Zip Hoody' },
    { id: '68be85ad094d08828def47ed', name: 'Basic Crewneck' },
    { id: '68be85ad094d08828def47ef', name: 'Ladies Basic Zip Hoody' },
    { id: '68be85ad094d08828def47f2', name: 'Heavy Zip Hoody' },
    { id: '68be85ad094d08828def47f4', name: 'Ladies´ Heavy Hoody' },
    { id: '68be85ad094d08828def47f6', name: 'Basic Raglan Hoody' },
    { id: '68be85ad094d08828def47fb', name: 'Sweat Pull Over Hoody' },
    { id: '68be85ad094d08828def4834', name: 'Carter - CARTER Hoodie med hel dragk' },
    { id: '68be85ad094d08828def48f8', name: 'Conrad - CONRAD Sweat med dragkedja' },
    { id: '68be85ae094d08828def492b', name: 'Unisex Poly-Cotton Fleece Full-Zip Hoodie' },
    { id: '68be85ae094d08828def492d', name: 'Unisex Sponge Fleece Pullover Hoodie' },
    { id: '68be85af094d08828def4d9d', name: 'Loop hoodie' },
    { id: '68be85af094d08828def4da2', name: 'Loop hoddie' },
    { id: '68be85af094d08828def4ebe', name: 'Reverie huvtröja sweatshirt' },
    { id: '68be85b2094d08828def54f2', name: 'Denali GRS filt med huvtröja' },
    { id: '68be85b2094d08828def57cc', name: 'Urban hoodie för barn' },
    { id: '68be85b4094d08828def5ed7', name: 'TXlite Hoodie Zip Men' },
    { id: '68be85b4094d08828def5eea', name: 'Men"s Zipped Jacket' },
    { id: '68be85b4094d08828def5f03', name: 'Loop hoddie' },
    { id: '68be85b4094d08828def5f92', name: 'TXlite Hoodie Zip Women' },
    { id: '68be85b4094d08828def6073', name: 'Printer - Jog Rsx' },
    { id: '68be85b4094d08828def6076', name: 'Printer - Jog Rsx Lady' },
    { id: '68be85b4094d08828def6078', name: 'Printer - Drawstring 85 Cm' },
    { id: '68be85b6094d08828def6495', name: 'Clasica unisex tröja med rund hals' },
    { id: '68be85b6094d08828def6499', name: 'Power Hoodie' },
    { id: '68be85b6094d08828def649c', name: 'Power Sweatshirt' },
    { id: '68be85b6094d08828def64a6', name: 'Montblanc unisex hoodie med hellång dragkedja' },
    { id: '68be85b6094d08828def64a7', name: 'IQONIQ Rila lättvikt hoodie i återvunnen bomull' },
    { id: '68be85b6094d08828def64a8', name: 'IQONIQ Etosha lättvikt sweatshirt i återvunnen bomull' },
    { id: '68be85b6094d08828def64a9', name: 'Ulan unisex tröja med dragkedja' },
    { id: '68be85b6094d08828def64aa', name: 'IQONIQ Zion sweatshirt i återvunnen bomull' },
    { id: '68be85b6094d08828def64ab', name: 'IQONIQ Yengo hoodie  i återvunnen bomull med sidofickor' },
    { id: '68be85b6094d08828def64ac', name: 'Aneto tröja med kvartslång dragkedja' },
    { id: '68be85b6094d08828def64ae', name: 'IQONIQ Yoho relaxed fit hoodie i återvunnen bomull' },
    { id: '68be85b6094d08828def64af', name: 'IQONIQ Jasper hoodie i återvunnen bomull' },
    { id: '68be85b6094d08828def64b0', name: 'IQONIQ Kruger relaxed fit sweatshirt i återvunnen bomull' },
    { id: '68be85b6094d08828def655e', name: 'IQONIQ Abisko hoodie med dragkedja i återvunnen bomull' },
    { id: '68be85b6094d08828def6561', name: 'Badet tvåfärgad unisexhuvtröja' },
    { id: '68be85b6094d08828def6562', name: 'Fuji unisex sweatshirtjacka' },
    { id: '68be85b6094d08828def6563', name: 'IQONIQ Torres hoodie i återvunnen ofärgad bomull' },
    { id: '68be85b6094d08828def6565', name: 'IQONIQ Denali sweatshirt i återvunnen ofärgad bomull' },
    { id: '68be85b6094d08828def6568', name: 'Charon hoodie dam' },
    { id: '68be85b6094d08828def6569', name: 'Zenon rundhalsad tröja dam' },
    { id: '68be85b6094d08828def656b', name: 'Jaya unisex rundhalsad tröja' },
    { id: '68be85b6094d08828def656d', name: 'Spider - SPIDER HERR COLLEGE TRÖJA' },
    { id: '68be85b6094d08828def656f', name: 'New Supreme - NEW SUPREME COLLEGE 280g' },
    { id: '68be85b6094d08828def6570', name: 'Stellar - STELLAR Unisex Hoodie' },
    { id: '68be85b6094d08828def65c7', name: 'Spencer Men - SPENCER Unisex Hoodie 280g' },
    { id: '68be85b6094d08828def65c8', name: 'Spencer Women - SPENCER Dam Hoodie 280g' },
    { id: '68be85b6094d08828def65c9', name: 'Slam - SLAM Unisex Huvtröja' },
    { id: '68be85b6094d08828def65ca', name: 'Columbia - COLUMBIA UNISEX SWEATSHIRT' },
    { id: '68be85b6094d08828def65cb', name: 'Carter - CARTER Hoodie med hel dragk' },
    { id: '68be85b6094d08828def65ce', name: 'Conrad - CONRAD Sweat med dragkedja' },
    { id: '68be85b7094d08828def66d0', name: 'Neutral - Tiger Cotton Oversized Sweatshirt' },
    { id: '68be85b7094d08828def66d7', name: 'Paccard Hoodie w' },
    { id: '68be85b7094d08828def67d7', name: 'Neutral - Unisex Sweatshirt med kvarts dragkedja' },
    { id: '68be85b7094d08828def67da', name: 'College Hoodie' },
    { id: '68be85b7094d08828def67e0', name: 'Heavy Hoody' },
    { id: '68be85b7094d08828def67ea', name: 'Unisex hooded sweatshirt 350 gsm' },
    { id: '68be85b7094d08828def67ec', name: 'Girlie College Hoodie by AWDis' },
    { id: '68be85b7094d08828def67ed', name: 'Unisex sweatshirt 350 gsm' },
    { id: '68be85b8094d08828def6869', name: 'Original Sweat/Zip' },
    { id: '68be85b8094d08828def6874', name: 'THC PHOENIX. Sweatshirt (unisex) med huva i bomull och polyester' },
    { id: '68be85b8094d08828def6879', name: 'Kids Zoodie' },
    { id: '68be85b8094d08828def6919', name: 'Kids Zoodie' },
    { id: '68be85b8094d08828def691b', name: 'Basic Hoody Man' },
    { id: '68be85b8094d08828def691c', name: 'Cross Neck Hoodie by AWDis' },
    { id: '68be85b8094d08828def691e', name: 'Organic Hoodie' },
    { id: '68be85b8094d08828def6922', name: 'Printer - Jog Rsx Lady' },
    { id: '68be85b8094d08828def692c', name: 'Printer - Drawstring 85 Cm' },
    { id: '68be85b8094d08828def692e', name: 'Basic Sweat Man' },
    { id: '68be85b8094d08828def6930', name: 'Midland Full Zip' },
    { id: '68be85b8094d08828def6937', name: 'Hoodjacka Bio, herr' },
    { id: '68be85b8094d08828def69b1', name: 'Graduate Heavyweight Hoodie by AWDis' },
    { id: '68be85b8094d08828def69b2', name: 'Basic Hoody Lady' },
    { id: '68be85b8094d08828def69b5', name: 'Hoodjacka Bio, dam' },
    { id: '68be85b8094d08828def69b6', name: 'Basic Sweat Lady' },
    { id: '68be85b8094d08828def69b8', name: 'Sports Polyester Hoodie by AWDis' },
    { id: '68be85b8094d08828def69ba', name: 'Hoodtröja Bio, dam' },
    { id: '68be85b8094d08828def69bd', name: 'Sweatshirt Bio, dam' },
    { id: '68be85b8094d08828def69c0', name: 'Epic Print Hoodie by AWDis' },
    { id: '68be85b8094d08828def69c1', name: 'Midland Half Zip' },
    { id: '68be85b8094d08828def69c5', name: 'Organic Sweat' },
    { id: '68be85b8094d08828def69c6', name: 'Collegejacka Sports Polyester Zoodie by AWDis' },
    { id: '68be85b8094d08828def69cb', name: 'Chunky Hoodie by AWDis' },
    { id: '68be85b8094d08828def69cc', name: 'Womens Cropped Oversize Hoodie' },
    { id: '68be85b8094d08828def6a56', name: 'Mens Anthem hoodie' },
    { id: '68be85b8094d08828def6a57', name: 'Womens Cropped Oversize Hoodie' },
    { id: '68be85b8094d08828def6a58', name: 'Printer RED - Powerslide' },
    { id: '68be85b8094d08828def6a59', name: 'Printer RED - Layback' },
    { id: '68be85b8094d08828def6a5b', name: 'Sweatshirt Sophomore ¼ Zip by AWDis' },
    { id: '68be85b8094d08828def6a5c', name: 'Camo Hoodie by AWDis' },
    { id: '68be85b8094d08828def6a60', name: 'Klassisk Collegetröja Graduate by AWDis' },
    { id: '68be85b8094d08828def6a62', name: 'Printer - Homerun' },
    { id: '68be85b8094d08828def6a63', name: 'THC DELTA. Sweatshirt (unisex) i bomull och polyester' },
    // ... and 207 more products
  ],

  // gym-bags (270 products)
  'gym-bags': [
    { id: '68be85ad094d08828def478d', name: 'Cabetri Colour - Gymnastikpåse pre-used bomull' },
    { id: '68be85ad094d08828def4831', name: 'Night - Stor gymnastikpåse 300D RPET' },
    { id: '68be85ae094d08828def49e5', name: 'CreaDraw T RPET dragsko med tryck' },
    { id: '68be85ae094d08828def4a07', name: 'Hamma - Hammamhandduk med påse' },
    { id: '68be85ae094d08828def4ac1', name: 'CreaDraw T Kids Specialtillverkad Dragskoväska' },
    { id: '68be85ae094d08828def4ac5', name: 'CreaDraw T Skräddarsydd dragskoväska' },
    { id: '68be85ae094d08828def4ac7', name: 'CreaDraw T Kids RPET Specialtillverkad Dragskoväska' },
    { id: '68be85af094d08828def4c3d', name: 'Lhotse Tote Bag' },
    { id: '68be85af094d08828def4d5a', name: 'Pudrow RPET-väska med dragsko' },
    { id: '68be85af094d08828def4d63', name: 'CreaDraw Circle dragsko med tryck' },
    { id: '68be85af094d08828def4e4b', name: 'Libag - Gymnastikpåse RPET PU melerad' },
    { id: '68be85b0094d08828def5101', name: 'Bangkok Bag - Gymnastikpåse i 600D RPET' },
    { id: '68be85b0094d08828def514d', name: 'Ryggsäck i rPET polyester (210D) med dragsko Calix' },
    { id: '68be85b0094d08828def5226', name: 'Oeko-Tex bomull (140 g/m2) ryggsäck med dragsko Bridget' },
    { id: '68be85b1094d08828def54bd', name: 'Ryggsäck, med dragsko, rPET polyester (600D), Auri' },
    { id: '68be85b8094d08828def6b1c', name: 'Gymnastikpåse Premium med tryck' },
    { id: '68be85b8094d08828def6b1d', name: 'Gymnastikpåse Oregon med tryck' },
    { id: '68be85b8094d08828def6b1e', name: 'Gymnastikpåse Evergreen Premium non woven med tryck' },
    { id: '68be85b8094d08828def6b1f', name: 'Oregon 140 g/m² gympapåse i bomull 5L' },
    { id: '68be85b8094d08828def6b20', name: 'Oriole gympapåse nät 5L' },
    { id: '68be85b8094d08828def6b22', name: 'Ross RPET gympapåse 5L' },
    { id: '68be85b8094d08828def6b23', name: 'Impact AWARE dragskoväska i återvunnen bomull 145gr' },
    { id: '68be85b8094d08828def6b24', name: 'Impact AWARE RPET 190T dragskoväska' },
    { id: '68be85b8094d08828def6b26', name: 'Oregon Blend 140 g/m² väska med dragsko av återvunnen GRS 5L' },
    { id: '68be85b8094d08828def6b27', name: 'Nomad sportväska med dragsko och bottenfack av GRS-återvunnet material 18 l' },
    { id: '68be85b8094d08828def6b28', name: 'Shoop - Ryggsäck' },
    { id: '68be85b8094d08828def6b29', name: 'Daffy - Klädpåse' },
    { id: '68be85b8094d08828def6b2a', name: 'Colored - Gymnastikpåse bomull 100gsm' },
    { id: '68be85b8094d08828def6b2b', name: 'Shooppet - Gymnastik kasse i 190T RPET' },
    { id: '68be85b8094d08828def6b2d', name: 'Yuki Colour - Gymnastikpåse ekologisk bomull' },
    { id: '68be85b8094d08828def6b2e', name: 'Panda Bag - Gympapåse i återvunnen bomull' },
    { id: '68be85b8094d08828def6b2f', name: 'Cabetri Colour - Gymnastikpåse pre-used bomull' },
    { id: '68be85b8094d08828def6bc3', name: 'Night - Stor gymnastikpåse 300D RPET' },
    { id: '68be85b8094d08828def6bc5', name: 'Hamma - Hammamhandduk med påse' },
    { id: '68be85b8094d08828def6bc7', name: 'Libag - Gymnastikpåse RPET PU melerad' },
    { id: '68be85b8094d08828def6bc8', name: 'Bangkok Bag - Gymnastikpåse i 600D RPET' },
    { id: '68be85b8094d08828def6bcb', name: 'Premium Gymsac' },
    { id: '68be85b8094d08828def6bcd', name: 'Icon Gymsac' },
    { id: '68be85b8094d08828def6bd1', name: 'Gympapåse/ryggsäck i polyester (210D) Steffi' },
    { id: '68be85b8094d08828def6bd3', name: 'Recycled Gymsac' },
    { id: '68be85b8094d08828def6bd6', name: 'BOXP. Non-woven gympapåse (80 g/m²)' },
    { id: '68be85b8094d08828def6bd7', name: 'Ios - Gympåse/kylväska/sittunderlag/kasse' },
    { id: '68be85b8094d08828def6bd8', name: 'CARNABY. 210D gympapåse med svarta band' },
    { id: '68be85b8094d08828def6bd9', name: 'Athleisure Gymsac' },
    { id: '68be85b8094d08828def6bda', name: 'Gympapåse Non-Woven 75g/m²' },
    { id: '68be85b8094d08828def6bde', name: 'Jympapåse/ryggsäck (80 gr/m2) Nico' },
    { id: '68be85b8094d08828def6bdf', name: 'PromoBag 210D ryggsäck' },
    { id: '68be85b8094d08828def6be0', name: 'Budget Gymsac' },
    { id: '68be85b8094d08828def6be1', name: 'Transparent ryggsäck' },
    { id: '68be85b8094d08828def6be2', name: 'PromoBag GRS RPET ryggsäck' },
    { id: '68be85b9094d08828def6cc9', name: 'PromoBag 190T ryggsäck' },
    { id: '68be85b9094d08828def6cca', name: 'Jympapåse/ryggsäck (190T) (190T) Sylvie' },
    { id: '68be85b9094d08828def6ccb', name: 'Pond - Gympåse/kasse - 140 g/m²' },
    { id: '68be85b9094d08828def6ccc', name: 'PromoColour (120 g/m²) ryggsäck' },
    { id: '68be85b9094d08828def6cd0', name: 'Reflective Gymsac' },
    { id: '68be85b9094d08828def6cd1', name: 'Cotton Promo (125 g/m²) ryggsäck' },
    { id: '68be85b9094d08828def6cd5', name: 'RULES. Gymapåse 210D' },
    { id: '68be85b9094d08828def6cd6', name: 'ILFORD. 100% bomulls gympapåse (100g/m²)' },
    { id: '68be85b9094d08828def6cd7', name: 'SafeBag ryggsäck' },
    { id: '68be85b9094d08828def6cd8', name: 'ROMFORD. 100% bomulls gympapåse (180 g/m²)' },
    { id: '68be85b9094d08828def6cdc', name: 'Dragväska återvunnen bomull 38x42cm' },
    { id: '68be85b9094d08828def6cdd', name: 'BISSAYA. Gympapåse i non-woven (80 g/m²)' },
    { id: '68be85b9094d08828def6d75', name: 'Gympapåse 210T R-PET' },
    { id: '68be85b9094d08828def6d76', name: 'Lhotse Tote Bag' },
    { id: '68be85b9094d08828def6d77', name: 'Alpi - Gympåse/kasse -140 g/m²' },
    { id: '68be85b9094d08828def6d78', name: 'Melba - Gympåse/kasse' },
    { id: '68be85b9094d08828def6d79', name: 'Gympapåse 210T R-PET med dragkedja' },
    { id: '68be85b9094d08828def6d7a', name: 'PromoColour GRS Recycled Cotton Backpack (150 g/m²)' },
    { id: '68be85b9094d08828def6d7c', name: 'Denim Gymsac' },
    { id: '68be85b9094d08828def6d7e', name: 'Ryggsäck i rPET polyester (210D) med dragsko Calix' },
    { id: '68be85b9094d08828def6d7f', name: 'R-PET Drawstring bag non-woven 38x42cm 75g/m²' },
    { id: '68be85b9094d08828def6dec', name: 'Oeko-Tex bomull (140 g/m2) ryggsäck med dragsko Bridget' },
    { id: '68be85b9094d08828def6ded', name: 'Druuk väska med dragsko' },
    { id: '68be85b9094d08828def6dee', name: 'Miruk väska med dragsko' },
    { id: '68be85b9094d08828def6def', name: 'Vidraw reflekterande väska med dragsko' },
    { id: '68be85b9094d08828def6df0', name: 'Kassy väska med dragsko' },
    { id: '68be85b9094d08828def6df1', name: 'Pully' },
    { id: '68be85b9094d08828def6df2', name: 'Redraw RPET-väska med dragsko' },
    { id: '68be85b9094d08828def6df3', name: 'Holbery väska med dragsko' },
    { id: '68be85b9094d08828def6df4', name: 'Coprus väska med dragsko' },
    { id: '68be85b9094d08828def6df5', name: 'Jock' },
    { id: '68be85b9094d08828def6df6', name: 'CreaDraw RPET dragsko med tryck' },
    { id: '68be85b9094d08828def6df7', name: 'CreaDraw Skräddarsydd Dragskoväska' },
    { id: '68be85b9094d08828def6df8', name: 'Drafax väska med dragsko' },
    { id: '68be85b9094d08828def6df9', name: 'CreaDraw Kids Specialtillverkad Dragskoväska' },
    { id: '68be85b9094d08828def6dfa', name: 'CreaDraw Shop Specialtillverkad Dragskoväska' },
    { id: '68be85b9094d08828def6dfb', name: 'CreaDraw Plus RPET dragsko med tryck' },
    { id: '68be85b9094d08828def6dfc', name: 'CreaDraw Kids RPET Specialtillverkad Dragskoväska' },
    { id: '68be85ba094d08828def6eaa', name: 'CreaDraw Plus Dragskopåse' },
    { id: '68be85ba094d08828def6eab', name: 'CreaDraw Shop RPET Specialtillverkad Dragskoväska' },
    { id: '68be85ba094d08828def6eac', name: 'CreaDraw Supreme dragsko med tryck' },
    { id: '68be85ba094d08828def6ead', name: 'CreaDraw Zip RPET Dragskoväska' },
    { id: '68be85ba094d08828def6eae', name: 'CreaDraw RFID Specialtillverkad Dragskoväska' },
    { id: '68be85ba094d08828def6eaf', name: 'CreaDraw RFID RPET Specialtillverkad Dragskoväska' },
    { id: '68be85ba094d08828def6eb0', name: 'CreaDraw Zip Dragskoväska' },
    { id: '68be85ba094d08828def6eb1', name: 'CreaDraw T RPET dragsko med tryck' },
    { id: '68be85ba094d08828def6eb2', name: 'CreaDraw T Skräddarsydd dragskoväska' },
    { id: '68be85ba094d08828def6eb3', name: 'CreaDraw T Kids RPET Specialtillverkad Dragskoväska' },
    { id: '68be85ba094d08828def6eb4', name: 'CreaDraw T Kids Specialtillverkad Dragskoväska' },
    { id: '68be85ba094d08828def6eb5', name: 'Pudrow RPET-väska med dragsko' },
    // ... and 170 more products
  ],

  // team-wear (259 products)
  'team-wear': [
    { id: '68be85ad094d08828def4549', name: 'Squad Go Jacket M' },
    { id: '68be85ad094d08828def454b', name: 'Craft Träningsjacka Progress Herr' },
    { id: '68be85ad094d08828def4550', name: 'Squad 2.0 Full Zip M' },
    { id: '68be85ad094d08828def4552', name: 'Squad 2.0 Full Zip W' },
    { id: '68be85ad094d08828def4555', name: 'Squad Go Jacket W' },
    { id: '68be85ad094d08828def455b', name: 'Squad Go Jacket Jr' },
    { id: '68be85ad094d08828def455c', name: 'Rush 2.0 Training Jacket Jr' },
    { id: '68be85ad094d08828def4568', name: 'Rush 2.0 Training Jacket W' },
    { id: '68be85ad094d08828def456a', name: 'Evolve 2.0 Full Zip Jacket W' },
    { id: '68be85ad094d08828def4570', name: 'Craft Målvaktströja Squad Dam' },
    { id: '68be85ad094d08828def457c', name: 'Squad 2.0 Full Zip Jr' },
    { id: '68be85ad094d08828def457d', name: 'Squad 2.0 Full Zip W' },
    { id: '68be85ad094d08828def4583', name: 'Squad 2.0 Half Zip Jr' },
    { id: '68be85ad094d08828def4584', name: 'Squad 2.0 Half Zip M' },
    { id: '68be85ad094d08828def4588', name: 'Squad 2.0 Crewneck Jr' },
    { id: '68be85ad094d08828def4589', name: 'Squad 2.0 Crewneck M' },
    { id: '68be85ad094d08828def458c', name: 'Squad 2.0 Half Zip W' },
    { id: '68be85ad094d08828def458d', name: 'Squad 2.0 Crewneck W' },
    { id: '68be85ad094d08828def45a9', name: 'Community 2.0 Logo Fz Hoodie W' },
    { id: '68be85ad094d08828def45aa', name: 'Community 2.0 Logo Hoodie M' },
    { id: '68be85ad094d08828def45ac', name: 'Squad Go Hz M' },
    { id: '68be85ad094d08828def45ad', name: 'Squad Go Hz Jr' },
    { id: '68be85ad094d08828def45ae', name: 'Community 2.0 Logo Hoodie W' },
    { id: '68be85ad094d08828def45af', name: 'Squad Go Hz W' },
    { id: '68be85ad094d08828def45b0', name: 'Squad Go Fz Jacket Jr' },
    { id: '68be85ad094d08828def45b1', name: 'Craft Kortärmad Matchtröja Progress Contrast Junior' },
    { id: '68be85ad094d08828def45b2', name: 'Community 2.0 Hoodie W' },
    { id: '68be85ad094d08828def45b3', name: 'Community 2.0 Zip Jkt M' },
    { id: '68be85ad094d08828def45b4', name: 'Craft Träningströja Halfzip Progress Dam' },
    { id: '68be85ad094d08828def45b5', name: 'Community 2.0 R Neck M' },
    { id: '68be85ad094d08828def45b6', name: 'Community 2.0 R Neck W' },
    { id: '68be85ad094d08828def45b7', name: 'Squad Short Solid Wb Jr' },
    { id: '68be85ad094d08828def45b8', name: 'Community 2.0 Hoodie M' },
    { id: '68be85ad094d08828def45b9', name: 'Community 2.0 Function Hoodie W' },
    { id: '68be85ad094d08828def45ba', name: 'Squad Go Pant M' },
    { id: '68be85ad094d08828def45bb', name: 'Community 2.0 Hoodie Jr' },
    { id: '68be85ad094d08828def45bc', name: 'Craft Kortärmad Matchtröja Progress Jersey Stripe Junior' },
    { id: '68be85ad094d08828def45bd', name: 'Craft Kortärmad Matchtröja Progress Stripe Dam' },
    { id: '68be85ad094d08828def45be', name: 'Progress Indoor Jersey M' },
    { id: '68be85ad094d08828def45bf', name: 'Pro Control Button Jersey M' },
    { id: '68be85ad094d08828def45c0', name: 'Craft Träningströja Halfzip Progress Junior' },
    { id: '68be85ad094d08828def45c1', name: 'Craft Matchtröja Progress Graphic Junior' },
    { id: '68be85ad094d08828def45c3', name: 'Progress Indoor Jersey W' },
    { id: '68be85ad094d08828def45c4', name: 'Pro Control Fade Jersey Jr' },
    { id: '68be85ad094d08828def45c5', name: 'Progress Indoor Jersey Jr' },
    { id: '68be85ad094d08828def45c6', name: 'Squad Skirt W' },
    { id: '68be85ad094d08828def45c7', name: 'Craft Träningsjacka Progress Dam' },
    { id: '68be85ad094d08828def45c8', name: 'Squad Skirt Jr' },
    { id: '68be85ad094d08828def45c9', name: 'Craft Träningsjacka Progress Junior' },
    { id: '68be85ad094d08828def45ca', name: 'Craft Matchtröja Progress Graphic Dam' },
    { id: '68be85ad094d08828def45cb', name: 'Pro Control Hood Jacket W' },
    { id: '68be85ad094d08828def45cc', name: 'Pro Control Hood Jacket M' },
    { id: '68be85ad094d08828def4614', name: 'Squad 2.0 Pant Jr' },
    { id: '68be85ad094d08828def461f', name: 'Squad Short Solid Wb Jr' },
    { id: '68be85ad094d08828def4624', name: 'Squad Go Pant M' },
    { id: '68be85ad094d08828def462f', name: 'Pro Control Poloshirt W' },
    { id: '68be85ad094d08828def4676', name: 'Community 2.0 Logo Hoodie Jr' },
    { id: '68be85ad094d08828def4677', name: 'Community 2.0 Hoodie Jr' },
    { id: '68be85ad094d08828def467c', name: 'Squad Go Fz Jacket M' },
    { id: '68be85ad094d08828def467d', name: 'Community 2.0 Hoodie W' },
    { id: '68be85ad094d08828def4680', name: 'Squad Go Hz Jr' },
    { id: '68be85ad094d08828def4682', name: 'Squad Go Hz M' },
    { id: '68be85ad094d08828def4683', name: 'Community 2.0 Logo Hoodie W' },
    { id: '68be85ad094d08828def4684', name: 'Community 2.0 Hoodie W' },
    { id: '68be85ad094d08828def4685', name: 'Community 2.0 R Neck M' },
    { id: '68be85ad094d08828def4686', name: 'Community 2.0 Zip Jkt M' },
    { id: '68be85ad094d08828def4688', name: 'Community 2.0 R Neck W' },
    { id: '68be85ad094d08828def468f', name: 'Community 2.0 Hoodie M' },
    { id: '68be85ad094d08828def46a5', name: 'Craft Uppvärmningströja Progress Junior' },
    { id: '68be85ad094d08828def46a6', name: 'Craft Uppvärmningströja Progress Dam' },
    { id: '68be85ad094d08828def46a7', name: 'Pro Control Hood Jacket Jr' },
    { id: '68be85ad094d08828def46a8', name: 'Pro Control Seamless Jersey Jr' },
    { id: '68be85ad094d08828def46a9', name: 'Craft Vindjacka Junior' },
    { id: '68be85ad094d08828def46aa', name: 'Warm Club Jkt Jr' },
    { id: '68be85ad094d08828def46ab', name: 'Craft Kjol Pro Control Impact' },
    { id: '68be85ad094d08828def46ac', name: 'Pro Control Poloshirt W' },
    { id: '68be85ad094d08828def46ad', name: 'Craft Kjol Pro Control Impact Junior' },
    { id: '68be85ad094d08828def46ae', name: 'Prog Gk Ls Jersey Wo Padding W' },
    { id: '68be85ad094d08828def46af', name: 'Progress Gk Ls Jrsy Wo Padd Jr' },
    { id: '68be85ad094d08828def46b0', name: 'Craft Shorts Pro Control Impact Junior' },
    { id: '68be85ad094d08828def46b1', name: 'Craft Träningsbyxa Progress Junior' },
    { id: '68be85ad094d08828def46b2', name: 'Craft Shorts Pro Control Impact Dam' },
    { id: '68be85ad094d08828def46b3', name: 'Pro Control Pants Jr' },
    { id: '68be85ad094d08828def46b4', name: 'Progress Pant Straight M' },
    { id: '68be85ad094d08828def46b5', name: 'Pro Control Pants W' },
    { id: '68be85ad094d08828def4715', name: 'Craft Träningsjacka Progress Dam' },
    { id: '68be85ad094d08828def4716', name: 'Craft Träningsjacka Progress Junior' },
    { id: '68be85ad094d08828def4717', name: 'Craft Vindjacka Junior' },
    { id: '68be85ad094d08828def4718', name: 'Squad Skirt Jr' },
    { id: '68be85ad094d08828def471e', name: 'Craft Kjol Pro Control Impact Junior' },
    { id: '68be85ad094d08828def4725', name: 'Craft Träningsbyxa Progress Junior' },
    { id: '68be85ad094d08828def4728', name: 'Pro Control Pants Jr' },
    { id: '68be85ad094d08828def47b5', name: 'Pro Control Hood Jacket W' },
    { id: '68be85ad094d08828def47b7', name: 'Craft Uppvärmningströja Progress Junior' },
    { id: '68be85ad094d08828def47b8', name: 'Craft Uppvärmningströja Progress Dam' },
    { id: '68be85ad094d08828def47ba', name: 'Pro Control Hood Jacket Jr' },
    { id: '68be85ad094d08828def47bb', name: 'Pro Control Seamless Jersey Jr' },
    { id: '68be85ad094d08828def47bc', name: 'Warm Club Jkt Jr' },
    { id: '68be85b3094d08828def5959', name: 'Craft Shorts Squad Solid Herr' },
    { id: '68be85b3094d08828def595d', name: 'Progress Reversible Shorts Jr' },
    // ... and 159 more products
  ],

  // shopping-bags (256 products)
  'shopping-bags': [
    { id: '68be85ad094d08828def453a', name: 'Shoppingvagn' },
    { id: '68be85ad094d08828def4769', name: 'Reykjavik, tote bag' },
    { id: '68be85ad094d08828def4873', name: 'Carrie Colour - Hopvikbar kasse 140 gr/m²' },
    { id: '68be85ad094d08828def487e', name: 'Mare - Strandväska med rephandtag' },
    { id: '68be85ae094d08828def4945', name: 'Katote shoppingväska i bomull' },
    { id: '68be85af094d08828def4b84', name: 'MADEIRA. 100 % ekologisk bomullspåse (140 g/m²)' },
    { id: '68be85af094d08828def4c3c', name: 'Annapurna Tote Bag' },
    { id: '68be85af094d08828def4c3e', name: 'Everest Tote Bag' },
    { id: '68be85af094d08828def4c3f', name: 'Kilimanjaro Tote Bag' },
    { id: '68be85af094d08828def4c4a', name: 'Blanc Tote Bag' },
    { id: '68be85af094d08828def4c4c', name: 'Logan Tote Bag' },
    { id: '68be85af094d08828def4c4e', name: 'Aconcagua Tote Bag' },
    { id: '68be85af094d08828def4c4f', name: 'Elbrus Tote Bag' },
    { id: '68be85af094d08828def4ec1', name: 'Recote Plus shoppingväska i bomull' },
    { id: '68be85b0094d08828def4f95', name: 'Guzzin RPET shoppingväska' },
    { id: '68be85b0094d08828def4f9f', name: 'Rezzin RPET shoppingväska' },
    { id: '68be85b0094d08828def4fcf', name: 'Rezzin RPET shoppingväska' },
    { id: '68be85b0094d08828def501b', name: 'Berber vikbar RPET shoppingväska' },
    { id: '68be85b0094d08828def5050', name: 'Rester RPET shoppingväska' },
    { id: '68be85b0094d08828def509a', name: 'Rester RPET shoppingväska' },
    { id: '68be85b0094d08828def5199', name: 'Shoppingväska i bomull Cole' },
    { id: '68be85b0094d08828def51a6', name: 'Shoppingväska i RPET filt Hunter' },
    { id: '68be85b0094d08828def51e7', name: 'Shoppingväska i Oeko-Tex bomull (140 g/m2) Kenneth' },
    { id: '68be85b1094d08828def538f', name: 'Shoppingväska i Oeko-Tex bomull (220 g/m2) Isaac' },
    { id: '68be85b1094d08828def53c7', name: 'Shoppingväska i Oeko-Tex bomull (220 g/m2) Isaac' },
    { id: '68be85b8094d08828def6aae', name: 'Varai 320 g/m² shoppingväska av kanvas och jute 23L' },
    { id: '68be85b8094d08828def6aaf', name: 'Odessa tygväska av 220 g/m² återvunnet material' },
    { id: '68be85b8094d08828def6ab0', name: 'Orissa tygväska av ekologisk bomull, 270 g/m² 10L' },
    { id: '68be85b8094d08828def6ab1', name: 'Zeus tygväska av GRS-återvunnen non-woven 6 liter' },
    { id: '68be85b8094d08828def6ab3', name: 'Weekender tygväska av 500 g/m² Aware-återvunnet material' },
    { id: '68be85b8094d08828def6ab4', name: 'Madras 140 g/m² tygväska av återvunnen GRS-bomull med bälg' },
    { id: '68be85b8094d08828def6ab5', name: 'Page tygväska av 500 g/m² Aware-återvunnetm material' },
    { id: '68be85b8094d08828def6ab6', name: 'Impact AWARE tote-väska 285gsm ofärgad rcanvas' },
    { id: '68be85b8094d08828def6ab8', name: 'Impact Aware stor tote-väska 240 gsm ofärgad rcanvas' },
    { id: '68be85b8094d08828def6ab9', name: 'Florida 270 g/m² tygväska med bälg 14L' },
    { id: '68be85b8094d08828def6aba', name: 'Joey mångsidig tygväska av GRS-återvunnen canvas, 14 l' },
    { id: '68be85b8094d08828def6abb', name: 'Florida 270 g/m² tygväska 10L' },
    { id: '68be85b8094d08828def6abd', name: 'Madras Blend 140 g/m² tygväska av GRS-certifierad återvunnen bomull 7L' },
    { id: '68be85b8094d08828def6abe', name: 'Sam 320 g/m² tygväska av GRS-återvunnen bomull' },
    { id: '68be85b8094d08828def6abf', name: 'EcoFold hopvikbar tygväska av RPET på 16 l' },
    { id: '68be85b8094d08828def6ac0', name: 'Renew AWARE rPET väska' },
    { id: '68be85b8094d08828def6ac4', name: 'Cottonel Colour ++ - Kasse bomull 180gr/m2' },
    { id: '68be85b8094d08828def6ac6', name: 'Fresa - Ihopvikbar väska' },
    { id: '68be85b8094d08828def6ac7', name: 'Campo De Fiori - Shoppingkasse i jute/canvas' },
    { id: '68be85b8094d08828def6ac9', name: 'Moira - Bomullskasse canvas 220g/m2' },
    { id: '68be85b8094d08828def6b70', name: 'Osole Colour - Fairtrade kasse 140gr/m²' },
    { id: '68be85b8094d08828def6b74', name: 'Carrie Colour - Hopvikbar kasse 140 gr/m²' },
    { id: '68be85b8094d08828def6b75', name: 'Mare - Strandväska med rephandtag' },
    { id: '68be85b8094d08828def6b82', name: 'Shop Easy hopvikbar shoppingväska' },
    { id: '68be85b8094d08828def6b83', name: 'Shop Easy RPET hopvikbar shoppingväska' },
    { id: '68be85b9094d08828def6c63', name: 'Strawberry ihopvikbar väska' },
    { id: '68be85b9094d08828def6c64', name: 'Shoppingbag i återvunnen bomull' },
    { id: '68be85b9094d08828def6c65', name: 'Balanja - Juteväska' },
    { id: '68be85b9094d08828def6c66', name: 'Felt Shopper' },
    { id: '68be85b9094d08828def6c69', name: 'Shoppingbag' },
    { id: '68be85b9094d08828def6c6a', name: 'Canvas Shoppy Colour (220g/m²) väska' },
    { id: '68be85b9094d08828def6c6b', name: 'PLAKA. Vikbar påse av 210D' },
    { id: '68be85b9094d08828def6c6d', name: 'VILLE. Canvaspåsei 100 % bomull med fram- och innerficka (280 g/m²)' },
    { id: '68be85b9094d08828def6c6e', name: 'Elegance Bag jute shopper' },
    { id: '68be85b9094d08828def6cc2', name: 'Madras Blend 140 g/m² tygväska av GRS-certifierad återvunnen bomull 7L' },
    { id: '68be85b9094d08828def6cf8', name: 'Shop Easy RPET hopvikbar shoppingväska' },
    { id: '68be85b9094d08828def6cfd', name: 'Axelremsväska canvas OEKO-TEX® 270g/m² 45x10x33cm' },
    { id: '68be85b9094d08828def6d02', name: 'Shoppingbag i återvunnen bomull' },
    { id: '68be85b9094d08828def6d61', name: 'Feltro GRS RPET BigShopper shoppingväska' },
    { id: '68be85b9094d08828def6d62', name: 'Organic Cotton Canvas Tote Bag (280 g/m²) väska' },
    { id: '68be85b9094d08828def6d69', name: 'Vikbar shoppingväska' },
    { id: '68be85b9094d08828def6d6a', name: 'ECO Shopper Organic Cotton (180 g/m²) väska' },
    { id: '68be85b9094d08828def6d6b', name: 'Annapurna Tote Bag' },
    { id: '68be85b9094d08828def6d6c', name: 'Everest Tote Bag' },
    { id: '68be85b9094d08828def6d6d', name: 'Kilimanjaro Tote Bag' },
    { id: '68be85b9094d08828def6d6e', name: 'Shoppy Colour Bag GRS Recycled Cotton (150 g/m²) väska' },
    { id: '68be85b9094d08828def6d6f', name: 'Blanc Tote Bag' },
    { id: '68be85b9094d08828def6d70', name: 'Sigga - Väska - 270 g/m²' },
    { id: '68be85b9094d08828def6d72', name: 'Elbrus Tote Bag' },
    { id: '68be85b9094d08828def6dfd', name: 'Nissan - Kasse/väska - 118 g/m²' },
    { id: '68be85b9094d08828def6dfe', name: 'Mirra - Väska' },
    { id: '68be85b9094d08828def6dff', name: 'Colour Square Bag GRS Recycled Cotton (150 g/m²) väska' },
    { id: '68be85b9094d08828def6e00', name: 'Pocket umbrella shoppingbag' },
    { id: '68be85b9094d08828def6e01', name: 'Melange Shopper GRS Recycled Canvas (280 g/m²) väska' },
    { id: '68be85b9094d08828def6e02', name: 'Wolkat Rabat Recycled Textile Shopper shoppingväska' },
    { id: '68be85b9094d08828def6e03', name: 'Shoppingväska i Oeko-Tex bomull (140 g/m2) Kenneth' },
    { id: '68be85b9094d08828def6e04', name: 'Tygkasse Shoppy' },
    { id: '68be85b9094d08828def6e06', name: 'Canvas Large Tote' },
    { id: '68be85b9094d08828def6e07', name: 'MADEIRA. 100 % ekologisk bomullspåse (140 g/m²)' },
    { id: '68be85b9094d08828def6e08', name: 'Organic Canvas Pro Shopper (320 g/m²) väska' },
    { id: '68be85ba094d08828def6e7a', name: 'Alfie GRS Recycled Shopper (270 g/m²) väska' },
    { id: '68be85ba094d08828def6e7b', name: 'Dekrox shoppingväska' },
    { id: '68be85ba094d08828def6e7c', name: 'Bondi shoppingväska' },
    { id: '68be85ba094d08828def6e7d', name: 'Katote shoppingväska i bomull' },
    { id: '68be85ba094d08828def6e7e', name: 'Recote Plus shoppingväska i bomull' },
    { id: '68be85ba094d08828def6e7f', name: 'Guzzin RPET shoppingväska' },
    { id: '68be85ba094d08828def6e80', name: 'Rezzin RPET shoppingväska' },
    { id: '68be85ba094d08828def6ed4', name: 'Konti shoppingväska i bomull' },
    { id: '68be85bc094d08828def79dc', name: 'Pocket umbrella shoppingbag' },
    { id: '68be85be094d08828def7d74', name: 'Hopfällbar kundkorg' },
    { id: '68be85bf094d08828def813d', name: 'Odessa tygväska av 220 g/m² återvunnet material' },
    { id: '68be85bf094d08828def813f', name: 'Impact Aware stor tote-väska 240 gsm ofärgad rcanvas' },
    { id: '68be85bf094d08828def8140', name: 'Madras Blend 140 g/m² tygväska av GRS-certifierad återvunnen bomull 7L' },
    { id: '68be85bf094d08828def8141', name: 'EcoFold hopvikbar tygväska av RPET på 16 l' },
    { id: '68be85bf094d08828def8142', name: 'Cottonel Colour ++ - Kasse bomull 180gr/m2' },
    // ... and 156 more products
  ],

  // towels (241 products)
  'towels': [
    { id: '68be85ad094d08828def464e', name: 'Makaha Strandhandduk' },
    { id: '68be85ad094d08828def469c', name: 'CAPLAN. Multifunktionell handduk (260 g/m²) tillverkad av lätt och motståndskraftig bomull (90 %) oc' },
    { id: '68be85ad094d08828def489f', name: 'BARDEM S. Handduk (350 g/m²) i bomull (82 %) och återvunnen bomull (18 %)' },
    { id: '68be85ad094d08828def4903', name: 'BARDEM L. Handduk (500 g/m²) i bomull (82 %) och återvunnen bomull (18 %)' },
    { id: '68be85ad094d08828def490e', name: 'MALEK. Multifunktionell handduk och badhandduk (350 g/m²) av lätt och motståndskraftig bomull (85 %)' },
    { id: '68be85ae094d08828def4a10', name: 'Sand - SEAQUAL® handduk 70x140cm' },
    { id: '68be85ae094d08828def4abd', name: 'Oreti Strandhandduk' },
    { id: '68be85ae094d08828def4adb', name: 'Wave - SEAQUAL® hamamhandduk 100x170' },
    { id: '68be85ae094d08828def4adf', name: 'Water - SEAQUAL® handduk 100x170cm' },
    { id: '68be85af094d08828def4bba', name: 'Terry L handduk i bomullsfrotté - 70×140 cm' },
    { id: '68be85af094d08828def4c03', name: 'Mar - SEAQUAL® hamamhandduk 70x140' },
    { id: '68be85af094d08828def4c2d', name: 'Hammam handduk av 100 % bomull Riyad' },
    { id: '68be85af094d08828def4c99', name: 'Luzimar Strandhandduk' },
    { id: '68be85af094d08828def4cfb', name: 'Handduk i RPET Brunilda' },
    { id: '68be85af094d08828def4d06', name: 'Cellini Towel' },
    { id: '68be85af094d08828def4d23', name: 'Rodin Towel' },
    { id: '68be85af094d08828def4d69', name: 'Terry M handduk i bomullsfrotté - 50×100 cm' },
    { id: '68be85af094d08828def4db4', name: 'SARDENHA. Strandhandduk i bomull (70 % återvunnen) och polyester (30 % återvunnen) (180 g/m²)' },
    { id: '68be85af094d08828def4dc7', name: 'Botticelli XL Towel' },
    { id: '68be85af094d08828def4dcc', name: 'Donatello S Towel' },
    { id: '68be85af094d08828def4ddf', name: 'Botticelli S Towel' },
    { id: '68be85af094d08828def4de0', name: 'Botticelli M Towel' },
    { id: '68be85af094d08828def4de1', name: 'Donatello M Towel' },
    { id: '68be85af094d08828def4de8', name: 'Donatello L Towel' },
    { id: '68be85af094d08828def4deb', name: 'Botticelli L Towel' },
    { id: '68be85af094d08828def4dee', name: 'Handduk, kylande, för utomhusbruk   SCHWARZWOLF LANAO,' },
    { id: '68be85af094d08828def4e27', name: 'Terry S handduk i bomullsfrotté - 30×50 cm' },
    { id: '68be85af094d08828def4e75', name: 'Donatello XL Towel' },
    { id: '68be85af094d08828def4e7c', name: 'Amadeo Towel' },
    { id: '68be85b0094d08828def4f46', name: 'Praia strandhandduk och väska med dragsko' },
    { id: '68be85b0094d08828def4fb5', name: 'Waxoff - Dubbelsidig mikrofiberhandduk' },
    { id: '68be85b2094d08828def5526', name: 'Amelia handduk av 450 g/m² bomull, 70 x 140 cm' },
    { id: '68be85b2094d08828def5527', name: 'Remy kylhandduk i PET-behållare' },
    { id: '68be85b2094d08828def5529', name: 'Pieter ultralättviktig och snabbtorkande handduk i återvunnen PET 130 x 80 cm' },
    { id: '68be85b2094d08828def552a', name: 'Kyl-handduk' },
    { id: '68be85b2094d08828def552c', name: 'Nora handduk av 550 g/m² bomull, 50 x 100 cm' },
    { id: '68be85b2094d08828def552d', name: 'Riley handduk av 550 g/m² bomull, 100 x 180 cm' },
    { id: '68be85b2094d08828def552e', name: 'Anna hammamhandduk av 150 g/m² bomull, 100 x 180 cm' },
    { id: '68be85b2094d08828def5530', name: 'Pieter GRS ultralätt och snabbtorkande handduk 30 x 50 cm' },
    { id: '68be85b2094d08828def5531', name: 'Althea sporthandduk 30 x 80 cm' },
    { id: '68be85b2094d08828def5532', name: 'Pieter GRS ultralätt och snabbtorkande handduk 50 x 100 cm' },
    { id: '68be85b2094d08828def5533', name: 'Pieter GRS ultralätt och snabbtorkande handduk 100 x 180 cm' },
    { id: '68be85b2094d08828def5534', name: 'Althea sporthandduk 50 x 100 cm' },
    { id: '68be85b2094d08828def5535', name: 'Althea sporthandduk 70 x 140 cm' },
    { id: '68be85b2094d08828def5536', name: 'Anders hamamhandduk 147 x 75,5 cm' },
    { id: '68be85b2094d08828def5537', name: 'Lucas RPET-sporthandduk 50 x 100 cm' },
    { id: '68be85b2094d08828def5538', name: 'Lucas RPET-sporthandduk 70 x 140 cm' },
    { id: '68be85b2094d08828def553a', name: 'VINGA Tolo hamam frottéhandduk' },
    { id: '68be85b2094d08828def5577', name: 'Terry - Handduk organsik bomull 100x50' },
    { id: '68be85b2094d08828def5578', name: 'Merry - Handduk organiskbomull 180x100' },
    { id: '68be85b2094d08828def5579', name: 'Taoru - Sport handduk' },
    { id: '68be85b2094d08828def557a', name: 'Tuko Rpet - Sporthandduk i RPET i påse' },
    { id: '68be85b2094d08828def557b', name: 'Tuko - Sport handduk med ficka' },
    { id: '68be85b2094d08828def557c', name: 'Drye - Sporthandduk' },
    { id: '68be85b2094d08828def557d', name: 'Agoura - Hamman handduk  140gr/m²' },
    { id: '68be85b2094d08828def557e', name: 'Serry - Handduk ekologisk 50x30cm' },
    { id: '68be85b2094d08828def557f', name: 'Water - SEAQUAL® handduk 100x170cm' },
    { id: '68be85b2094d08828def5580', name: 'Mar - SEAQUAL® hamamhandduk 70x140' },
    { id: '68be85b2094d08828def5581', name: 'Waxoff - Dubbelsidig mikrofiberhandduk' },
    { id: '68be85b2094d08828def5582', name: 'Palm Beach Towel 100x150' },
    { id: '68be85b2094d08828def5583', name: 'Westlake Towel 70x130' },
    { id: '68be85b2094d08828def5584', name: 'Baypoint Towel 50x70' },
    { id: '68be85b2094d08828def5587', name: 'Badhandduk 70x140' },
    { id: '68be85b2094d08828def5588', name: 'Handduk 50x100' },
    { id: '68be85b2094d08828def5589', name: 'Frotté Fairtrade 550 g' },
    { id: '68be85b2094d08828def558a', name: 'Frottéset Kungshamn  2+2' },
    { id: '68be85b2094d08828def558b', name: 'Frotté 420g' },
    { id: '68be85b2094d08828def558c', name: 'Frottéset Askersund 2+2' },
    { id: '68be85b2094d08828def558e', name: 'Badlakan Vändbar' },
    { id: '68be85b2094d08828def558f', name: 'Luxury range bath towel' },
    { id: '68be85b2094d08828def55e4', name: 'Frotté 600g' },
    { id: '68be85b2094d08828def55e5', name: 'Frotté 500g' },
    { id: '68be85b2094d08828def55e7', name: 'Hamam Amdal' },
    { id: '68be85b2094d08828def55e8', name: 'Luxury range bath sheet' },
    { id: '68be85b2094d08828def55e9', name: 'Luxury range gym towel' },
    { id: '68be85b2094d08828def55ea', name: 'Badlakan Melange' },
    { id: '68be85b2094d08828def55eb', name: 'Hamam Morhult' },
    { id: '68be85b2094d08828def55ec', name: 'Frottéset Linda 2+2' },
    { id: '68be85b2094d08828def55ed', name: 'Träningshandduk' },
    { id: '68be85b2094d08828def55ee', name: 'Hamam Torsvik' },
    { id: '68be85b2094d08828def55ef', name: 'CoolDown kylhandduk' },
    { id: '68be85b2094d08828def55f0', name: 'Luxury Hand Towel' },
    { id: '68be85b2094d08828def55f1', name: 'CALIFORNIA. Strandhandduk i mikrofiber (250 g/m²)' },
    { id: '68be85b2094d08828def55f2', name: 'Badlakan Cabana' },
    { id: '68be85b2094d08828def55f3', name: 'ARTX PLUS. Set med en PP- och PET-flaska och en sporthandduk av polyamid och polyester' },
    { id: '68be85b2094d08828def55f5', name: 'TriDri® microfibre quick dry fitness towel' },
    { id: '68be85b2094d08828def55f6', name: 'Quick Dry Sports/Travel Towel sporthandduk' },
    { id: '68be85b2094d08828def55f7', name: 'Fitnesshandduk R-PET' },
    { id: '68be85b2094d08828def55f8', name: 'BERNAL. återvunnen polyester (100% rPET) fitness kylhandduk med non-woven påse' },
    { id: '68be85b2094d08828def562a', name: 'SportsTowel sport handduk' },
    { id: '68be85b2094d08828def562b', name: 'Hammam handduk av 100 % bomull Riyad' },
    { id: '68be85b2094d08828def562c', name: 'Walra Bathtowel Remade Cotton 70 x 140 badhandduk' },
    { id: '68be85b2094d08828def562d', name: 'Handduk i RPET Brunilda' },
    { id: '68be85b2094d08828def562e', name: 'Frotté Seaside' },
    { id: '68be85b2094d08828def5630', name: 'Ella hamam 90x170cm GRS (8)' },
    { id: '68be85b2094d08828def5631', name: 'CAPLAN. Multifunktionell handduk (260 g/m²) tillverkad av lätt och motståndskraftig bomull (90 %) oc' },
    { id: '68be85b2094d08828def5667', name: 'Wooosh Bath Towel GRS Recycle Cotton Mix 140 x 70 cm' },
    { id: '68be85b2094d08828def5668', name: 'Wooosh Towel GRS Recycle Cotton Mix  100 x 50 cm' },
    { id: '68be85b2094d08828def5669', name: 'Cellini Towel' },
    { id: '68be85b2094d08828def566a', name: 'Rodin Towel' },
    // ... and 141 more products
  ],

  // necessarer (240 products)
  'necessarer': [
    { id: '68be85ad094d08828def4756', name: 'Florens, necessär L' },
    { id: '68be85ad094d08828def4758', name: 'Florens, necessär S' },
    { id: '68be85ad094d08828def475a', name: 'Sandhamn, necessär' },
    { id: '68be85ad094d08828def4767', name: 'Reykjavik, necessär' },
    { id: '68be85ad094d08828def481a', name: 'Escape, toilet bag Bergen' },
    { id: '68be85ad094d08828def4823', name: 'Escape, cosmetic Dull rubber PU' },
    { id: '68be85ad094d08828def4885', name: 'House of Sajaco, necessär' },
    { id: '68be85ad094d08828def4895', name: 'Flight, toiletry bag' },
    { id: '68be85ad094d08828def48ea', name: 'CreaBeauty Cork M Sminkväska' },
    { id: '68be85ad094d08828def48ef', name: 'CreaBeauty M Sminkväska' },
    { id: '68be85ae094d08828def4932', name: 'Toilet Case Bags' },
    { id: '68be85ae094d08828def493a', name: 'CreaBeauty L Sminkväska' },
    { id: '68be85ae094d08828def4948', name: 'CreaBeauty Cork S Sminkväska' },
    { id: '68be85ae094d08828def49e1', name: 'CreaBeauty Cork L Sminkväska' },
    { id: '68be85ae094d08828def4a0e', name: 'Pesacara - Necessär bomull 340 gr/m²' },
    { id: '68be85af094d08828def4b78', name: 'MALLORCA. Multifunktionsväska gjord av återvunnen filt (100% rPET)' },
    { id: '68be85af094d08828def4bc1', name: 'Rebix kosmetikväska' },
    { id: '68be85af094d08828def4bfe', name: 'Elnas - Neccessär i 320 gr/m²' },
    { id: '68be85af094d08828def4c5b', name: 'Riga Toiletry Bag' },
    { id: '68be85af094d08828def4c62', name: 'FELPY. Multifunktionsfodral tillverkad av återvunnen filt (100% rPET)' },
    { id: '68be85af094d08828def4c91', name: 'Mecol kosmetikväska' },
    { id: '68be85af094d08828def4d07', name: 'Shanghai Toiletry Bag' },
    { id: '68be85af094d08828def4dc9', name: 'Macao Toiletry Bag' },
    { id: '68be85af094d08828def4df2', name: 'Necessär RPET Natascha' },
    { id: '68be85af094d08828def4e89', name: 'Venice Toiletry Bag' },
    { id: '68be85af094d08828def4eca', name: 'Torebix kosmetikväska' },
    { id: '68be85b0094d08828def4f92', name: 'CreaBeauty Square S kosmetikväska med tryck' },
    { id: '68be85b0094d08828def4f9a', name: 'CreaBeauty Carry kosmetikväska med tryck' },
    { id: '68be85b0094d08828def4f9b', name: 'CreaBeauty L RPET kosmetikväska med tryck' },
    { id: '68be85b0094d08828def4f9d', name: 'CreaBeauty Square L kosmetikväska med tryck' },
    { id: '68be85b0094d08828def4fa0', name: 'CreaBeauty Square M kosmetikväska med tryck' },
    { id: '68be85b0094d08828def4fa1', name: 'CreaBeauty M RPET kosmetikväska med tryck' },
    { id: '68be85b0094d08828def4fd0', name: 'CreaBeauty L RPET kosmetikväska med tryck' },
    { id: '68be85b0094d08828def4fd1', name: 'CreaBeauty S RPET kosmetikväska med tryck' },
    { id: '68be85b0094d08828def4fd6', name: 'CreaBeauty Cork L RPET Sminkväska' },
    { id: '68be85b0094d08828def4fdb', name: 'CreaBeauty Cork S RPET Sminkväska' },
    { id: '68be85b0094d08828def4fe2', name: 'CreaBeauty Cork M RPET Sminkväska' },
    { id: '68be85b0094d08828def5012', name: 'CreaBeauty Cork M RPET Sminkväska' },
    { id: '68be85b0094d08828def504b', name: 'Mekkox kosmetikväska' },
    { id: '68be85b0094d08828def5098', name: 'Cospu RPU kosmetisk väska' },
    { id: '68be85b0094d08828def5172', name: 'Necessär i RPET filt Lucy' },
    { id: '68be85b0094d08828def51a8', name: 'Sminkväska i återvunnen bomull (180 gsm) Cressida' },
    { id: '68be85b0094d08828def51bd', name: 'Rebyss Beauty kosmetikväska i återvunnen canvas' },
    { id: '68be85b0094d08828def5202', name: 'Jacques vattentät kosmetikväska' },
    { id: '68be85b0094d08828def521f', name: 'CreaBeauty XL kosmetikväska med tryck' },
    { id: '68be85be094d08828def7ed6', name: 'Transit necessär' },
    { id: '68be85be094d08828def7ee1', name: 'New & Smart - Necessär' },
    { id: '68be85be094d08828def7ee2', name: 'Naima Cosmetic - Necessär i Hampa 200 gr/m²' },
    { id: '68be85be094d08828def7ee3', name: 'Kleuren - Necessär i bomull med kontrast' },
    { id: '68be85be094d08828def7ee4', name: 'Moonlight - Necessär' },
    { id: '68be85be094d08828def7ee5', name: 'Plas - Neccesär i mikrofiber' },
    { id: '68be85be094d08828def7ee6', name: 'Porto Bag - Necessär i Bomull & Kork' },
    { id: '68be85be094d08828def7f2e', name: 'Bia - Necessär i canvas' },
    { id: '68be85be094d08828def7f2f', name: 'Pesacara - Necessär bomull 340 gr/m²' },
    { id: '68be85be094d08828def7f30', name: 'Elnas - Neccessär i 320 gr/m²' },
    { id: '68be85be094d08828def7f33', name: 'Florens, necessär L' },
    { id: '68be85be094d08828def7f34', name: 'Florens, necessär S' },
    { id: '68be85be094d08828def7f36', name: 'Necessär' },
    { id: '68be85be094d08828def7f39', name: 'MARIE. Multianvändningsfodral i mikrofiber' },
    { id: '68be85be094d08828def7f3b', name: 'Accessoarväska Filt' },
    { id: '68be85be094d08828def7f3c', name: 'Necessär Filt' },
    { id: '68be85be094d08828def7f3d', name: 'ANNIE. Mikrofiber- och mesh-sminkväska' },
    { id: '68be85be094d08828def7f3e', name: 'Sandhamn, necessär' },
    { id: '68be85be094d08828def7fa4', name: 'ELIZA. 300D sminkväska med vadderat handtag' },
    { id: '68be85be094d08828def7fa5', name: 'MARGOT. Lufttät EVA-necessär' },
    { id: '68be85be094d08828def7fa6', name: 'MMV Luton Necessär' },
    { id: '68be85be094d08828def7fa7', name: 'CHASTAIN. Genomskinlig. EVA-necessär med dragkedja' },
    { id: '68be85be094d08828def7fa8', name: 'WILLIS. Kosmetisk väska i mikrofiber med flera fickor' },
    { id: '68be85be094d08828def7fa9', name: 'Stacey GRS RPET necessär' },
    { id: '68be85be094d08828def7faa', name: 'Recycled Essentials Wash Bag' },
    { id: '68be85be094d08828def7fab', name: 'Necessär RPET Natascha' },
    { id: '68be85be094d08828def7fac', name: 'Boutique Vanity Case' },
    { id: '68be85be094d08828def7fae', name: 'Matte PU Toiletry/ Accessory Case' },
    { id: '68be85be094d08828def7faf', name: 'Boutique Clear Window Travel Case' },
    { id: '68be85be094d08828def7fb0', name: 'Boutique Toiletry/Accessory Case' },
    { id: '68be85bf094d08828def801d', name: 'Reykjavik, necessär' },
    { id: '68be85bf094d08828def801e', name: 'Necessär Flash' },
    { id: '68be85bf094d08828def801f', name: 'Bodarna - Necessär - 180 g/m²' },
    { id: '68be85bf094d08828def8020', name: 'Riga Toiletry Bag' },
    { id: '68be85bf094d08828def8022', name: 'Necessär i RPET filt Lucy' },
    { id: '68be85bf094d08828def8023', name: 'VOYAGER Necessär' },
    { id: '68be85bf094d08828def8024', name: 'Escape, toilet bag Bergen' },
    { id: '68be85bf094d08828def8025', name: 'Shanghai Toiletry Bag' },
    { id: '68be85bf094d08828def8026', name: 'Lennon RCS Recycled Toiletry Bag' },
    { id: '68be85bf094d08828def8027', name: 'Necessär Night & Day' },
    { id: '68be85bf094d08828def8028', name: 'Necessär Stripy' },
    { id: '68be85bf094d08828def8029', name: 'Flight, toiletry bag' },
    { id: '68be85bf094d08828def802a', name: 'Necessär Accessory' },
    { id: '68be85bf094d08828def802b', name: 'MALLORCA. Multifunktionsväska gjord av återvunnen filt (100% rPET)' },
    { id: '68be85bf094d08828def802c', name: 'Macao Toiletry Bag' },
    { id: '68be85bf094d08828def802d', name: 'FELPY. Multifunktionsfodral tillverkad av återvunnen filt (100% rPET)' },
    { id: '68be85bf094d08828def802e', name: 'Necessär Tube' },
    { id: '68be85bf094d08828def802f', name: 'Necessär Star' },
    { id: '68be85bf094d08828def8031', name: 'Joey väska för resetillbehör av återvunnen GRS-canvas 3,5 l' },
    { id: '68be85bf094d08828def8032', name: 'Impact Aware necessär 285 gsm ofärgad rcanvas' },
    { id: '68be85bf094d08828def8036', name: 'Renew AWARE rPET necessär' },
    { id: '68be85bf094d08828def803d', name: 'New & Smart - Necessär' },
    { id: '68be85bf094d08828def803e', name: 'Naima Cosmetic - Necessär i Hampa 200 gr/m²' },
    { id: '68be85bf094d08828def803f', name: 'Kleuren - Necessär i bomull med kontrast' },
    { id: '68be85bf094d08828def8040', name: 'Moonlight - Necessär' },
    // ... and 140 more products
  ],

  // sports-bags (210 products)
  'sports-bags': [
    { id: '68be85ad094d08828def4752', name: 'Sandhamn, weekendbag' },
    { id: '68be85ad094d08828def488d', name: 'Flight, barrel bag' },
    { id: '68be85ad094d08828def4890', name: 'Flight, bag' },
    { id: '68be85ad094d08828def4896', name: 'Duffy, duffel bag L' },
    { id: '68be85ad094d08828def48f9', name: 'Duffy, duffel bag M' },
    { id: '68be85ae094d08828def4a0a', name: 'Maldi - Väska i återvunnet material' },
    { id: '68be85af094d08828def4d58', name: 'CreaDraw Ocean Sailorväska med tryck' },
    { id: '68be85af094d08828def4d7d', name: 'Duff - Duffle bag 190T RPET 20L' },
    { id: '68be85af094d08828def4dd3', name: 'São Paulo M Gym Bag' },
    { id: '68be85af094d08828def4de4', name: 'São Paulo L Gym Bag' },
    { id: '68be85af094d08828def4de9', name: 'São Paulo XL Gym Bag' },
    { id: '68be85af094d08828def4ded', name: 'Seoul Gym Bag' },
    { id: '68be85af094d08828def4e34', name: 'Haney RPET sportväska' },
    { id: '68be85af094d08828def4e4c', name: 'Duffas Colour - Duffelbag 450 gr/m²' },
    { id: '68be85af094d08828def4eec', name: 'Istanbul Gym Bag' },
    { id: '68be85b0094d08828def4f58', name: 'Bolsaible + - Vattentät scubabag RPET 5L' },
    { id: '68be85b0094d08828def4fa5', name: 'Barranha RPET torrpåse' },
    { id: '68be85b0094d08828def50ea', name: 'Dorian RPET sportväska' },
    { id: '68be85b0094d08828def5121', name: 'Axelremsväska av polyester (600D) Brandon' },
    { id: '68be85b0094d08828def5127', name: 'Bangkok - Duffelbag i 600D RPET' },
    { id: '68be85b0094d08828def5163', name: 'Duffelväska i polyester (600D) Wyatt' },
    { id: '68be85b0094d08828def51a0', name: 'Duffelbag i RPET filt Savannah' },
    { id: '68be85b0094d08828def5221', name: 'SuboBag Gym sportväska med tryck' },
    { id: '68be85b0094d08828def5237', name: 'SuboBag Yoga yogamatteväska med tryck' },
    { id: '68be85b0094d08828def52b6', name: 'Sportväska i polyester Christel' },
    { id: '68be85b0094d08828def52ca', name: 'Impact AWARE RPET weekend-duffel' },
    { id: '68be85b0094d08828def52cd', name: 'Impact AWARE Urban outdoor weekendväska' },
    { id: '68be85b1094d08828def5312', name: 'Duffelväska Adventure XL (100L)' },
    { id: '68be85b1094d08828def5314', name: 'Väska i polyester (600D), Lemar' },
    { id: '68be85be094d08828def7fc2', name: 'San Jose sportväska 30L' },
    { id: '68be85be094d08828def7fc5', name: 'Retrend RPET sjömansduffelväska 35L' },
    { id: '68be85be094d08828def7fc6', name: 'Weekendväska med USB A port' },
    { id: '68be85be094d08828def7fc9', name: 'Herschel Novel återvunnen duffelväska, 43 l' },
    { id: '68be85be094d08828def7fca', name: 'Kazu AWARE RPET weekend duffelväska' },
    { id: '68be85be094d08828def7fcb', name: 'Impact Aware 285gsm ofärgad rcanvas duffelväska' },
    { id: '68be85be094d08828def7fcd', name: 'Dillon AWARE RPET hopvikbar sportväska' },
    { id: '68be85bf094d08828def8041', name: 'Aware RPET True sportväska' },
    { id: '68be85bf094d08828def8042', name: 'Herschel Classic väska av återvunnet material, 27L' },
    { id: '68be85bf094d08828def8043', name: 'Leis - Sportväska i 600D' },
    { id: '68be85bf094d08828def8044', name: 'Maldi - Väska i återvunnet material' },
    { id: '68be85bf094d08828def8045', name: 'Duff - Duffle bag 190T RPET 20L' },
    { id: '68be85bf094d08828def8046', name: 'Bolsaible - Vattentät scubabag RPET 1,5L' },
    { id: '68be85bf094d08828def8047', name: 'Bolsaible + - Vattentät scubabag RPET 5L' },
    { id: '68be85bf094d08828def80b2', name: 'Joey sportduffelväska av GRS-återvunnen canvas 25 liter' },
    { id: '68be85bf094d08828def8102', name: 'Original Barrel Bag' },
    { id: '68be85bf094d08828def8103', name: 'Packaway Barrel Bag' },
    { id: '68be85bf094d08828def8108', name: 'Sandhamn, weekendbag' },
    { id: '68be85bf094d08828def8109', name: 'Teamwear Locker Bag' },
    { id: '68be85bf094d08828def810a', name: 'Athleisure Holdall' },
    { id: '68be85bf094d08828def8113', name: 'Pro Team Locker Bag' },
    { id: '68be85bf094d08828def8114', name: 'Recycled Barrel Bag' },
    { id: '68be85bf094d08828def8115', name: 'Athleisure Sports Shoe/ Accessory Bag' },
    { id: '68be85bf094d08828def8117', name: 'Mini Barrel Bag' },
    { id: '68be85bf094d08828def811f', name: 'Sport-/resväska, in polyester (600D), Amir' },
    { id: '68be85bf094d08828def8120', name: 'Nås - Sportväska/weekend' },
    { id: '68be85bf094d08828def8128', name: 'Sportväska i polyester (600D) Lorenzo' },
    { id: '68be85bf094d08828def8130', name: 'Weekendväska Heritage Waxed Canvas' },
    { id: '68be85bf094d08828def8131', name: 'RetroSport sportväska' },
    { id: '68be85bf094d08828def8133', name: 'Weekendväska Nuhide' },
    { id: '68be85bf094d08828def8157', name: 'CreaDraw Ocean Sailorväska med tryck' },
    { id: '68be85bf094d08828def8159', name: 'Barranha RPET torrpåse' },
    { id: '68be85bf094d08828def8220', name: 'Recycled Barrel Bag' },
    { id: '68be85bf094d08828def8225', name: 'Recycled Essentials Holdall' },
    { id: '68be85bf094d08828def8249', name: 'Weekendväska NuHide' },
    { id: '68be85bf094d08828def824a', name: 'Freestyle Holdall' },
    { id: '68be85bf094d08828def824b', name: 'Vintage Canvas Weekender' },
    { id: '68be85bf094d08828def824c', name: 'Sportväska STEP' },
    { id: '68be85bf094d08828def824d', name: 'Väska/ryggsäck Schwarzwolf Brenta hopvikbar' },
    { id: '68be85bf094d08828def824e', name: 'Sportväska Vintage Canvas Barrel' },
    { id: '68be85bf094d08828def8250', name: 'Sportväska Polyester (600D) Ren' },
    { id: '68be85bf094d08828def8251', name: 'Sportväska Denim Barrel' },
    { id: '68be85bf094d08828def8252', name: 'Teamwear Jumbo Kit Bag' },
    { id: '68be85bf094d08828def8253', name: 'FIT. 600D sportväska' },
    { id: '68be85bf094d08828def8254', name: 'Recycled Essentials Holdall' },
    { id: '68be85bf094d08828def82df', name: 'BUSAN. 600D sportväska' },
    { id: '68be85bf094d08828def82e3', name: 'Equinox 80 Duffel Bag' },
    { id: '68be85bf094d08828def82e4', name: 'Equinox 30 Duffel Bag' },
    { id: '68be85bf094d08828def82e5', name: 'Kitsilano Duffel' },
    { id: '68be85bf094d08828def836a', name: 'Eastport GRS RPET Sportsbag sport- och resväska' },
    { id: '68be85bf094d08828def836b', name: 'Drybag ripstop 25L IPX6' },
    { id: '68be85bf094d08828def836e', name: 'Axelremsväska av polyester (600D) Brandon' },
    { id: '68be85bf094d08828def836f', name: 'Large Training Holdall' },
    { id: '68be85bf094d08828def8371', name: 'Adapt Hybrid Kit Bag' },
    { id: '68be85bf094d08828def8372', name: 'Small Training Holdall' },
    { id: '68be85bf094d08828def8373', name: 'Medium Training Holdall' },
    { id: '68be85bf094d08828def8374', name: 'Sportväska Flash' },
    { id: '68be85c0094d08828def8411', name: 'Duffelbag i RPET filt Savannah' },
    { id: '68be85c0094d08828def8412', name: 'Sportväska Jordan' },
    { id: '68be85c0094d08828def8413', name: 'Sportväska Workout' },
    { id: '68be85c0094d08828def8414', name: 'Sportväska Champ' },
    { id: '68be85c0094d08828def8415', name: 'Sportväska Pep' },
    { id: '68be85c0094d08828def8416', name: 'Sportväska Fitness' },
    { id: '68be85c0094d08828def8417', name: 'Duffy, duffel bag L' },
    { id: '68be85c0094d08828def841a', name: 'Sportväska i polyester Christel' },
    { id: '68be85c0094d08828def841b', name: 'Duffy, duffel bag M' },
    { id: '68be85c0094d08828def841c', name: 'São Paulo M Gym Bag' },
    { id: '68be85c0094d08828def841d', name: 'São Paulo L Gym Bag' },
    { id: '68be85c0094d08828def841e', name: 'São Paulo XL Gym Bag' },
    { id: '68be85c0094d08828def8420', name: 'Seoul Gym Bag' },
    { id: '68be85c0094d08828def8421', name: 'R-PET 600D Rolltop cykelryggsäck 20L' },
    // ... and 110 more products
  ],

  // speakers (185 products)
  'speakers': [
    { id: '68be85ad094d08828def4635', name: 'Bool - Högtalare av bambu & RPET' },
    { id: '68be85ad094d08828def490c', name: 'PEREY. ABS bärbar högtalare med mikrofon' },
    { id: '68be85af094d08828def4c53', name: 'Gauss Speaker' },
    { id: '68be85af094d08828def4d6f', name: 'RalooBeat bluetooth-högtalare' },
    { id: '68be85af094d08828def4e26', name: 'RalooBeat bluetooth-högtalare' },
    { id: '68be85b0094d08828def501d', name: 'Ralufi bluetooth-högtalare' },
    { id: '68be85b0094d08828def5132', name: 'Oblo - 5W trådlös högtalare' },
    { id: '68be85b0094d08828def5135', name: 'Toa - 5W ABS trådlös högtalare' },
    { id: '68be85b0094d08828def5153', name: 'Karaseta - 5W trådlös högtalare' },
    { id: '68be85b0094d08828def52db', name: 'Fashion Bluetooth®-högtalare i tyg' },
    { id: '68be85b0094d08828def52dc', name: 'Mini aluminium trådlös högtalare' },
    { id: '68be85b0094d08828def52dd', name: 'SCX.design S26 light-up ringhögtalare' },
    { id: '68be85b0094d08828def52df', name: 'Prixton Beat Box högtalare' },
    { id: '68be85b0094d08828def52e0', name: 'Prixton 4-i-1 Bluetooth®-högtalare på 10 W med LED-lampa och trådlös laddningsbas' },
    { id: '68be85b1094d08828def5317', name: 'Round Bass - Rund trådlös högtalare yta' },
    { id: '68be85b1094d08828def5318', name: 'Round Bamboo - Trådlös högtalare bambu' },
    { id: '68be85b1094d08828def5319', name: 'Bool - Högtalare av bambu & RPET' },
    { id: '68be85b1094d08828def531a', name: 'Toa - 5W ABS trådlös högtalare' },
    { id: '68be85b1094d08828def531b', name: 'Oblo - 5W trådlös högtalare' },
    { id: '68be85b1094d08828def536b', name: 'Bluetooth® högtalare' },
    { id: '68be85b1094d08828def536c', name: 'Fades - Bluetooth högtalare' },
    { id: '68be85b1094d08828def536d', name: 'Högtalare Bluetooth® Silikonband' },
    { id: '68be85b1094d08828def536e', name: 'Högtalare ABS 2-i-1 Renzo' },
    { id: '68be85b1094d08828def536f', name: 'T00519 | Jays S-Go Two TWS Bluetooth Speaker 5W' },
    { id: '68be85b1094d08828def53d3', name: 'M-307 | Muse 5W Bluetooth Speaker' },
    { id: '68be85b1094d08828def53d4', name: 'Gauss Speaker' },
    { id: '68be85b1094d08828def53d5', name: 'Corus' },
    { id: '68be85b1094d08828def53d6', name: 'Voxel' },
    { id: '68be85b1094d08828def53d8', name: 'Högtalare Freedom' },
    { id: '68be85b1094d08828def53db', name: 'Soundview Speaker' },
    { id: '68be85b1094d08828def53dc', name: 'Högtalare Sound Egg' },
    { id: '68be85b1094d08828def543c', name: 'Trådlös högtalare BRICK' },
    { id: '68be85b1094d08828def543d', name: 'Högtalare Ragtime' },
    { id: '68be85b1094d08828def543e', name: 'Högtalare Old School' },
    { id: '68be85b1094d08828def543f', name: 'Högtalare Pure Sound' },
    { id: '68be85b1094d08828def5440', name: 'Högtalare Cubic' },
    { id: '68be85b1094d08828def5479', name: 'Replay RABS bluetooth-högtalare' },
    { id: '68be85b1094d08828def547a', name: 'Happy Plugs | Joy Högtalare' },
    { id: '68be85b1094d08828def547b', name: 'Ralufi bluetooth-högtalare' },
    { id: '68be85b2094d08828def5648', name: 'Kooduu Sensa Play Mini bärbar högtalare och lampa från JBL' },
    { id: '68be85b2094d08828def5649', name: 'Kooduu Sensa Play bärbar högtalare och lampa från JBL' },
    { id: '68be85b2094d08828def564a', name: 'Sound - Trådlös högtalare Alu' },
    { id: '68be85b2094d08828def564b', name: 'Sound Bamboo - Trådlös högtalare' },
    { id: '68be85b2094d08828def564d', name: 'Isik - Bluetooth högtalare' },
    { id: '68be85b2094d08828def564e', name: 'VQ Retro Miniradio. Svart' },
    { id: '68be85b2094d08828def5651', name: 'Högtalare New Liberty' },
    { id: '68be85b2094d08828def5652', name: 'Högtalare Ufo' },
    { id: '68be85b2094d08828def5653', name: 'Högtalare Cuboid' },
    { id: '68be85b2094d08828def5654', name: 'M-928 | Muse arbetsradio med bluetooth 20W med FM-radio' },
    { id: '68be85b2094d08828def5655', name: 'Decibel bluetooth-högtalare' },
    { id: '68be85b2094d08828def565f', name: 'M-780 | Muse Bluetooth-högtalare 20W' },
    { id: '68be85b2094d08828def5660', name: 'Högtalare Shower Power' },
    { id: '68be85b2094d08828def5675', name: 'Mushroom - Trådlös högtalare' },
    { id: '68be85b2094d08828def5677', name: 'Decibel bluetooth-högtalare' },
    { id: '68be85b2094d08828def5678', name: 'Abyss stänksäker bluetooth-högtalare' },
    { id: '68be85b2094d08828def569c', name: 'Bluetooth® högtalare' },
    { id: '68be85b2094d08828def569d', name: 'Högtalare Bluetooth®  Space' },
    { id: '68be85b2094d08828def569f', name: 'Decibel bluetooth-högtalare' },
    { id: '68be85b2094d08828def56c0', name: 'M-360 | Muse Bärbar Bluetooth högtalare 5W' },
    { id: '68be85b2094d08828def56c1', name: 'Abyss stänksäker bluetooth-högtalare' },
    { id: '68be85c0094d08828def8790', name: 'Xoopar OctopusFly ljudsändare' },
    { id: '68be85c9094d08828defa7a5', name: 'Högtalare Resistant' },
    { id: '68be85c9094d08828defa7a6', name: 'Högtalare Wake Up' },
    { id: '68be85c9094d08828defa7e4', name: 'Sinox Sonitus Glow Speaker. Svart' },
    { id: '68be85c9094d08828defa7e5', name: 'Swayers AquaBeat' },
    { id: '68be85c9094d08828defa7e6', name: 'Sinox Sonitus Tube högtalare. Svart' },
    { id: '68be85c9094d08828defa7e7', name: 'Sinox Sonitus Split högtalare. Svart' },
    { id: '68be85c9094d08828defa7e8', name: 'Sinox Sonitus Rock högtalare. Svart' },
    { id: '68be85c9094d08828defa7e9', name: 'Trendig högtalare från Swayer' },
    { id: '68be85c9094d08828defa7ea', name: 'Sinox Sonitus Travel40 högtalare. Svart' },
    { id: '68be85c9094d08828defa7eb', name: 'Sinox Sonitus Rock högtalare. Grå' },
    { id: '68be85c9094d08828defa7ec', name: 'Sinox Sonitus Travel30 högtalare. Svart' },
    { id: '68be85c9094d08828defa7ed', name: 'Sinox Sonitus Boom högtalare. Svart' },
    { id: '68be85c9094d08828defa7ef', name: 'Högtalare Meshes' },
    { id: '68be85c9094d08828defa7f0', name: 'Högtalare Recevier' },
    { id: '68be85c9094d08828defa7f1', name: 'Högtalare Travel Sound' },
    { id: '68be85c9094d08828defa7f2', name: 'Högtalare Diner' },
    { id: '68be85c9094d08828defa7f3', name: 'Högtalare Classic' },
    { id: '68be85c9094d08828defa7f5', name: 'Halo Portable Bluetooth Speaker 16W' },
    { id: '68be85c9094d08828defa7f6', name: 'Högtalare Choir' },
    { id: '68be85c9094d08828defa7f7', name: 'Högtalare Firefly' },
    { id: '68be85c9094d08828defa7f8', name: 'Högtalare Wonder Ball Mini' },
    { id: '68be85c9094d08828defa7fa', name: 'Wave Bamboo Wireless Speaker trådlös högtalare' },
    { id: '68be85ca094d08828defa94d', name: 'AluSound  RCS Recycled Aluminium Speaker' },
    { id: '68be85ca094d08828defa94e', name: 'Högtalare Change' },
    { id: '68be85ca094d08828defa94f', name: 'Bambu Sound' },
    { id: '68be85ca094d08828defa9b0', name: 'Högtalare Bam' },
    { id: '68be85ca094d08828defa9b1', name: 'Högtalare Mega Boom' },
    { id: '68be85ca094d08828defa9b3', name: 'Högtalare Boom Alien' },
    { id: '68be85ca094d08828defa9b4', name: 'Trådlös bilhögtalare' },
    { id: '68be85ca094d08828defa9b6', name: 'Sonido 5W Bamboo Wireless Speaker trådlös högtalare' },
    { id: '68be85ca094d08828defa9b8', name: 'Mikrofon' },
    { id: '68be85ca094d08828defa9b9', name: 'Trådlös Högtalare Oldie' },
    { id: '68be85ca094d08828defa9bb', name: 'Högtalare MrBoombastic' },
    { id: '68be85ca094d08828defaa02', name: 'ABS utomhushögtalare Madison' },
    { id: '68be85ca094d08828defaa1f', name: 'Suono RCS Recycled ABS Wireless Speaker' },
    { id: '68be85ca094d08828defaa23', name: 'Bambox Bamboo Speaker högtalare' },
    { id: '68be85ca094d08828defaa24', name: 'Wave Bamboo Wireless Speaker' },
    { id: '68be85ca094d08828defab09', name: 'Timor Bamboo Wireless Speaker' },
    { id: '68be85ca094d08828defab0a', name: 'PowerBox Bamboo gåvoset' },
    // ... and 85 more products
  ],

  // sommarprodukter (183 products)
  'sommarprodukter': [
    { id: '68be85ad094d08828def4844', name: 'Petani' },
    { id: '68be85ad094d08828def4907', name: 'RILEY II. EPE-fodrad picknickfilt (180 g/m²)' },
    { id: '68be85ae094d08828def4999', name: 'ALDAN. Strandhink i PP' },
    { id: '68be85ae094d08828def4a13', name: 'Pacam - Picknickpläd hopvikbar' },
    { id: '68be85ae094d08828def4ace', name: 'Bapper Solfjäder' },
    { id: '68be85af094d08828def4c72', name: 'GRADY. Vikbar picknickfilt i rPET och PEVA' },
    { id: '68be85af094d08828def4c94', name: 'Gamasa Solfjäder' },
    { id: '68be85af094d08828def4d83', name: 'Kolam - Badtoffla stl. 46/47' },
    { id: '68be85b0094d08828def4fd9', name: 'Amalfi handfläkt' },
    { id: '68be85b0094d08828def505b', name: 'Solfjäder i bambu Elio' },
    { id: '68be85b0094d08828def5279', name: 'DHS Lotus Lykta' },
    { id: '68be85b2094d08828def570b', name: 'Manuela solfjäder' },
    { id: '68be85b2094d08828def570c', name: 'Zenith strandparaply' },
    { id: '68be85b2094d08828def570d', name: 'Suncare - 30 ml solkräm lotion' },
    { id: '68be85b2094d08828def570e', name: 'Siesta - Strandkudde' },
    { id: '68be85b2094d08828def570f', name: 'Parasun - Solskydds paraply' },
    { id: '68be85b2094d08828def5710', name: 'Kolam - Badtoffla stl. 40/41' },
    { id: '68be85b2094d08828def5711', name: 'Softybag - Chair small' },
    { id: '68be85b2094d08828def5712', name: 'Softybag - Chair' },
    { id: '68be85b2094d08828def5713', name: 'Softybag - Pallet' },
    { id: '68be85b2094d08828def5714', name: 'DHS Lotus Lykta' },
    { id: '68be85b2094d08828def5715', name: 'Easygo - Utomhus stol' },
    { id: '68be85b2094d08828def5716', name: 'Honopu - Strandstol i trä' },
    { id: '68be85b2094d08828def5717', name: 'Softybag Original' },
    { id: '68be85b2094d08828def5718', name: 'Vikbar Solstol Sunny Beach' },
    { id: '68be85b2094d08828def5719', name: 'Campingstol Sunnyday' },
    { id: '68be85b2094d08828def571a', name: 'Strandstol Chill Out' },
    { id: '68be85b2094d08828def571c', name: 'Picknickpläd Picnic' },
    { id: '68be85b2094d08828def571d', name: 'Picknickpläd Rutan' },
    { id: '68be85b2094d08828def571f', name: 'Impact Aware RPET hopvikbar quiltad picknickfilt' },
    { id: '68be85b2094d08828def5723', name: 'VINGA Volonne AWARE återvunnen canvas picknickpläd' },
    { id: '68be85b2094d08828def5725', name: 'Goodtimes - Picknick filt' },
    { id: '68be85b2094d08828def5726', name: 'Pacam - Picknickpläd hopvikbar' },
    { id: '68be85b2094d08828def5728', name: 'Picknickpläd' },
    { id: '68be85b2094d08828def5729', name: 'Picknickpläd' },
    { id: '68be85b2094d08828def572a', name: 'Vikbar kylväska och picknickmatta' },
    { id: '68be85b2094d08828def572b', name: 'RILEY II. EPE-fodrad picknickfilt (180 g/m²)' },
    { id: '68be85b2094d08828def5738', name: 'Pocket' },
    { id: '68be85b2094d08828def5739', name: 'Horizon' },
    { id: '68be85b2094d08828def573b', name: 'Aquatime - Uppblåsbar badboll' },
    { id: '68be85b2094d08828def573c', name: 'Playtime - Uppblåsbar badboll' },
    { id: '68be85b2094d08828def5740', name: 'BeachBall Ø 27 cm badboll' },
    { id: '68be85b2094d08828def5741', name: 'BeachBall Ø 30 cm badboll' },
    { id: '68be85b2094d08828def5742', name: 'Strand - Badboll - Ø 26 cm' },
    { id: '68be85b2094d08828def5743', name: 'BeachBall Ø 24 cm badboll' },
    { id: '68be85b2094d08828def5744', name: 'CRUISE. Uppblåsbar strandboll i PVC' },
    { id: '68be85b2094d08828def5745', name: 'PECONIC. Uppblåsbar badboll i genomskinlig PVC' },
    { id: '68be85b2094d08828def5746', name: 'Playo badboll (ø28 cm)' },
    { id: '68be85b2094d08828def5747', name: 'Byron badboll (ø28 cm)' },
    { id: '68be85b2094d08828def5748', name: 'Mindil badboll (ø40 cm)' },
    { id: '68be85b2094d08828def5749', name: 'Waikiki badboll (ø23 cm)' },
    { id: '68be85b2094d08828def574a', name: 'Petani' },
    { id: '68be85b2094d08828def5755', name: 'Picknickfilt' },
    { id: '68be85b2094d08828def5756', name: 'Kolam - Badtoffla stl. 44/45' },
    { id: '68be85b2094d08828def5757', name: 'Kolam - Badtoffla stl. 42/43' },
    { id: '68be85b2094d08828def5758', name: 'Kolam - Badtoffla stl. 36/37' },
    { id: '68be85b2094d08828def5759', name: 'Kolam - Badtoffla stl. 38/39' },
    { id: '68be85b2094d08828def575d', name: 'Vacki - Strandmadrass - stl. 180 x 60 cm' },
    { id: '68be85b2094d08828def575f', name: 'Solskyddslotion Suntime' },
    { id: '68be85b2094d08828def5760', name: 'Sunscreen Spray HookUp SPF 30' },
    { id: '68be85b2094d08828def5761', name: 'Solskydd Spring SPF30 20ml' },
    { id: '68be85b2094d08828def5762', name: 'Plyva - Luftmadrass - stl. 173 x 66' },
    { id: '68be85b2094d08828def5764', name: 'ERIC. Solskyddsmedel med SPF30' },
    { id: '68be85b2094d08828def5765', name: 'DERING. 170T parasoll' },
    { id: '68be85b2094d08828def5766', name: 'TIMOR. Ogenomskinlig PVC uppblåsbar strandkudde' },
    { id: '68be85b2094d08828def576c', name: 'Solfjäder i bambu Elio' },
    { id: '68be85b2094d08828def576d', name: 'Parasoll M' },
    { id: '68be85b2094d08828def576f', name: 'Parasoll XL' },
    { id: '68be85b2094d08828def5771', name: 'Solfjäder Cool Rpet' },
    { id: '68be85b2094d08828def5772', name: 'Handfläkt trä & R-PET' },
    { id: '68be85b2094d08828def5773', name: 'Hopfällbar handfläkt mini' },
    { id: '68be85b2094d08828def5775', name: 'Solfjäder Bamboo Cool' },
    { id: '68be85b2094d08828def5776', name: 'Solfjäder' },
    { id: '68be85b2094d08828def5777', name: 'ALDAN. Strandhink i PP' },
    { id: '68be85b2094d08828def5779', name: 'Kylhandduk Chilling' },
    { id: '68be85b2094d08828def5782', name: 'Vasto Solfjäder' },
    { id: '68be85b2094d08828def5783', name: 'Digibreeze Eco Solfjäder med tryck' },
    { id: '68be85b2094d08828def5784', name: 'Kuramo strandparaply' },
    { id: '68be85b2094d08828def5785', name: 'Digibreeze specialtillverkad solfjäder' },
    { id: '68be85b2094d08828def5786', name: 'Malibu strandtofflor' },
    { id: '68be85b2094d08828def5787', name: 'Cerros strandkudde' },
    { id: '68be85b2094d08828def5788', name: 'Sunshine strandkudde' },
    { id: '68be85b2094d08828def5789', name: 'Henley strandmadrass' },
    { id: '68be85b2094d08828def578a', name: 'Aldinga strandmadrass' },
    { id: '68be85b2094d08828def578b', name: 'Suntox solskyddslotion' },
    { id: '68be85b2094d08828def578c', name: 'CreaPlaya skräddarsydda strandtofflor - sula' },
    { id: '68be85b2094d08828def578d', name: 'Boracay strandtofflor' },
    { id: '68be85b2094d08828def578e', name: 'Bapper Solfjäder' },
    { id: '68be85b2094d08828def578f', name: 'Gamasa Solfjäder' },
    { id: '68be85b2094d08828def5790', name: 'Amalfi handfläkt' },
    { id: '68be85b9094d08828def6cdf', name: 'Softybag - Pallet' },
    { id: '68be85bc094d08828def7924', name: 'Parasoll M' },
    { id: '68be85bc094d08828def7926', name: 'Parasoll L' },
    { id: '68be85bc094d08828def7928', name: 'Parasoll XL' },
    { id: '68be85be094d08828def7d62', name: 'Softybag - Chair' },
    { id: '68be85be094d08828def7d67', name: 'Softybag - With Cover' },
    { id: '68be85c3094d08828def90f4', name: 'Suboslip Strandtofflor' },
    { id: '68be85c3094d08828def90f8', name: 'Standtält' },
    { id: '68be85c3094d08828def90f9', name: 'BeachSmash strandspel' },
    { id: '68be85c3094d08828def90fa', name: 'Solfjäder Geo Cool' },
    // ... and 83 more products
  ],

  // pens (183 products)
  'pens': [
    { id: '68be85c4094d08828def955e', name: 'Kulpenna PAPER MATE Inkjoy 100 Cap 1,0 r' },
    { id: '68be85c4094d08828def9560', name: 'Kulpenna PAPER MATE Inkjoy 100 Cap 1,0 s' },
    { id: '68be85c4094d08828def9564', name: 'Kulpenna PAPER MATE Inkjoy 100 Cap 1,0 b' },
    { id: '68be85c4094d08828def9568', name: 'Märkpenna ARTLINE Postermarker 2mm' },
    { id: '68be85c4094d08828def956e', name: 'Märkpenna ARTLINE Postermarker 2mm' },
    { id: '68be85c4094d08828def956f', name: 'Märkpenna ARTLINE Postermarker 2mm' },
    { id: '68be85c4094d08828def9570', name: 'Märkpenna ARTLINE Postermarker 2mm' },
    { id: '68be85c4094d08828def9575', name: 'Märkpenna ARTLINE Postermarker 2mm' },
    { id: '68be85c4094d08828def9580', name: 'Märkpenna ARTLINE Postermarker 4mm vit' },
    { id: '68be85c4094d08828def9686', name: 'Kulpenna PAPER MATE FlexGrip Cap 1,0 blå' },
    { id: '68be85c4094d08828def96c1', name: 'Märkpenna ARTLINE glastavla 2mm ljusgrön' },
    { id: '68be85c5094d08828def9758', name: 'Reservstift Begreen 0,7mm HB 12stift/fp' },
    { id: '68be85c5094d08828def975a', name: 'Reservstift LYRECO 0,7mm HB 12/fp' },
    { id: '68be85c5094d08828def9768', name: 'Reservstift Color ENO 6/fp' },
    { id: '68be85c5094d08828def9784', name: 'Refill PILOT Frixion Syner 0,5 viol 3/fp' },
    { id: '68be85c5094d08828def9787', name: 'Refill PILOT G2 0,5mm röd' },
    { id: '68be85c5094d08828def9789', name: 'Refill PILOT Super Grip G Cap fine' },
    { id: '68be85c5094d08828def978a', name: 'Refill PILOT Super Grip G Cap fine' },
    { id: '68be85c5094d08828def978b', name: 'Refill PILOT Acroball Fine' },
    { id: '68be85c5094d08828def978d', name: 'Refill PILOT Synergy Point' },
    { id: '68be85c5094d08828def978f', name: 'Refill PILOT Acroball Fine' },
    { id: '68be85c5094d08828def9790', name: 'Refill BIC ReAction gel 2/fp' },
    { id: '68be85c5094d08828def9792', name: 'Refill PILOT Frixion 0,7mm 3/fp' },
    { id: '68be85c5094d08828def9794', name: 'Refill PILOT Acroball Fine' },
    { id: '68be85c5094d08828def9797', name: 'Refill PILOT Synergy Point' },
    { id: '68be85c5094d08828def979a', name: 'Refill PILOT Frixion 0,7mm 3/fp' },
    { id: '68be85c5094d08828def979b', name: 'Refill PILOT Frixion 0,7mm 3/fp' },
    { id: '68be85c5094d08828def979d', name: 'Refill PILOT Frixion 0,7mm 4 färger 6/fp' },
    { id: '68be85c5094d08828def97b0', name: 'Korr.roller refill PILOT BeGreen 4mmx6m' },
    { id: '68be85c5094d08828def97e2', name: 'Refill EDDING HTK 25 ink 25 ml' },
    { id: '68be85c5094d08828def97e4', name: 'Refill EDDING HTK 25 25 ml' },
    { id: '68be85c5094d08828def97e5', name: 'Refill EDDING HTK 25 ink 25 ml' },
    { id: '68be85c5094d08828def97e6', name: 'Refill EDDING HTK 25 ink 25 ml' },
    { id: '68be85c5094d08828def97e7', name: 'Refill EDDING HTK 25 25 ml' },
    { id: '68be85c5094d08828def97ed', name: 'Refill LUMOCOLOR universal P svart' },
    { id: '68be85c5094d08828def97fd', name: 'Refill STABILO Boss Original gul' },
    { id: '68be85c5094d08828def987d', name: 'Märkkrita ARTLINE 40 Paint Cray rund' },
    { id: '68be85c5094d08828def98c0', name: 'Fineliner STABILO Point 88' },
    { id: '68be85c5094d08828def98c1', name: 'Fineliner STABILO Point 88' },
    { id: '68be85c5094d08828def98c2', name: 'Fineliner STABILO Sensor 0,3mm' },
    { id: '68be85c5094d08828def98c3', name: 'Fineliner STAEDTLER 0,3mm svart' },
    { id: '68be85c5094d08828def98c4', name: 'Fineliner STABILO Point 88' },
    { id: '68be85c5094d08828def98c6', name: 'Fineliner STABILO Point 88' },
    { id: '68be85c5094d08828def98c9', name: 'Fineliner PILOT' },
    { id: '68be85c5094d08828def9948', name: 'Refill PILOT Super Grip G Cap medium blå' },
    { id: '68be85c5094d08828def994c', name: 'Refill PILOT Frixion 0,7mm 4 färger 6/fp' },
    { id: '68be85c5094d08828def9950', name: 'Refill UNI Powertank ECO' },
    { id: '68be85c5094d08828def9951', name: 'Refill UNIBALL UMR-87 Signo 207' },
    { id: '68be85c5094d08828def9953', name: 'Refill PILOT Acroball' },
    { id: '68be85c5094d08828def9954', name: 'Refill WB PILOT V Board EF UF blå' },
    { id: '68be85c5094d08828def9955', name: 'Refill PILOT Acroball' },
    { id: '68be85c5094d08828def9956', name: 'Refill PILOT Frixion 0,7mm 3/fp' },
    { id: '68be85c5094d08828def9958', name: 'Refill PILOT Frixion Syner 3/fp' },
    { id: '68be85c5094d08828def9959', name: 'Refill PILOT Frixion 0,5mm 3/fp' },
    { id: '68be85c5094d08828def995b', name: 'Refill PILOT Frixion 0,5mm 3/fp' },
    { id: '68be85c5094d08828def995c', name: 'Refill PILOT Frixion 0,5mm 3/fp' },
    { id: '68be85c5094d08828def995e', name: 'Refill PILOT Frixion 0,5mm 3/fp' },
    { id: '68be85c5094d08828def995f', name: 'Refill PILOT Frixion Syner 3/fp' },
    { id: '68be85c5094d08828def9960', name: 'Refill PILOT Frixion 0,5mm 3/fp' },
    { id: '68be85c5094d08828def9961', name: 'Refill PILOT Frixion zone 0,7mm blå' },
    { id: '68be85c5094d08828def9962', name: 'Refill PILOT Frixion 0,7mm 3/fp' },
    { id: '68be85c5094d08828def9963', name: 'Refill PILOT V-ball RT 0,5mm blå' },
    { id: '68be85c5094d08828def9964', name: 'Refill BIC ReAction gel 2/fp' },
    { id: '68be85c5094d08828def9965', name: 'Refill PILOT Frixion 0,5mm 3/fp' },
    { id: '68be85c5094d08828def9966', name: 'Refill UNIBALL UMR-87 Signo 207' },
    { id: '68be85c5094d08828def9967', name: 'Refill PILOT Frixion 0,7mm 3/fp' },
    { id: '68be85c5094d08828def9968', name: 'Refill PILOT Frixion 0,5mm 3/fp' },
    { id: '68be85c5094d08828def9969', name: 'Refill PILOT Frixion Zone 0,7 Svart' },
    { id: '68be85c5094d08828def996a', name: 'Refill PILOT Frixion 0,7mm 3/fp' },
    { id: '68be85c5094d08828def996b', name: 'Refill PILOT Frixion Syner 3/fp' },
    { id: '68be85c5094d08828def996d', name: 'Refill PILOT V Super Colo' },
    { id: '68be85c5094d08828def996f', name: 'Reservstift Color ENO 6/fp' },
    { id: '68be85c5094d08828def9970', name: 'Reservstift Color ENO 6/fp' },
    { id: '68be85c5094d08828def9972', name: 'Reservstift Color ENO 6/fp' },
    { id: '68be85c5094d08828def9973', name: 'Reservstift Color ENO 6/fp' },
    { id: '68be85c5094d08828def9976', name: 'Reservstift STAEDTLER 0,7mm H 12/fp' },
    { id: '68be85c5094d08828def9977', name: 'Reservstift 0,7mm HB 12/fp' },
    { id: '68be85c5094d08828def9978', name: 'Reservstift Color ENO 6/fp' },
    { id: '68be85c5094d08828def997a', name: 'Reservstift STAEDTLER 0,9mm HB 12/fp' },
    { id: '68be85c5094d08828def997b', name: 'Reservstift LYRECO 0,5mm HB 12/fp' },
    { id: '68be85c5094d08828def997c', name: 'Reservstift Color ENO 6/fp' },
    { id: '68be85c5094d08828def9981', name: 'Reservstift Color ENO 6/fp' },
    { id: '68be85c5094d08828def9984', name: 'Reservstift ENO G HB 12/fp' },
    { id: '68be85c5094d08828def998e', name: 'Reservstift STAEDTLER 0,7mm 2H 12/fp' },
    { id: '68be85c5094d08828def998f', name: 'Reservstift STAEDTLER 0,5mm B 12/fp' },
    { id: '68be85c5094d08828def999a', name: 'Reservstift 0,5mm HB 12stift/fp' },
    { id: '68be85c5094d08828def999e', name: 'Reservstift STAEDTLER 0,5mm H 12/fp' },
    { id: '68be85c5094d08828def999f', name: 'Reservstift STAEDTLER 0,5mm 2H 12/fp' },
    { id: '68be85c5094d08828def99c2', name: 'Refill STAEDTLER 6/fp' },
    { id: '68be85c5094d08828def99c6', name: 'Refill STAEDTLER 6/fp' },
    { id: '68be85c5094d08828def9a35', name: 'Märkkrita ARTLINE 40 Paint Cray rund' },
    { id: '68be85c5094d08828def9a37', name: 'Fineliner ARTLINE EK234 0,4mm svart' },
    { id: '68be85c5094d08828def9a39', name: 'Fineliner STABILO Point 88' },
    { id: '68be85c5094d08828def9a3a', name: 'Fineliner PILOT' },
    { id: '68be85c5094d08828def9a3c', name: 'Fineliner ARTLINE EK237 0,7mm svart' },
    { id: '68be85c5094d08828def9a3d', name: 'Fineliner STABILO Sensor 0,3mm' },
    { id: '68be85c5094d08828def9a3e', name: 'Fineliner ARTLINE EK231 0,1mm svart' },
    { id: '68be85c5094d08828def9a40', name: 'Fineliner STABILO Point 88' },
    { id: '68be85c5094d08828def9a41', name: 'Fineliner STABILO Sensor 0,3mm' },
    { id: '68be85c5094d08828def9a42', name: 'Fineliner STABILO Point 88' },
    // ... and 83 more products
  ],

  // travel-bags (161 products)
  'travel-bags': [
    { id: '68be85ad094d08828def474c', name: 'Köpenhamn, resväska M' },
    { id: '68be85ad094d08828def474d', name: 'Köpenhamn, resväska S' },
    { id: '68be85ad094d08828def474e', name: 'Köpenhamn, resväska L' },
    { id: '68be85ad094d08828def474f', name: 'Köpenhamn, resväska 3­set' },
    { id: '68be85ad094d08828def4755', name: 'Florens, weekendbag' },
    { id: '68be85ad094d08828def475e', name: 'Birmingham, resväska' },
    { id: '68be85ad094d08828def4763', name: 'Reykjavik, weekendbag' },
    { id: '68be85ad094d08828def4764', name: 'Vintage, kabinväska 55 cm' },
    { id: '68be85ad094d08828def4765', name: 'Vintage, resväska 68 cm' },
    { id: '68be85ad094d08828def4801', name: 'BGO, kabinväska 55 cm' },
    { id: '68be85ad094d08828def4802', name: 'Vintage, resväska 77 cm' },
    { id: '68be85ad094d08828def4805', name: 'OSL, resväska 77 cm' },
    { id: '68be85ad094d08828def4808', name: 'OSL, resväska 67 cm' },
    { id: '68be85ad094d08828def480e', name: 'BGO, resväska 77 cm' },
    { id: '68be85ad094d08828def4810', name: 'Birmingham, 2­set' },
    { id: '68be85ad094d08828def4819', name: 'OSL, resväska 3 pcs' },
    { id: '68be85ad094d08828def481b', name: 'BGO, resväska 67 cm' },
    { id: '68be85ad094d08828def4839', name: 'Motion Bag. resepåse i katjonisk 600D och polypropen' },
    { id: '68be85ad094d08828def4884', name: 'Superb, resväska 66 cm' },
    { id: '68be85ad094d08828def4887', name: 'BGO, resväska 3 pcs set' },
    { id: '68be85ad094d08828def4889', name: 'House of Sajaco, weekendbag' },
    { id: '68be85ad094d08828def4892', name: 'Superb, resväska 75 cm' },
    { id: '68be85ad094d08828def4898', name: 'Superb, resväska 3 pcs set' },
    { id: '68be85ad094d08828def489a', name: 'Escape, weekendbag Dull rubber PU' },
    { id: '68be85ad094d08828def489d', name: 'Escape, weekendbag Bergen' },
    { id: '68be85ae094d08828def4966', name: 'Sinn - Väska i återvunnen bomull' },
    { id: '68be85ae094d08828def4ad0', name: 'BagSort S anpassad organisatör' },
    { id: '68be85af094d08828def4bc3', name: 'BagSort M anpassad organisatör' },
    { id: '68be85af094d08828def4bc4', name: 'BagSort L anpassad organisatör' },
    { id: '68be85b0094d08828def501a', name: 'Rebyss Travel resväska i återvunnen bomull' },
    { id: '68be85b0094d08828def5142', name: 'Vikbar duffelväska rPET (210D) José' },
    { id: '68be85b0094d08828def5148', name: 'Resväska i RPET filt Natalie' },
    { id: '68be85b0094d08828def5156', name: 'Resväska i RPET filt Natalie' },
    { id: '68be85b0094d08828def52bf', name: 'Köpenhamn, resväska L' },
    { id: '68be85b0094d08828def52c8', name: 'Retrend RPET duffelväska 40L' },
    { id: '68be85b0094d08828def52cf', name: 'Armond AWARE RPET weekend-duffel' },
    { id: '68be85b0094d08828def52d1', name: 'Bellroy Lite duffelväska' },
    { id: '68be85b0094d08828def52d4', name: 'Sinn - Väska i återvunnen bomull' },
    { id: '68be85b1094d08828def52f6', name: 'Vintage, resväska 77 cm' },
    { id: '68be85b1094d08828def52f8', name: 'OSL, resväska 77 cm' },
    { id: '68be85b1094d08828def530a', name: 'Köpenhamn, resväska M' },
    { id: '68be85b1094d08828def530b', name: 'Köpenhamn, resväska S' },
    { id: '68be85b1094d08828def530c', name: 'Köpenhamn, resväska 3­set' },
    { id: '68be85b1094d08828def530d', name: 'Köpenhamn, resväska L' },
    { id: '68be85b1094d08828def530e', name: 'Nomad Duffle bag' },
    { id: '68be85b1094d08828def530f', name: 'MMV Luton Weekendväska' },
    { id: '68be85b1094d08828def5313', name: 'Madagascar Duffel Pack' },
    { id: '68be85b1094d08828def5324', name: 'Birmingham, 2­set' },
    { id: '68be85b1094d08828def5349', name: 'MMV Väska Varese Overnighter' },
    { id: '68be85b1094d08828def534a', name: 'Resväska återvunnen canvas' },
    { id: '68be85b1094d08828def534b', name: 'Birmingham, resväska' },
    { id: '68be85b1094d08828def5390', name: 'Reykjavik, weekendbag' },
    { id: '68be85b1094d08828def5391', name: 'Vintage, resväska 68 cm' },
    { id: '68be85b1094d08828def5392', name: 'Vintage, kabinväska 55 cm' },
    { id: '68be85b1094d08828def5393', name: 'BGO, kabinväska 55 cm' },
    { id: '68be85b1094d08828def5394', name: 'Tinka - Sportväska/weekend' },
    { id: '68be85b1094d08828def5395', name: 'Vikbar duffelväska rPET (210D) José' },
    { id: '68be85b1094d08828def5396', name: 'OSL, resväska 77 cm' },
    { id: '68be85b1094d08828def5397', name: 'OSL, resväska 67 cm' },
    { id: '68be85b1094d08828def5398', name: 'BGO, resväska 77 cm' },
    { id: '68be85b1094d08828def5399', name: 'House of Sajaco, weekendbag' },
    { id: '68be85b1094d08828def53ca', name: 'Lennon RCS Recycled Sports-/Travelbag' },
    { id: '68be85b1094d08828def53cb', name: 'Superb, resväska 3 pcs set' },
    { id: '68be85b1094d08828def53cc', name: 'Escape, weekendbag Dull rubber PU' },
    { id: '68be85b1094d08828def53cd', name: 'Weekendväska med hjul Hex' },
    { id: '68be85b1094d08828def53ce', name: 'Resväska 9P' },
    { id: '68be85b1094d08828def53fd', name: 'BagSort M anpassad organisatör' },
    { id: '68be85b1094d08828def53fe', name: 'Rebyss Travel resväska i återvunnen bomull' },
    { id: '68be85be094d08828def7ee7', name: 'BagSort S anpassad organisatör' },
    { id: '68be85be094d08828def7ee8', name: 'BagSort L anpassad organisatör' },
    { id: '68be85be094d08828def7fcc', name: 'Armond AWARE RPET weekend-duffel' },
    { id: '68be85bf094d08828def7fe7', name: 'MMV Väska Luton Overnighter' },
    { id: '68be85bf094d08828def7fea', name: 'MMV Väska Varese Onenighter' },
    { id: '68be85bf094d08828def8071', name: 'Köpenhamn, resväska M' },
    { id: '68be85bf094d08828def8072', name: 'Köpenhamn, resväska S' },
    { id: '68be85bf094d08828def8073', name: 'Köpenhamn, resväska 3­set' },
    { id: '68be85bf094d08828def808d', name: 'Canvas rese/weekendväska, PVC-fri' },
    { id: '68be85bf094d08828def808e', name: 'Urban vattenresistent Weekendväska' },
    { id: '68be85bf094d08828def8090', name: 'Kezar AWARE 500 gsm weekend-väska i återvunnen canvas' },
    { id: '68be85bf094d08828def8093', name: 'Bellroy Lite duffelväska' },
    { id: '68be85bf094d08828def8097', name: 'Sinn - Väska i återvunnen bomull' },
    { id: '68be85bf094d08828def80b5', name: 'Impact AWARE RPET modern sport duffle' },
    { id: '68be85bf094d08828def810c', name: 'Nomad Duffle bag' },
    { id: '68be85bf094d08828def812a', name: 'Madagascar Duffel Pack' },
    { id: '68be85bf094d08828def8139', name: 'OSL, resväska 77 cm' },
    { id: '68be85bf094d08828def815a', name: 'Köpenhamn, resväska S' },
    { id: '68be85bf094d08828def815b', name: 'Köpenhamn, resväska 3­set' },
    { id: '68be85bf094d08828def815c', name: 'Florens, weekendbag' },
    { id: '68be85bf094d08828def82bf', name: 'Vintage, resväska 77 cm' },
    { id: '68be85bf094d08828def82c0', name: 'Tinka - Sportväska/weekend' },
    { id: '68be85bf094d08828def82c1', name: 'Vikbar duffelväska rPET (210D) José' },
    { id: '68be85bf094d08828def82c2', name: 'OSL, resväska 67 cm' },
    { id: '68be85bf094d08828def82c3', name: 'OSL, resväska 3 pcs' },
    { id: '68be85bf094d08828def82c4', name: 'BGO, resväska 67 cm' },
    { id: '68be85bf094d08828def82c5', name: 'BGO, resväska 3 pcs set' },
    { id: '68be85bf094d08828def8349', name: 'Recycled cotton canvas weekend bag Harper' },
    { id: '68be85bf094d08828def834a', name: 'Resväska 9P' },
    { id: '68be85c0094d08828def841f', name: 'InSideOut R-PET duffelväska Koli' },
    { id: '68be85c0094d08828def8613', name: 'Nomad Duffle bag' },
    { id: '68be85c0094d08828def86b3', name: 'Madagascar Duffel Pack' },
    // ... and 61 more products
  ],

  // vin-bar (159 products)
  'vin-bar': [
    { id: '68be85ae094d08828def4a11', name: 'Feltster - Drickunderlägg av RPET-filt' },
    { id: '68be85af094d08828def4c68', name: 'FUNFAYE. Underlägg med flasköppnare' },
    { id: '68be85af094d08828def4d7b', name: 'Starguard - Drickunderlägg i RPET filt' },
    { id: '68be85b0094d08828def50d9', name: 'Hefe Underlägg av RPET-filt' },
    { id: '68be85b0094d08828def5102', name: 'Posa - Runt underlägg i PU' },
    { id: '68be85b0094d08828def51fb', name: 'VinoPrint RPET-kylare för vinflaskor' },
    { id: '68be85b0094d08828def520f', name: 'Apulia champagnekork' },
    { id: '68be85b0094d08828def521b', name: 'CreaFelt Drink Plus RPET filtunderlägg, fyrkantigt' },
    { id: '68be85b2094d08828def5542', name: 'Sip sugrörsöverdrag i silikon' },
    { id: '68be85b2094d08828def5544', name: 'Chill anpassningsbar iskubsbricka' },
    { id: '68be85b2094d08828def554a', name: 'Kylare Flask / burk kylare i neopren (smart)' },
    { id: '68be85b2094d08828def554b', name: 'Kylare Flask / burk kylare i neopren (rund)' },
    { id: '68be85b2094d08828def554c', name: 'Kylare Flask kylare i neopren (t-shirt)' },
    { id: '68be85b2094d08828def5568', name: 'Renzo fyrkantig underlägg i plast' },
    { id: '68be85b2094d08828def5569', name: 'Starguard - Drickunderlägg i RPET filt' },
    { id: '68be85b2094d08828def556a', name: 'Posa - Runt underlägg i PU' },
    { id: '68be85b2094d08828def556b', name: 'Coaster Opener flasköppnare' },
    { id: '68be85b2094d08828def5591', name: 'Riko - Sugrör' },
    { id: '68be85b2094d08828def5594', name: 'Sip sugrörsöverdrag i silikon' },
    { id: '68be85b2094d08828def55c3', name: 'Underlägg i Polyester' },
    { id: '68be85b2094d08828def55c4', name: 'Underlägg i Polyester och Silikon' },
    { id: '68be85b2094d08828def55c5', name: 'CreaPint Pappersunderlägg, fyrkantigt' },
    { id: '68be85b2094d08828def55ce', name: 'Ishink med Aluminiumöppnare' },
    { id: '68be85b2094d08828def55fc', name: 'HipFlask 200 ml fickplunta' },
    { id: '68be85b2094d08828def55fd', name: 'Höftflaska 175 ml' },
    { id: '68be85b2094d08828def5600', name: 'Silikonkork' },
    { id: '68be85b2094d08828def5612', name: 'CreaCoast Underlägg' },
    { id: '68be85b2094d08828def5613', name: 'CreaFelt Drink Plus RPET filtunderlägg, fyrkantigt' },
    { id: '68be85b2094d08828def561a', name: 'VinoPrint RPET-kylare för vinflaskor' },
    { id: '68be85b2094d08828def5633', name: 'Flaskpropp med kapsylöppnare' },
    { id: '68be85c9094d08828defa807', name: 'Jigger 50ml/25ml' },
    { id: '68be85c9094d08828defa808', name: 'Jigger 50ml/25ml' },
    { id: '68be85c9094d08828defa809', name: 'Jigger 15ml/30ml' },
    { id: '68be85c9094d08828defa80c', name: 'Flaskhållare Bambu' },
    { id: '68be85c9094d08828defa841', name: 'Manhattan Cocktail Shaker' },
    { id: '68be85c9094d08828defa842', name: 'Cocktailshaker 550ml' },
    { id: '68be85c9094d08828defa844', name: 'Cocktailset Bambu' },
    { id: '68be85c9094d08828defa845', name: 'Cocktailset' },
    { id: '68be85c9094d08828defa846', name: 'Cocktailset Lyx' },
    { id: '68be85c9094d08828defa847', name: 'Shaker 550 ml' },
    { id: '68be85c9094d08828defa848', name: 'Shaker 500ml' },
    { id: '68be85c9094d08828defa856', name: 'Puglia champagnekork' },
    { id: '68be85c9094d08828defa85c', name: 'Trälåda för 3 flaskor, låsbart lock 36 x 30 x 10 cm' },
    { id: '68be85c9094d08828defa85d', name: 'Enkel trälåda i naturfärg - låda 36 x 11 x 10,5 cm' },
    { id: '68be85c9094d08828defa85e', name: 'Träåda för 2 flaskor i naturfärg - låda 36 x 20,5 x 10,5 cm' },
    { id: '68be85c9094d08828defa85f', name: 'Trälåda för 3 flaskor i naturfärg - låda  36 x 30 x 11 cm' },
    { id: '68be85c9094d08828defa860', name: 'Trälåda för flaska, låsbart lock 36 x 11 x 10 cm' },
    { id: '68be85c9094d08828defa861', name: 'Trälåda för 2 flaskor, låsbart lock 36x20x10cm' },
    { id: '68be85c9094d08828defa869', name: 'Norge' },
    { id: '68be85c9094d08828defa86a', name: 'Fickplunta Cigarr Style' },
    { id: '68be85c9094d08828defa86b', name: 'Hipflask Bamboo 200 ml fickplunta' },
    { id: '68be85c9094d08828defa86d', name: 'Namib Flask - Plunta 190 ml' },
    { id: '68be85c9094d08828defa876', name: 'Ishink med handtag i Metall' },
    { id: '68be85c9094d08828defa877', name: 'Ishink Stål' },
    { id: '68be85c9094d08828defa878', name: 'Ishink i Metall' },
    { id: '68be85c9094d08828defa879', name: 'Champagnekylare' },
    { id: '68be85c9094d08828defa87b', name: 'Flaskkylare i Nylon' },
    { id: '68be85c9094d08828defa87c', name: 'IceBucket ishink' },
    { id: '68be85c9094d08828defa889', name: 'Underläggsset i Trä' },
    { id: '68be85c9094d08828defa88a', name: 'Underlägg i Kork' },
    { id: '68be85c9094d08828defa88b', name: 'Underlägg i Trä' },
    { id: '68be85c9094d08828defa8b1', name: 'ECO Bamboe Straw Set bambusugrör' },
    { id: '68be85c9094d08828defa8b2', name: 'Reusable 1 piece ECO Straw Set sugrörsatser stål' },
    { id: '68be85c9094d08828defa8cc', name: 'Ellison fyrkantigt plastunderlägg med pappersinlägg' },
    { id: '68be85ca094d08828defaafb', name: 'RPET-filtunderläggsset Lawrence' },
    { id: '68be85ca094d08828defab86', name: 'Kork Helmut' },
    { id: '68be85cb094d08828defacc4', name: 'Cocktail shaker i glas (400 ml) Adela' },
    { id: '68be85cb094d08828defb017', name: 'Sidecar cocktailset' },
    { id: '68be85cb094d08828defb026', name: 'PrintBeer RPET kylare för ölflaskor' },
    { id: '68be85cc094d08828defb0d6', name: 'Flaskhållare av bambu Hans' },
    { id: '68be85cc094d08828defb183', name: 'Paloma cocktailset' },
    { id: '68be85cd094d08828defbcba', name: 'PrintCan Slim RPET-kylare för burkar' },
    { id: '68be85cd094d08828defbcfd', name: 'Flaskpropp ABS Jareth' },
    { id: '68be85cd094d08828defbe37', name: 'Arran isbitsset' },
    { id: '68be85ce094d08828defc2ac', name: 'Posa Set - Set med 4 PU-underlägg' },
    { id: '68be85ce094d08828defc413', name: 'Cocoon - Flaska med snapsglas' },
    { id: '68be85cf094d08828defc642', name: 'PrintCan RPET-kylare för burkar' },
    { id: '68be85cf094d08828defc7a1', name: 'Alto - Flaskkork Julmotiv' },
    { id: '68be85cf094d08828defc7b9', name: 'Glaw - 4 sugrör av glas' },
    { id: '68be85cf094d08828defc7c0', name: 'Mai Tai - Cocktailkit med 5 delar' },
    { id: '68be85cf094d08828defc7d0', name: 'Plunt-set Schwarzwolf Madonie,' },
    { id: '68be85cf094d08828defc7e2', name: 'Julep cocktailmugg' },
    { id: '68be85d0094d08828defc948', name: 'Plunta Schwarzwolf Halti' },
    { id: '68be85d0094d08828defcb3a', name: 'Sparkling Set' },
    { id: '68be85d0094d08828defcc7e', name: 'Champange Korkstoppare' },
    { id: '68be85d0094d08828defccb9', name: 'PLYCORK. Stativ i plywood med 6 korkunderlägg' },
    { id: '68be85d0094d08828defccf1', name: 'Christo Coasters' },
    { id: '68be85d0094d08828defccf9', name: 'Modigliani Coasters' },
    { id: '68be85d0094d08828defcd00', name: 'Kahlo Coasters' },
    { id: '68be85d0094d08828defcd24', name: 'Sono - Servitörskniv i bambu' },
    { id: '68be85d0094d08828defcd67', name: 'Bubbel Indikator®' },
    { id: '68be85d0094d08828defcd76', name: 'Cabinet D"oeno-curiosités' },
    { id: '68be85d0094d08828defcdd0', name: 'Velazquez Coasters' },
    { id: '68be85d1094d08828defce17', name: 'Tipas - Flaskkork i kork' },
    { id: '68be85d1094d08828defce94', name: 'Plunta set Schwarzwolf TAHAT' },
    { id: '68be85d1094d08828defcee7', name: 'Bopper - Flaskpropp i bokträ' },
    { id: '68be85d1094d08828defcfe9', name: 'Winofloat Skräddarsydd flaskhållare' },
    { id: '68be85d1094d08828defcfef', name: 'ZhuliMax underläggsset' },
    { id: '68be85d1094d08828defd05f', name: 'Squnito flasköppnare underlägg' },
    { id: '68be85d2094d08828defd3be', name: 'Brännö, vinväska 2' },
    // ... and 59 more products
  ],

  // overdelar-barnklader (157 products)
  'overdelar-barnklader': [
    { id: '68be85ad094d08828def4637', name: 'Condor Kids - CONDOR BARN Huvtröja' },
    { id: '68be85ad094d08828def463c', name: 'Columbia Kids - COLUMBIA BARN Tröja' },
    { id: '68be85ad094d08828def463d', name: 'Slam Kids - SLAM BARN Huvtröja' },
    { id: '68be85ad094d08828def46a4', name: 'THC DELTA KIDS. Barntröja i återvunnen bomull och polyester' },
    { id: '68be85ad094d08828def48b5', name: 'THC BUCHAREST KIDS. Långärmad T-shirt' },
    { id: '68be85af094d08828def4d95', name: 'Jr Cray polo' },
    { id: '68be85af094d08828def4e58', name: 'Jr Dunbar halfzip fleece' },
    { id: '68be85af094d08828def4e5e', name: 'Jr Sunningdale halfzip fleece' },
    { id: '68be85af094d08828def4e61', name: 'Jr Loop hoodie' },
    { id: '68be85b2094d08828def57c8', name: 'Stafford kortärmad T-shirt för barn' },
    { id: '68be85b2094d08828def57ca', name: 'Clasica tröja med rund hals för barn' },
    { id: '68be85b2094d08828def57cb', name: 'Imola kortärmad funktions T-shirt för barn' },
    { id: '68be85b2094d08828def57cd', name: 'Dogo Premium kortärmad T-shirt för barn' },
    { id: '68be85b2094d08828def57cf', name: 'IQONIQ Koli t-shirt barn i återvunnen bomull' },
    { id: '68be85b2094d08828def57d0', name: 'Monzha kortärmad sportpikétröja för barn' },
    { id: '68be85b2094d08828def57d2', name: 'IQONIQ Yengo hoodie i återvunnen bomull med sidofickor för b' },
    { id: '68be85b2094d08828def57d3', name: 'Bugatti kortärmad sport-T-shirt för barn' },
    { id: '68be85b2094d08828def57d4', name: 'Evans träningsoverall för barn' },
    { id: '68be85b2094d08828def57d5', name: 'Badet tvåfärgad huvtröja för barn' },
    { id: '68be85b2094d08828def57d6', name: 'Andre sportlinne för barn' },
    { id: '68be85b2094d08828def57d7', name: 'Indianapolis kortärmad sport-T-shirt för barn' },
    { id: '68be85b2094d08828def57d8', name: 'Shanghai kortärmad sport-T-shirt för barn' },
    { id: '68be85b2094d08828def57d9', name: 'Pegaso Premium kortärmad piké för barn' },
    { id: '68be85b2094d08828def57da', name: 'Detroit kortärmad sport-T-shirt för barn' },
    { id: '68be85b2094d08828def57db', name: 'Epiro långärmad sweatshirt med kvartslång dragkedja för barn' },
    { id: '68be85b2094d08828def57dc', name: 'Tamil kortärmad sportpolo för barn' },
    { id: '68be85b2094d08828def57dd', name: 'Estoril kortärmad funktions T-shirt för barn' },
    { id: '68be85b2094d08828def57de', name: 'Imperial Kids - IMPERIAL BARN T-SHIRT 190g' },
    { id: '68be85b2094d08828def57df', name: 'Regent Fit Kids - REGENT F BARN T-SHIRT 150g' },
    { id: '68be85b2094d08828def57e0', name: 'Crusader Kids - CRUSADER BARN T-SHIRT 150g' },
    { id: '68be85b2094d08828def57e1', name: 'Pioneer Kids - PIONEER BARN T-SHIRT 175g' },
    { id: '68be85b2094d08828def57e2', name: 'Sporty Kids - SPORTY BARN T-SHIRT 140g' },
    { id: '68be85b2094d08828def57e3', name: 'North Kids - NORTH BARN FLEECE TRÖJA' },
    { id: '68be85b2094d08828def57e4', name: 'Imperial Lsl Kids - IMPERIAL Barn långärmad' },
    { id: '68be85b2094d08828def57e5', name: 'Bambino - BAMBINO BABY BODYSUIT 180g' },
    { id: '68be85b2094d08828def57e6', name: 'Condor Kids - CONDOR BARN Huvtröja' },
    { id: '68be85b2094d08828def57e7', name: 'Columbia Kids - COLUMBIA BARN Tröja' },
    { id: '68be85b2094d08828def57e8', name: 'Slam Kids - SLAM BARN Huvtröja' },
    { id: '68be85b2094d08828def57f0', name: 'Baseballjacka Varsity Barn by AWDis' },
    { id: '68be85b2094d08828def584d', name: 'Hoodie Barn by AWDis' },
    { id: '68be85b2094d08828def584f', name: 'Sweatshirt Barn by AWDis' },
    { id: '68be85b2094d08828def5852', name: 'Kids Cool T' },
    { id: '68be85b2094d08828def5855', name: 'Kortärmad Baby Body' },
    { id: '68be85b2094d08828def5857', name: 'Baseballjacka Varsity Barn by AWDis' },
    { id: '68be85b2094d08828def5858', name: 'Varsity Hoodie Barn by AWDis' },
    { id: '68be85b2094d08828def5859', name: 'THC QUITO. T-shirt för barn' },
    { id: '68be85b2094d08828def585c', name: 'Baby Body' },
    { id: '68be85b2094d08828def5865', name: 'Baby Body Label Free' },
    { id: '68be85b2094d08828def58ac', name: 'Kids´ Dogo Premium T-Shirt' },
    { id: '68be85b2094d08828def58ad', name: 'Basic Active Hoody Junior' },
    { id: '68be85b2094d08828def58ae', name: 'Kids Organic Hoodie' },
    { id: '68be85b2094d08828def58b1', name: 'THC ADAM KIDS. Kortärmad bomullspikétröja för barn (unisex)' },
    { id: '68be85b2094d08828def58b2', name: 'THC ANKARA KIDS. T-shirt för barn' },
    { id: '68be85b2094d08828def58b3', name: 'Kids´ Montecarlo T-Shirt' },
    { id: '68be85b2094d08828def58b4', name: 'Basic Active Cardigan Junior' },
    { id: '68be85b2094d08828def58b6', name: 'THC PHOENIX KIDS. Tröja för barn (unisex)' },
    { id: '68be85b2094d08828def58b7', name: 'Kids´ Premium-T' },
    { id: '68be85b2094d08828def58b8', name: 'Electric Hoodie Barn by AWDis' },
    { id: '68be85b2094d08828def58ba', name: 'Kid"s TriDri® performance baselayer' },
    { id: '68be85b2094d08828def58bb', name: 'Kids´ Star Poloshirt' },
    { id: '68be85b2094d08828def58be', name: 'Heavy Cotton? Youth T-Shirt' },
    { id: '68be85b2094d08828def58bf', name: 'Kids hooded sweatshirt 350gsm' },
    { id: '68be85b2094d08828def58c0', name: 'Kids sweatshirt 350gsm' },
    { id: '68be85b3094d08828def58c2', name: 'Kids Cool Smooth T' },
    { id: '68be85b3094d08828def58c3', name: 'Reflexväst för barn med dragkedja "Aalborg"' },
    { id: '68be85b3094d08828def58c5', name: 'Softstyle® Youth T-Shirt' },
    { id: '68be85b3094d08828def58ce', name: 'Jr Cray polo' },
    { id: '68be85b3094d08828def58d0', name: 'Kids Iconic 195 T' },
    { id: '68be85b3094d08828def58d1', name: 'Reflexväst för barn "Funtastic Wildlife" - CO2 Neutral' },
    { id: '68be85b3094d08828def58d2', name: 'THC DELTA KIDS. Barntröja i återvunnen bomull och polyester' },
    { id: '68be85b3094d08828def58d3', name: 'Eco-Friendly Kids" Dropped Shoulders T-shirt' },
    { id: '68be85b3094d08828def58d5', name: 'THC BUCHAREST KIDS. Långärmad T-shirt' },
    { id: '68be85b3094d08828def58d6', name: 'Jr Dunbar halfzip fleece' },
    { id: '68be85b3094d08828def58d8', name: 'Jr Sunningdale halfzip fleece' },
    { id: '68be85b3094d08828def58d9', name: 'Reflexväst för barn Action - CO2 Neutral - "Working Heroes"' },
    { id: '68be85b3094d08828def58db', name: 'Kids Sweatshirt' },
    { id: '68be85b3094d08828def58dd', name: 'Core Soul Full Zip Hood Jr' },
    { id: '68be85b3094d08828def58de', name: 'Reflexväst med huva för barn "Odense"' },
    { id: '68be85b3094d08828def58df', name: 'Core Soul Full Zip Jkt Jr' },
    { id: '68be85b3094d08828def58e0', name: 'Core Soul Crew Sweatshirt Jr' },
    { id: '68be85b3094d08828def58e1', name: 'Reflexväst för barn Action - CO2 Neutral - "Aerospace"' },
    { id: '68be85b3094d08828def58e2', name: 'Reflexväst för barn Action - CO2 Neutral - "Sport"' },
    { id: '68be85b3094d08828def5917', name: 'Core Soul Hood Sweatshirt Jr' },
    { id: '68be85b4094d08828def5f4d', name: 'Reflexväst för barn med dragkedja "Aalborg"' },
    { id: '68be85b4094d08828def5f9f', name: 'Jr Dunbar halfzip fleece' },
    { id: '68be85b4094d08828def6024', name: 'Reflexväst för barn "Funtastic Wildlife" - CO2 Neutral' },
    { id: '68be85b4094d08828def602f', name: 'Reflexväst för barn Action - CO2 Neutral - "Vehicle Fun"' },
    { id: '68be85b4094d08828def6030', name: 'Reflexväst för barn Action - CO2 Neutral - "Rescue Rangers"' },
    { id: '68be85b4094d08828def6031', name: 'Reflexväst för barn Action - CO2 Neutral - "Dinosaurs"' },
    { id: '68be85b8094d08828def6986', name: 'Reflexväst för barn med dragkedja "Aalborg"' },
    { id: '68be85b8094d08828def6a1c', name: 'Reflexväst för barn "Funtastic Wildlife" - CO2 Neutral' },
    { id: '68be85b8094d08828def6a27', name: 'Reflexväst för barn Action - CO2 Neutral - "Fantasy"' },
    { id: '68be85ba094d08828def70e7', name: 'Jr Cray polo' },
    { id: '68be85ba094d08828def714a', name: 'Jr Sunningdale halfzip fleece' },
    { id: '68be85ba094d08828def714d', name: 'Jr Loop hoodie' },
    { id: '68be85cd094d08828defbe7a', name: 'T-shirt SXT 1 (125 g) Barn EU' },
    { id: '68be85d0094d08828defcdbb', name: 'THC BUCHAREST KIDS WH. Långärmad T-shirt' },
    { id: '68be85d2094d08828defd55c', name: 'THC DELTA KIDS WH. Tröja för barn' },
    { id: '68be85d3094d08828defd95e', name: 'THC ANKARA KIDS WH. T-shirt för barn' },
    { id: '68be85d3094d08828defda0b', name: 'THC QUITO WH. T-shirt i bomull för barn (unisex)' },
    // ... and 57 more products
  ],

  // candy (157 products)
  'candy': [
    { id: '68be85ad094d08828def4861', name: 'Rund hattask med julmix | Flera varianter' },
    { id: '68be85ad094d08828def48bb', name: 'Blåvand karameller | Flera smaker' },
    { id: '68be85ad094d08828def48bc', name: 'Oval Hattask | Flera varianter' },
    { id: '68be85ad094d08828def491c', name: 'Silverheart Röd/Vit' },
    { id: '68be85ad094d08828def491e', name: 'Silverheart Silver/Svart' },
    { id: '68be85ad094d08828def4920', name: 'Silverheart Silver/Vit' },
    { id: '68be85ad094d08828def4921', name: 'Black Lakritsburkar  |  Flera smaker' },
    { id: '68be85ae094d08828def499e', name: 'Svart Hattask med Chokladtäckta Mandlar & Nötter | Flera storlekar' },
    { id: '68be85ae094d08828def499f', name: 'Silverheart Guld/Svart' },
    { id: '68be85ae094d08828def49a0', name: 'Black Lakritsburkar  |  Flera smaker' },
    { id: '68be85ae094d08828def49a3', name: 'Cellofanpåsar  |  Flera smaker' },
    { id: '68be85ae094d08828def49a6', name: 'Black Lakrits 90g  |  Flera smaker' },
    { id: '68be85ae094d08828def49a7', name: 'Sweethearts, 9st' },
    { id: '68be85ae094d08828def4a46', name: 'Sweethearts, 27st' },
    { id: '68be85ae094d08828def4a4a', name: 'Silverheart Burk | Flera smaker' },
    { id: '68be85ae094d08828def4a4c', name: 'Silverheart Brons/Svart' },
    { id: '68be85b0094d08828def4f19', name: 'Påskägg i metall' },
    { id: '68be85b0094d08828def4fe1', name: 'TwistMint mintburk' },
    { id: '68be85b1094d08828def5445', name: 'Egendesignad julkalender' },
    { id: '68be85b1094d08828def544d', name: 'Silverheart Röd/Vit' },
    { id: '68be85b1094d08828def5497', name: 'Silverheart Guld/Vit' },
    { id: '68be85b1094d08828def5498', name: 'Silverheart Silver/Svart' },
    { id: '68be85b1094d08828def5499', name: 'Silverheart Guld/Svart' },
    { id: '68be85b1094d08828def549d', name: 'Silverheart Brons/Svart' },
    { id: '68be85ca094d08828defaa93', name: 'Christmas Gift Bag 100 g' },
    { id: '68be85de094d08828df00743', name: 'Karameller med reklamtryck' },
    { id: '68be85de094d08828df00744', name: 'Kolor med reklamtryck' },
    { id: '68be85de094d08828df00790', name: 'Lakritsbit i flowpack' },
    { id: '68be85de094d08828df00793', name: 'Black Lakritsburkar  |  Flera smaker' },
    { id: '68be85de094d08828df00794', name: 'Black Lakritsburkar  |  Flera smaker' },
    { id: '68be85de094d08828df00795', name: 'Black Lakrits 90g  |  Flera smaker' },
    { id: '68be85de094d08828df00798', name: 'Lovemint - Hjärtformad plåtask' },
    { id: '68be85de094d08828df007d2', name: 'Påskägg i metall' },
    { id: '68be85de094d08828df007f7', name: 'Mintpastiller i plåtask med tryck' },
    { id: '68be85de094d08828df007f9', name: 'Mintcard med tryck' },
    { id: '68be85de094d08828df007fa', name: 'Mintask med tryck' },
    { id: '68be85de094d08828df007fb', name: 'Mintask Click med tryck' },
    { id: '68be85de094d08828df007fd', name: 'Mintask med tryck - Rektangel' },
    { id: '68be85de094d08828df007fe', name: 'Mintask med tryck - Tumme' },
    { id: '68be85de094d08828df007ff', name: 'Rund Mintask med tryck' },
    { id: '68be85de094d08828df00800', name: 'TinBox pepparmintpastiller' },
    { id: '68be85de094d08828df00801', name: 'Mini ClicTin pepparmintpastiller' },
    { id: '68be85de094d08828df00802', name: 'Circle Mint mintpastiller' },
    { id: '68be85de094d08828df00804', name: 'MintHolder' },
    { id: '68be85de094d08828df00805', name: 'Mentos Original i flowpack' },
    { id: '68be85de094d08828df00806', name: 'Mintask Click Mini' },
    { id: '68be85de094d08828df00807', name: 'Pepparmint Sliding-box' },
    { id: '68be85de094d08828df00808', name: 'Mintask Mini' },
    { id: '68be85de094d08828df0080e', name: 'Tablettaskar med reklamtryck' },
    { id: '68be85de094d08828df00848', name: 'Karameller med reklamtryck' },
    { id: '68be85de094d08828df00849', name: 'Choko Jack' },
    { id: '68be85de094d08828df0084a', name: 'Mini-dextrosrulle 5,6g' },
    { id: '68be85de094d08828df0084b', name: 'Dextrosrulle 21g' },
    { id: '68be85de094d08828df0084d', name: 'Tryckt burk fylld med ca. 23 g pepparmynta' },
    { id: '68be85de094d08828df0084e', name: 'Burk med ca. 23 g pepparmynta' },
    { id: '68be85de094d08828df0084f', name: 'Burk med tryck och ca. 23 g logotyp/formade pepparmynta' },
    { id: '68be85de094d08828df00850', name: 'Tryckt burk fylld med ca. 9 g pepparmynta' },
    { id: '68be85de094d08828df00851', name: 'Tryckt clic-clac vit konserveringsburk med ca. 50 g formade mints' },
    { id: '68be85de094d08828df00852', name: 'Tryckt burk med ca. 28 g Mentos' },
    { id: '68be85de094d08828df00853', name: 'Tryckt super mini clic-clac konserveringsburk med ca. 12 g mints' },
    { id: '68be85de094d08828df00854', name: 'Tryckt mini clic-clac fylld med ca. 23 g pepparmynta' },
    { id: '68be85de094d08828df00855', name: 'Tryckt ask med Tic-Tac mints' },
    { id: '68be85de094d08828df00856', name: 'Tryckt tubbehållare med ca. 7 g mini mints' },
    { id: '68be85de094d08828df00857', name: 'Tryckt mini clic-clac konserveringsburk med ca. 23 g logotyp/formade mints' },
    { id: '68be85de094d08828df00859', name: 'Tryckt hjärtformad burk fylld med ca. 23 g hjärtformad pepparmynta' },
    { id: '68be85de094d08828df0085a', name: 'Tryckt miniburk med ca. 12 g mints' },
    { id: '68be85de094d08828df0085b', name: 'Hjärtformad burk med prägling, fylld med ca. 23 g hjärtformad pepparmynta' },
    { id: '68be85de094d08828df00888', name: 'Choko Jack' },
    { id: '68be85de094d08828df0090e', name: 'Tryckt micro mini clic-clac konserveringsburk med ca. 5 g mints' },
    { id: '68be85de094d08828df00910', name: 'Tryckt rund vit konserveringsburk med ca. 50 g logotyp/formade mints' },
    { id: '68be85de094d08828df00911', name: 'Miniask i silver med ca. 8 g mini mints' },
    { id: '68be85de094d08828df00913', name: 'Tryckt clic-clac konserveringsburk fylld med ca. 45 g mint i plastpåse' },
    { id: '68be85de094d08828df00914', name: 'Tryckt fyrkantig burk med 23 g pepparmynta' },
    { id: '68be85de094d08828df00915', name: 'Tryckt triangelask fylld med ca. 20 g mints' },
    { id: '68be85de094d08828df00916', name: 'Slidy ask fylld med ca. 11 g mini mints' },
    { id: '68be85de094d08828df00917', name: 'Burk med fullfärgstryckt doming-dekal på locket' },
    { id: '68be85de094d08828df00918', name: 'Tryckt burk med ca. 30 g pepparmynta' },
    { id: '68be85de094d08828df00919', name: 'Stor burk fylld med en plastpåse med 45 g pepparmynta' },
    { id: '68be85de094d08828df0091a', name: 'Rektangulär förpackning fullfärgstryck' },
    { id: '68be85de094d08828df0091b', name: 'Tryckt burk med ca. 30 g pepparmynta' },
    { id: '68be85de094d08828df0091c', name: 'Tryckt rund burk fylld med ca. 34 g pepparmynta' },
    { id: '68be85de094d08828df0091d', name: 'Rektangulär förpackning fullfärgstryck' },
    { id: '68be85de094d08828df0091e', name: 'TwistMint mintburk' },
    { id: '68be85de094d08828df00920', name: 'Kolor med reklamtryck' },
    { id: '68be85de094d08828df00921', name: 'Godis i blandade färger och smaker i komposterbar folie' },
    { id: '68be85de094d08828df00922', name: 'Flowpack fylld med 1 st mini sötsak i olika färger och smaker' },
    { id: '68be85de094d08828df00923', name: 'Flowpack fylld med 1 st sötsak i olika färger och smaker' },
    { id: '68be85de094d08828df00927', name: 'Dextro energigodis i komposterbar vit folie' },
    { id: '68be85de094d08828df00928', name: 'Blåvand karameller | Flera smaker' },
    { id: '68be85de094d08828df00929', name: 'Blåvand karameller | Flera smaker' },
    { id: '68be85de094d08828df0098e', name: 'Mikroglasburk 50 ml med helt färgad dekal på locket' },
    { id: '68be85de094d08828df00995', name: 'Oljefatburk med fullfärgstryckt etikett' },
    { id: '68be85de094d08828df00997', name: 'Stor burk 1,3 L med fullfärgstryckt etikett' },
    { id: '68be85de094d08828df0099a', name: 'Glasburk med metalllock 0,22 L' },
    { id: '68be85de094d08828df0099b', name: 'Mailing "glas" maxi med 1 fullfärgstryckt etikett' },
    { id: '68be85de094d08828df0099d', name: 'Rund konservburk 0,6 L med fullfärgstryckt etikett' },
    { id: '68be85de094d08828df0099f', name: 'Mailing "glas" midi med 1 fullfärgstryckt etikett' },
    { id: '68be85de094d08828df00a41', name: 'Svart Hattask med Chokladpraliner | Flera storlekar' },
    { id: '68be85de094d08828df00a45', name: 'Svart Hattask Mega | Flera varianter' },
    { id: '68be85de094d08828df00a46', name: 'Godisväska | Flera varianter' },
    // ... and 57 more products
  ],

  // kitchen-tools (157 products)
  'kitchen-tools': [
    { id: '68be85ad094d08828def490f', name: 'TOKEV. Pizza skärare' },
    { id: '68be85b0094d08828def4f61', name: 'Brus kolsyremaskin' },
    { id: '68be85b1094d08828def5474', name: 'Emma presskanna 1 l.' },
    { id: '68be85b1094d08828def5485', name: 'TOKEV. Pizza skärare' },
    { id: '68be85b1094d08828def5486', name: 'Pizzaskärare' },
    { id: '68be85b2094d08828def54dd', name: 'Brus kolsyremaskin' },
    { id: '68be85b2094d08828def54e0', name: 'Brus kolsyremaskin, vägghängd' },
    { id: '68be85ca094d08828defa8fe', name: 'ELVISP FRÅN STRANDBY' },
    { id: '68be85ca094d08828defa8ff', name: '3 I 1 MIXER FRÅN STRANDBY' },
    { id: '68be85ca094d08828defa907', name: 'Pizzax pizzaskärare' },
    { id: '68be85ca094d08828defa909', name: 'Kolsyremaskin - Strandby' },
    { id: '68be85ca094d08828defa90a', name: 'Siroter - Trådlös laddare/muggvärmare' },
    { id: '68be85ca094d08828defa929', name: 'Karabo Miniform' },
    { id: '68be85ca094d08828defa92a', name: 'Ugnsform i keramik, 2-pack' },
    { id: '68be85ca094d08828defa93e', name: 'Pizzabräda,i bambu, Vale' },
    { id: '68be85ca094d08828defa93f', name: 'Brabantia Tasty+ Deg-/Pizzaskärare' },
    { id: '68be85ca094d08828defa940', name: 'Pizza Set Siciliana 3-pcs' },
    { id: '68be85ca094d08828defa941', name: 'Pizzaskärare' },
    { id: '68be85ca094d08828defa942', name: 'Pizza Set Rustico 2-pcs' },
    { id: '68be85ca094d08828defa943', name: 'Sliceit' },
    { id: '68be85ca094d08828defa944', name: 'BOSKA Pizzaugn Pro Pellet' },
    { id: '68be85ca094d08828defa953', name: 'Elegant moccakokare i härlig färg' },
    { id: '68be85ca094d08828defa956', name: 'Bärbar Mixer/Mugg' },
    { id: '68be85ca094d08828defa957', name: 'Rechargeable Smoothie Maker' },
    { id: '68be85ca094d08828defa959', name: 'Rivjärn Trä Morwenna' },
    { id: '68be85ca094d08828defa95a', name: 'Köksredskapssats metall och trä Sylvan' },
    { id: '68be85ca094d08828defa97d', name: 'Skärbräda med kokbok' },
    { id: '68be85cb094d08828defaeb3', name: 'Salladsbestick i bambu Elara' },
    { id: '68be85cb094d08828defaf41', name: 'Bolero grönsaksskalare' },
    { id: '68be85cb094d08828defafb9', name: 'Träslev Beckham' },
    { id: '68be85cd094d08828defc01e', name: 'Pizzaskärare i bambu Ian' },
    { id: '68be85ce094d08828defc41a', name: 'Muglet - Muggvärmare i bambu med USB' },
    { id: '68be85cf094d08828defc666', name: 'Cuqui Set - Pepparkaksformar juldekoration' },
    { id: '68be85cf094d08828defc6a9', name: 'Hl Plus 200 Röd' },
    { id: '68be85cf094d08828defc6ac', name: 'Elegance Red - Tranchergaffel 18 Cm' },
    { id: '68be85cf094d08828defc6ad', name: 'Rl 250 Svart' },
    { id: '68be85cf094d08828defc6b4', name: 'Mjölkskummare Koppar Med Hållare' },
    { id: '68be85cf094d08828defc6b6', name: 'Hl Plus 200 Svart' },
    { id: '68be85cf094d08828defc6bf', name: 'Rl 250 Röd' },
    { id: '68be85cf094d08828defc7f2', name: 'Espressomaskin' },
    { id: '68be85cf094d08828defc7f4', name: 'Grillpress Classic Collection' },
    { id: '68be85cf094d08828defc7f5', name: 'Hl Plus 250 Svart' },
    { id: '68be85cf094d08828defc805', name: 'Hl Plus 250 Röd' },
    { id: '68be85d0094d08828defc819', name: 'Elvisp Koppar' },
    { id: '68be85d0094d08828defc822', name: 'B2 Flywheel' },
    { id: '68be85d0094d08828defc9cf', name: 'Ugnsform L Rektangulär - 4 L - Cream' },
    { id: '68be85d0094d08828defcac8', name: 'Big Kase - Keramiskt fondueset 300 ml' },
    { id: '68be85d0094d08828defcb2e', name: 'Original' },
    { id: '68be85d0094d08828defcb34', name: 'Reservglas Presskanna 5 Koppar' },
    { id: '68be85d0094d08828defcb35', name: '8 Koppar Presskanna' },
    { id: '68be85d0094d08828defcb36', name: '5 Koppar Presskanna' },
    { id: '68be85d0094d08828defcb39', name: 'Reservglas Presskanna 8 Koppar' },
    { id: '68be85d0094d08828defcb3e', name: 'Walnut' },
    { id: '68be85d0094d08828defcb42', name: 'Crush' },
    { id: '68be85d0094d08828defcb45', name: 'Pajform 24 Cm - Cream' },
    { id: '68be85d0094d08828defcb4b', name: 'Värmegaller Classic 1st' },
    { id: '68be85d0094d08828defcb4c', name: 'Ugnsform L Rektangulär - 4 L -petrol' },
    { id: '68be85d0094d08828defcc53', name: 'Blendie - Bärbar mixer' },
    { id: '68be85d0094d08828defcc56', name: 'Kase - Keramiskt fondueset 240 ml' },
    { id: '68be85d0094d08828defcc7c', name: '3 Koppar Presskanna' },
    { id: '68be85d0094d08828defcc7d', name: 'Cappucino Artist' },
    { id: '68be85d0094d08828defcc80', name: 'Set 2 X Creme Brulee Formar  - Röd' },
    { id: '68be85d0094d08828defcc83', name: 'Pour Over Kokare 0,8l' },
    { id: '68be85d0094d08828defcc85', name: 'Mockabryggare 3 Koppar' },
    { id: '68be85d0094d08828defcc8c', name: 'Ugnsform S Rektangulär - 1,55 L - Cream' },
    { id: '68be85d0094d08828defcc8d', name: 'Blender' },
    { id: '68be85d0094d08828defcc97', name: 'Mockabryggare 6 Koppar' },
    { id: '68be85d0094d08828defcc9d', name: 'Valnott nötknäppare set' },
    { id: '68be85d0094d08828defcd61', name: 'Ramekin Form- N°8 - Röd' },
    { id: '68be85d0094d08828defcd62', name: 'Ramekin Form- N°8 - Cream' },
    { id: '68be85d0094d08828defcd64', name: 'Pajform Hjärta 1,5 L - Röd' },
    { id: '68be85d0094d08828defcd66', name: 'Pajform 28 Cm - Röd' },
    { id: '68be85d0094d08828defcd69', name: 'Stavmixer Koppar' },
    { id: '68be85d0094d08828defcd6d', name: 'Pajform 28 Cm - Petrol' },
    { id: '68be85d0094d08828defcd74', name: 'Brödrost Classic 2 Skivor Koppar' },
    { id: '68be85d0094d08828defcd75', name: 'Green Marble' },
    { id: '68be85d0094d08828defcd79', name: 'Ugnsform L Rektangulär - 4 L - Röd' },
    { id: '68be85d0094d08828defcd7a', name: 'Pajform 24 Cm - Petrol' },
    { id: '68be85d0094d08828defcd7c', name: 'Pajform 28 Cm - Cream' },
    { id: '68be85d0094d08828defcd7e', name: 'Pajform Hjärta 1,5 L - Cream' },
    { id: '68be85d0094d08828defcd80', name: 'Set 2 X Creme Brulee Formar  - Cream' },
    { id: '68be85d0094d08828defcd81', name: 'Ugnsform Rektangulär Indivudual - 0,7 L - Röd' },
    { id: '68be85d0094d08828defcdde', name: 'Turner Barbecue Set' },
    { id: '68be85d0094d08828defcde0', name: 'Duchamp Board' },
    { id: '68be85d1094d08828defce39', name: 'Ugnsform S Rektangulär - 1,55 L -petrol' },
    { id: '68be85d1094d08828defce3b', name: 'Ugnsform S Rektangulär - 1,55 L - Röd' },
    { id: '68be85d1094d08828defce3f', name: 'Bakform - 1,8 L - Röd' },
    { id: '68be85d1094d08828defce46', name: 'Ugnsform Rektangulär Individual  - 0,7 L - Cream' },
    { id: '68be85d1094d08828defce48', name: 'Ugnsform Rektangulär Individual 0,7 L - Petrol' },
    { id: '68be85d1094d08828defce53', name: 'Bakform 1,8 L - Cream' },
    { id: '68be85d1094d08828defce59', name: 'Elvisp Vit' },
    { id: '68be85d1094d08828defcefb', name: 'Pajform 24 Cm- Röd' },
    { id: '68be85d1094d08828defcf19', name: 'Brödrost Classic 4 Skivor Koppar' },
    { id: '68be85d1094d08828defcf24', name: 'Bigaboo pizza serveringsset' },
    { id: '68be85d1094d08828defcf3c', name: 'Kjøkkenvekt i bambus Reanne' },
    { id: '68be85d1094d08828defcfc2', name: 'Våffeljärn' },
    { id: '68be85d1094d08828defcfcd', name: 'Toastgaller Classic 1st' },
    { id: '68be85d1094d08828defcfcf', name: 'Elvisp Svart' },
    { id: '68be85d1094d08828defcfde', name: 'Brödrost Classic 2 Skivor Canvas Vit' },
    { id: '68be85d1094d08828defd018', name: 'MORIMOTO. Sushiset i bambu' },
    // ... and 57 more products
  ],

  // trolley-bags (142 products)
  'trolley-bags': [
    { id: '68be85ad094d08828def453b', name: 'Resväska 75 cm, 4 hjul, Lyxig inredning, Expanderbar' },
    { id: '68be85ad094d08828def453c', name: 'Resväska 55 cm, 4 hjul, lyxig inredning, expanderbar' },
    { id: '68be85ad094d08828def453d', name: 'Set med resväskor, S/M/L' },
    { id: '68be85ad094d08828def453e', name: 'Swift S' },
    { id: '68be85ad094d08828def453f', name: 'Set Med Resväskor, S/M/L' },
    { id: '68be85ad094d08828def4540', name: 'Swift L' },
    { id: '68be85ad094d08828def4541', name: 'Swift M' },
    { id: '68be85ad094d08828def4542', name: 'Kabinväska 54 cm, 65 cm, 76 cm 4 hjul' },
    { id: '68be85ad094d08828def4543', name: 'Set med resväskor, S/M/L' },
    { id: '68be85ad094d08828def4544', name: 'Set med resväskor / Trolleyset 3 delar S/M/L' },
    { id: '68be85ad094d08828def4760', name: 'Birmingham, kabinväska' },
    { id: '68be85ad094d08828def481d', name: 'OSL, kabinväska 55 cm' },
    { id: '68be85ad094d08828def488f', name: 'OSL, kabinväska 55 cm laptop' },
    { id: '68be85ad094d08828def489b', name: 'Escape, cabin Trolley Bergen' },
    { id: '68be85ad094d08828def48fa', name: 'Superb, kabinväska 55 cm' },
    { id: '68be85b0094d08828def50e5', name: 'Airmile RPET handbagage' },
    { id: '68be85b0094d08828def51ef', name: 'Kabinväska/trolley i ABS Alaric' },
    { id: '68be85b0094d08828def524c', name: 'Kabinväska av ABS Elke' },
    { id: '68be85b0094d08828def52bb', name: 'Rover 20" kabinväska av GRS-återvunnet material 40 liter' },
    { id: '68be85b0094d08828def52bc', name: 'Rover Pro 20" kabinväska av GRS-återvunnet material, 40L' },
    { id: '68be85b0094d08828def52bd', name: 'Rover 24" kabinväska av GRS-återvunnet material, 70 l' },
    { id: '68be85b0094d08828def52be', name: 'Voyage - 600D RPET Soft trolley' },
    { id: '68be85b0094d08828def52c0', name: 'Escape Handle Wrap' },
    { id: '68be85b0094d08828def52c1', name: 'Trolley 18 tums' },
    { id: '68be85b0094d08828def52c2', name: 'Kabinväska' },
    { id: '68be85b0094d08828def52c3', name: 'Trolley/kabinväska i hårdplast, Verona' },
    { id: '68be85b0094d08828def52c4', name: 'Multi Line Trolley 20"' },
    { id: '68be85b0094d08828def52c5', name: 'Escape Check-In Wheelie' },
    { id: '68be85b0094d08828def52c6', name: 'Escape Carry-On Wheelie' },
    { id: '68be85b1094d08828def52f1', name: 'Trolley/kabinväska, med fyra snurrhjul. Serafina' },
    { id: '68be85b1094d08828def52f2', name: 'Thule Crossover 2 Wheeled Duffel 87L. Svart' },
    { id: '68be85b1094d08828def52f3', name: 'Oxfort Trolley' },
    { id: '68be85b1094d08828def52f4', name: 'Birmingham, kabinväska' },
    { id: '68be85b1094d08828def52f5', name: 'Kabinväska. 55 cm 4 Hjul' },
    { id: '68be85b1094d08828def52f7', name: 'Kabinväska. 54 cm 4 hjul' },
    { id: '68be85b1094d08828def52f9', name: 'Kabinväska 54cm 4 dubbelhjul' },
    { id: '68be85b1094d08828def52fa', name: 'Kabinväska. 54 cm 4 hjul' },
    { id: '68be85b1094d08828def52fb', name: 'Resväska Expanderbar 65 cm. 4 hjul' },
    { id: '68be85b1094d08828def52fc', name: 'Resväska 75 cm. 4 dubbelhjul. Expanderbar.' },
    { id: '68be85b1094d08828def52fd', name: 'Resväska. 75 cm 4 Hjul' },
    { id: '68be85b1094d08828def52fe', name: 'Kabinväska 55 cm, 4 hjul, Lyxig inredning' },
    { id: '68be85b1094d08828def5323', name: 'Resväska. 66 cm 4 Hjul' },
    { id: '68be85b1094d08828def5325', name: 'Set med resväskor / Trolleyset 3 delar S/M/L' },
    { id: '68be85b1094d08828def5326', name: 'Resväska 65 cm. 4 dubbelhjul. Expanderbar.' },
    { id: '68be85b1094d08828def5327', name: 'Kabinväska Lucca' },
    { id: '68be85b1094d08828def5328', name: 'Kabinväska/trolley i ABS Alaric' },
    { id: '68be85b1094d08828def5329', name: 'Resväska Expanderbar 73 cm 4 Hjul' },
    { id: '68be85b1094d08828def532a', name: 'Set Med Resväskor / Trolleyset 3 Delar S/M/L' },
    { id: '68be85b1094d08828def532b', name: 'Kabinväska av ABS Elke' },
    { id: '68be85b1094d08828def532c', name: 'Kabinväska. 67 cm 4 Hjul' },
    { id: '68be85b1094d08828def532d', name: 'Kabinväska. 55 cm 4 Hjul' },
    { id: '68be85b1094d08828def532e', name: 'Escape, cabin Trolley Bergen' },
    { id: '68be85b1094d08828def532f', name: 'Resväska Bogi XL' },
    { id: '68be85b1094d08828def5330', name: 'Kabinväska Padua' },
    { id: '68be85b1094d08828def5331', name: 'Kabinväska. 77 cm 4 Hjul' },
    { id: '68be85b1094d08828def5332', name: 'Amsterdam Trolley GRS Recycled ABS rullväska' },
    { id: '68be85b1094d08828def5333', name: 'Resväska 75 cm, 4 hjul, Lyxig inredning, Expanderbar' },
    { id: '68be85b1094d08828def5340', name: 'Kabinväska av ABS Ulf' },
    { id: '68be85b1094d08828def5374', name: 'Resväska 55 cm, 4 hjul, lyxig inredning, expanderbar' },
    { id: '68be85b1094d08828def5375', name: 'Kabinväska Galway' },
    { id: '68be85b1094d08828def5376', name: 'Set med resväskor, S/M/L' },
    { id: '68be85b1094d08828def5377', name: 'Ryggsäck Trailer' },
    { id: '68be85b1094d08828def5378', name: 'Resväska Bogi L' },
    { id: '68be85b1094d08828def5379', name: 'Set Med Resväskor, S/M/L' },
    { id: '68be85b1094d08828def537a', name: 'Swift L' },
    { id: '68be85b1094d08828def537b', name: 'Rullväska Vienna' },
    { id: '68be85b1094d08828def537c', name: 'Kabinväska Monza' },
    { id: '68be85b1094d08828def537d', name: 'Resväska Bogi S' },
    { id: '68be85b1094d08828def537e', name: 'Set med resväskor, S/M/L' },
    { id: '68be85bf094d08828def8074', name: 'Escape Handle Wrap' },
    { id: '68be85bf094d08828def8075', name: 'Trolley/kabinväska i hårdplast, Verona' },
    { id: '68be85bf094d08828def8076', name: 'Multi Line Trolley 20"' },
    { id: '68be85bf094d08828def8077', name: 'Escape Carry-On Wheelie' },
    { id: '68be85bf094d08828def8137', name: 'Oxfort Trolley' },
    { id: '68be85bf094d08828def8138', name: 'Kabinväska. 55 cm 4 Hjul' },
    { id: '68be85bf094d08828def813a', name: 'Kabinväska 54cm 4 dubbelhjul' },
    { id: '68be85bf094d08828def813b', name: 'Kabinväska. 54 cm 4 hjul' },
    { id: '68be85bf094d08828def813c', name: 'Resväska 75 cm. 4 dubbelhjul. Expanderbar.' },
    { id: '68be85bf094d08828def81e5', name: 'Resväska. 66 cm 4 Hjul' },
    { id: '68be85bf094d08828def81e6', name: 'Set med resväskor / Trolleyset 3 delar S/M/L' },
    { id: '68be85bf094d08828def81e7', name: 'Kabinväska Lucca' },
    { id: '68be85bf094d08828def81e8', name: 'Kabinväska/trolley i ABS Alaric' },
    { id: '68be85bf094d08828def81e9', name: 'OSL, kabinväska 55 cm' },
    { id: '68be85bf094d08828def81ea', name: 'Resväska 67 cm, 4 hjul, Lyxig inredning, Expanderbar' },
    { id: '68be85bf094d08828def81eb', name: 'Set Med Resväskor, S/M/L' },
    { id: '68be85bf094d08828def81ec', name: 'OSL, kabinväska 55 cm laptop' },
    { id: '68be85bf094d08828def81ed', name: 'Kabinväska. 67 cm 4 Hjul' },
    { id: '68be85bf094d08828def81ee', name: 'Resväska Bogi XL' },
    { id: '68be85bf094d08828def81ef', name: 'Kabinväska Padua' },
    { id: '68be85bf094d08828def827f', name: 'Kabinväska Galway' },
    { id: '68be85bf094d08828def8280', name: 'Set med resväskor, S/M/L' },
    { id: '68be85bf094d08828def8281', name: 'Ryggsäck Trailer' },
    { id: '68be85bf094d08828def8282', name: 'Rullväska Vienna' },
    { id: '68be85bf094d08828def8283', name: 'Kabinväska Monza' },
    { id: '68be85bf094d08828def8284', name: 'Kabinväska 54 cm, 65 cm, 76 cm 4 hjul' },
    { id: '68be85bf094d08828def8285', name: 'Set med resväskor / Trolleyset 3 delar S/M/L' },
    { id: '68be85bf094d08828def8286', name: 'Set med resväskor, S/M/L' },
    { id: '68be85bf094d08828def8288', name: 'Airmile RPET handbagage' },
    { id: '68be85c2094d08828def8be9', name: 'Ryggsäck Trailer' },
    { id: '68be85ca094d08828defaaff', name: 'Resväska Dublin' },
    // ... and 42 more products
  ],

  // inredning (141 products)
  'inredning': [
    { id: '68be85ad094d08828def484e', name: 'NESBIT II. Bärbar skrivbordslampa med klämma och 30 timmars autonomi vid 65 % rABS' },
    { id: '68be85ad094d08828def48c8', name: 'Fraga Doftpinnar' },
    { id: '68be85b0094d08828def4f5e', name: 'Pier portable LED lampa H 25 cm' },
    { id: '68be85b0094d08828def4f66', name: 'Solis oljelampa inkl. 2-pack oljeljus' },
    { id: '68be85b0094d08828def4f91', name: 'Woodify Trofé med LED-ljus, anpassad form' },
    { id: '68be85b0094d08828def4ff3', name: 'Pier portable LED lampa H 33.5 cm' },
    { id: '68be85b0094d08828def512f', name: 'Knos - Luftfuktare med vaniljdoft' },
    { id: '68be85b0094d08828def516d', name: 'Noiroma - Luftfuktare med vaniljdoft' },
    { id: '68be85b1094d08828def538c', name: 'Bordslampa i metall Fiorella' },
    { id: '68be85b1094d08828def539c', name: 'Eliza Dukset 1+6' },
    { id: '68be85b2094d08828def5585', name: 'Ukiyo gåvoset' },
    { id: '68be85b2094d08828def5586', name: 'Noiroma - Luftfuktare med vaniljdoft' },
    { id: '68be85b2094d08828def5593', name: 'Prixton Prado 10 tum Frameo digital fotoram med wifi' },
    { id: '68be85b2094d08828def5598', name: 'Eliza Dukset 1+6' },
    { id: '68be85b2094d08828def559a', name: 'Eliza Dukset 1+12' },
    { id: '68be85b2094d08828def559c', name: 'Knabstrup vas H 27 cm ripple' },
    { id: '68be85b2094d08828def559d', name: 'Knabstrup vas H 27 cm' },
    { id: '68be85b2094d08828def559e', name: 'Knabstrup vas H 20 cm ripple' },
    { id: '68be85b2094d08828def559f', name: 'Knabstrup vas H 12.5 cm ripple' },
    { id: '68be85b2094d08828def55a0', name: 'Knabstrup vas H 20 cm' },
    { id: '68be85b2094d08828def55a1', name: 'Knabstrup mini vas 3 Stk ripple' },
    { id: '68be85b2094d08828def55aa', name: 'Kooduu Fokus bärbar lampa' },
    { id: '68be85b2094d08828def55ab', name: 'Kooduu Loome bärbar lampa' },
    { id: '68be85b2094d08828def55ac', name: 'Flexilight - Boklampa' },
    { id: '68be85b2094d08828def5615', name: 'NESBIT II. Bärbar skrivbordslampa med klämma och 30 timmars autonomi vid 65 % rABS' },
    { id: '68be85b2094d08828def5616', name: 'Cosiscoop Original Gaslykta' },
    { id: '68be85b2094d08828def5617', name: 'Wooosh Luce RCS Table Light lampa' },
    { id: '68be85b2094d08828def5618', name: 'Lampa ABS' },
    { id: '68be85b2094d08828def5656', name: 'Woodify Trofé med LED-ljus, anpassad form' },
    { id: '68be85b2094d08828def5657', name: 'Mini Cappie Set' },
    { id: '68be85b2094d08828def5658', name: 'Cooper Cappie' },
    { id: '68be85b2094d08828def5659', name: 'Xmas Cooper' },
    { id: '68be85b2094d08828def565a', name: 'X-mas Cappie Treetopper' },
    { id: '68be85b2094d08828def5685', name: 'Hedy Hjärta' },
    { id: '68be85ba094d08828def721f', name: 'Woodify Trofé med LED-ljus, anpassad form' },
    { id: '68be85be094d08828def7dcb', name: 'InSideOut Dimbar LED-lampa med blåssensor' },
    { id: '68be85c9094d08828defa79b', name: 'Orrefors Ensemble vas rökblå/grå 60mm' },
    { id: '68be85c9094d08828defa7a0', name: 'Orrefors Ensemble vas brun/grå 220mm' },
    { id: '68be85c9094d08828defa7a2', name: 'Orrefors Ensemble vas blå/grå 150mm' },
    { id: '68be85c9094d08828defa7df', name: 'Orrefors Reed vas mossgrön 300mm' },
    { id: '68be85c9094d08828defa7e0', name: 'Viva vas mini (6) Klar' },
    { id: '68be85c9094d08828defa801', name: 'Kosta boda What"s up? nothing much, ff ac-17' },
    { id: '68be85c9094d08828defa812', name: 'Orrefors Reed vas 175mm' },
    { id: '68be85c9094d08828defa813', name: 'Orrefors Reed vas mossgrön 175mm' },
    { id: '68be85c9094d08828defa814', name: 'Orrefors Reed vas 300mm' },
    { id: '68be85c9094d08828defa815', name: 'Orrefors Reed vas mossgrön 500mm' },
    { id: '68be85c9094d08828defa816', name: 'Orrefors Reed vas 500mm' },
    { id: '68be85c9094d08828defa817', name: 'Viva vas mini (6) Amber' },
    { id: '68be85c9094d08828defa819', name: 'Viva vas stor (4) Klar' },
    { id: '68be85c9094d08828defa81b', name: 'Viva vas stor (4) Amber' },
    { id: '68be85c9094d08828defa834', name: 'Wooosh Lumira Touch Light lampa' },
    { id: '68be85c9094d08828defa835', name: 'PE Lampa' },
    { id: '68be85c9094d08828defa836', name: 'Skrivbordslampa Fresh Light' },
    { id: '68be85c9094d08828defa837', name: 'Trådlös lampa (dimbar)' },
    { id: '68be85c9094d08828defa838', name: 'Bordslampa' },
    { id: '68be85c9094d08828defa83a', name: 'Strimma - Bordslampa' },
    { id: '68be85c9094d08828defa83b', name: 'Wooosh Luzia RCS Table Lightlampa' },
    { id: '68be85c9094d08828defa83c', name: 'Grundig Lumo Colour Mood bordslampa' },
    { id: '68be85c9094d08828defa83d', name: 'Wooosh Batam Light Light uppladdningsbar lampa' },
    { id: '68be85c9094d08828defa83e', name: 'Gusta solcellsbordslampa' },
    { id: '68be85c9094d08828defa83f', name: 'Halo MoodLight lampa' },
    { id: '68be85c9094d08828defa840', name: 'ChangingColours lampa' },
    { id: '68be85c9094d08828defa863', name: 'Top vas stor (4) Klar/guld' },
    { id: '68be85c9094d08828defa864', name: 'Edith duk' },
    { id: '68be85c9094d08828defa866', name: 'Upphängningstavla Trä' },
    { id: '68be85c9094d08828defa867', name: 'Displayställ Trä' },
    { id: '68be85c9094d08828defa868', name: 'Tavla Trä' },
    { id: '68be85c9094d08828defa8ab', name: 'Moon vas stor (6) Sand' },
    { id: '68be85c9094d08828defa8b4', name: 'Wooosh Senang Car Freshner bilparfym' },
    { id: '68be85c9094d08828defa8b5', name: 'Mini Fragrance Sticks' },
    { id: '68be85c9094d08828defa8b6', name: 'Fragrance Sticks' },
    { id: '68be85c9094d08828defa8b7', name: 'Fragrance Sticks' },
    { id: '68be85c9094d08828defa8b8', name: 'Fragrance Sticks' },
    { id: '68be85c9094d08828defa8b9', name: 'Fragrance Sticks' },
    { id: '68be85c9094d08828defa8ba', name: 'Fragrance Sticks' },
    { id: '68be85c9094d08828defa8bb', name: 'Fragrance Sticks' },
    { id: '68be85c9094d08828defa8bc', name: 'Mini Fragrance Sticks' },
    { id: '68be85c9094d08828defa8bd', name: 'Fragrance Sticks' },
    { id: '68be85ca094d08828defa8e6', name: 'Grundig Aroma Diffusor aromförstärkare' },
    { id: '68be85ca094d08828defa8e7', name: 'Grundig Aroma Wood Diffusor aromförstärkare' },
    { id: '68be85cb094d08828defaeb7', name: 'Fotoram i bambu Lawson' },
    { id: '68be85cb094d08828defaf4a', name: 'Margarita barbordslampa' },
    { id: '68be85cb094d08828defb01b', name: 'Bedtime uppladdningsbar boklampa' },
    { id: '68be85cc094d08828defb17f', name: 'Flanagan barbordslampa' },
    { id: '68be85cd094d08828defb4fb', name: 'Vanitim aromdiffusor' },
    { id: '68be85cd094d08828defbcc2', name: 'Woodiframe Trofé med LED-ljus' },
    { id: '68be85ce094d08828defc2b6', name: 'Magnolia - Luftfuktare med vaniljdoft' },
    { id: '68be85cf094d08828defc65c', name: 'Lumitree - Bordslampa LED, julgran' },
    { id: '68be85d0094d08828defc9c9', name: 'P Gucci For Peace 30 Cm' },
    { id: '68be85d0094d08828defc9ca', name: 'Peace N Luv 19 Cm' },
    { id: '68be85d0094d08828defc9d0', name: 'Drive For Peace 30 Cm' },
    { id: '68be85d0094d08828defc9d4', name: 'Fragility Of Peace 30 Cm' },
    { id: '68be85d0094d08828defcacb', name: 'Lumistar - Bordslampa LED, stjärna' },
    { id: '68be85d0094d08828defcb2a', name: 'P Gucci For Peace 100 Cm' },
    { id: '68be85d0094d08828defcb2c', name: 'Soft Black 19 Cm' },
    { id: '68be85d0094d08828defcb2d', name: 'Soft Black 30 Cm' },
    { id: '68be85d0094d08828defcb32', name: 'P Gucci For Peace 19 Cm' },
    { id: '68be85d0094d08828defcb38', name: 'Peace N Luv 40 Cm' },
    { id: '68be85d0094d08828defcb3f', name: 'Punch For Peace 30 Cm' },
    { id: '68be85d0094d08828defcb49', name: 'Imagine 30 Cm' },
    // ... and 41 more products
  ],

  // shoulder-bags (138 products)
  'shoulder-bags': [
    { id: '68be85ad094d08828def4751', name: 'Florens, datorväska 15"' },
    { id: '68be85ad094d08828def4754', name: 'Florens, datorväska 13"' },
    { id: '68be85ad094d08828def4768', name: 'Escape, sling bag Bergen' },
    { id: '68be85ad094d08828def4803', name: 'Flight, crossbody' },
    { id: '68be85ad094d08828def4804', name: 'Duffy, crossover' },
    { id: '68be85ad094d08828def4809', name: 'Florens, axelväska 15,6"' },
    { id: '68be85ad094d08828def480a', name: 'Escape, crossover Bergen' },
    { id: '68be85ad094d08828def480b', name: 'Duffy, flapbag' },
    { id: '68be85ad094d08828def480d', name: 'Florens, cityväska' },
    { id: '68be85ad094d08828def480f', name: 'Duffy, phonebag' },
    { id: '68be85ad094d08828def4813', name: 'Escape, crossover Bergen' },
    { id: '68be85ad094d08828def4816', name: 'Escape, crossover Bergen' },
    { id: '68be85ad094d08828def4824', name: 'Duffy, crossover' },
    { id: '68be85ad094d08828def488c', name: 'Escape, tote bag Dull rubber PU' },
    { id: '68be85ad094d08828def4891', name: 'Duffy, crossover' },
    { id: '68be85af094d08828def4bc7', name: 'SuboBag Crossbody Väska' },
    { id: '68be85b0094d08828def5094', name: 'Korovin Pouch - Cross body RPET väska' },
    { id: '68be85b0094d08828def50fb', name: 'Korovin Cross - Crossover väska i 400D oxford' },
    { id: '68be85b0094d08828def5126', name: 'Axelväska i polyester RPET (600D) Gracelyn' },
    { id: '68be85b0094d08828def5174', name: 'Axelväska i polyester (600D) Bria' },
    { id: '68be85bf094d08828def7ff8', name: 'Retrend RPET-axelväska 6L' },
    { id: '68be85bf094d08828def80ae', name: 'Impact AWARE laptopväska i 16 oz. återvunnen canvas' },
    { id: '68be85bf094d08828def816f', name: 'Metro axelrems-/dokumentväska' },
    { id: '68be85bf094d08828def828a', name: 'Impact AWARE 300D two tone lyxig 15.6" laptopväska' },
    { id: '68be85bf094d08828def828c', name: 'Impact AWARE laptopväska i 16 oz. återvunnen canvas' },
    { id: '68be85bf094d08828def828d', name: 'Byron axelremsväska av GRS-återvunnet material, 2 l' },
    { id: '68be85bf094d08828def828f', name: 'Crescent AWARE RPET Halvmåneformad crossbody-väska' },
    { id: '68be85bf094d08828def8290', name: 'Bellroy Lite väska' },
    { id: '68be85bf094d08828def8291', name: 'Aero Aware RPET Every day slingväska' },
    { id: '68be85bf094d08828def8292', name: 'Renew AWARE rPET slingväska' },
    { id: '68be85bf094d08828def8294', name: 'Crescent XL AWARE RPET slingväska' },
    { id: '68be85bf094d08828def8295', name: 'Trip Aware axelremsväska av återvunnet material på 1 l' },
    { id: '68be85bf094d08828def8296', name: 'Crescent 500 g/m² axelremsväska av Aware-återvunnet material' },
    { id: '68be85bf094d08828def8297', name: 'Korovin Pouch - Cross body RPET väska' },
    { id: '68be85bf094d08828def8298', name: 'Korovin Cross - Crossover väska i 400D oxford' },
    { id: '68be85bf094d08828def8299', name: 'Canvasbag Trip Recycle' },
    { id: '68be85bf094d08828def8312', name: 'Retro Shoulder Bag' },
    { id: '68be85bf094d08828def8315', name: 'Retro Messenger' },
    { id: '68be85bf094d08828def8316', name: 'Florens, datorväska 13"' },
    { id: '68be85bf094d08828def8317', name: 'Datorväska Executive Office' },
    { id: '68be85bf094d08828def8318', name: 'Kurirväska' },
    { id: '68be85bf094d08828def8319', name: 'Cross Body Bag' },
    { id: '68be85bf094d08828def831a', name: 'Messenger Bag' },
    { id: '68be85bf094d08828def831b', name: 'Metro axelrems-/dokumentväska' },
    { id: '68be85bf094d08828def831c', name: 'Retro Bowling Bag' },
    { id: '68be85bf094d08828def831d', name: 'Axelremsväska Portfolio' },
    { id: '68be85bf094d08828def831e', name: 'Axelremsväska Heritage Waxed Canvas' },
    { id: '68be85bf094d08828def831f', name: 'Axelremsväska Vintage Canvas Mini Reporter' },
    { id: '68be85bf094d08828def8321', name: 'SEOUL. 600D konferensmapp' },
    { id: '68be85c0094d08828def83c8', name: 'LAHORE. 600D axelväska' },
    { id: '68be85c0094d08828def83c9', name: 'Boutique Weekender' },
    { id: '68be85c0094d08828def83cb', name: 'Boutique Soft Cross Body Bag' },
    { id: '68be85c0094d08828def83cc', name: 'Vintage Canvas Despatch Bag' },
    { id: '68be85c0094d08828def83cd', name: 'Crossbody-väska R-PET 5L' },
    { id: '68be85c0094d08828def83ce', name: 'Axelremsväska 280g/m² 32x13x40 cm bomull OEKO-TEX®' },
    { id: '68be85c0094d08828def83d0', name: 'Escape, sling bag Bergen' },
    { id: '68be85c0094d08828def83d1', name: 'Matte PU Cross Body Bag' },
    { id: '68be85c0094d08828def83d2', name: 'Flight, crossbody' },
    { id: '68be85c0094d08828def83d3', name: 'Axelväska i polyester RPET (600D) Gracelyn' },
    { id: '68be85c0094d08828def8459', name: 'Duffy, crossover' },
    { id: '68be85c0094d08828def845a', name: 'Duffy, flapbag' },
    { id: '68be85c0094d08828def845b', name: 'Axelväska i polyester (600D) Bria' },
    { id: '68be85c0094d08828def845c', name: 'Florens, cityväska' },
    { id: '68be85c0094d08828def845d', name: 'Duffy, phonebag' },
    { id: '68be85c0094d08828def845e', name: 'Axelremsväska Near By' },
    { id: '68be85c0094d08828def845f', name: 'Escape, crossover Bergen' },
    { id: '68be85c0094d08828def8460', name: 'PU-belagd R-PET 600D Crossbody-väska' },
    { id: '68be85c0094d08828def8461', name: 'Escape, crossover Bergen' },
    { id: '68be85c0094d08828def8462', name: 'Axelremsväska Clever' },
    { id: '68be85c0094d08828def8463', name: 'Duffy, crossover' },
    { id: '68be85c0094d08828def8464', name: 'Väska Twin' },
    { id: '68be85c0094d08828def8465', name: 'Escape, tote bag Dull rubber PU' },
    { id: '68be85c0094d08828def8466', name: 'Väska Easy' },
    { id: '68be85c0094d08828def8468', name: 'Axelremsväska City' },
    { id: '68be85c0094d08828def84d4', name: 'SuboBag Crossbody Väska' },
    { id: '68be85c0094d08828def84d5', name: 'SuboBag Fiesta crossbody-väska med tryck' },
    { id: '68be85c0094d08828def85dd', name: 'Datorväska Executive Office' },
    { id: '68be85cb094d08828defafb5', name: 'Melerad axelväska (500D) Tom' },
    { id: '68be85cc094d08828defb0c1', name: 'Skulderväska i Polyester (900D) Dean' },
    { id: '68be85cc094d08828defb0ca', name: 'BrandCharger Crosspack axelremsväska' },
    { id: '68be85cd094d08828defb8da', name: 'Original Retro Bowling Bag' },
    { id: '68be85cd094d08828defb8db', name: 'Axelremsväska' },
    { id: '68be85cd094d08828defb8f7', name: 'Axelväska' },
    { id: '68be85cd094d08828defb8f8', name: 'Case Logic ERA DSLR axelremsväska för kamera. Obsidian' },
    { id: '68be85cd094d08828defb8f9', name: 'Tailored Luxe Briefcase' },
    { id: '68be85cd094d08828defb90f', name: 'Axelväska Nuhide Messenger' },
    { id: '68be85cd094d08828defb910', name: 'Datorväska NuHide Slimline' },
    { id: '68be85cd094d08828defbcfc', name: 'Väska i rPET (600D) Carl' },
    { id: '68be85cd094d08828defc036', name: 'BrandCharger Solo crossbody-väska' },
    { id: '68be85ce094d08828defc41b', name: 'Day - Cross-over väska i mjuk PU' },
    { id: '68be85cf094d08828defc7d8', name: 'SuboCarry anpassad axelrem' },
    { id: '68be85d0094d08828defcd4e', name: 'CreaFelt Cross RPET Crossbody Väska' },
    { id: '68be85d1094d08828defd001', name: 'Axelremsväska i polyester Caden' },
    { id: '68be85d1094d08828defd14e', name: 'Small Messenger Bag - Philadelphia' },
    { id: '68be85d1094d08828defd15a', name: 'Laptop Bag - San Francisco' },
    { id: '68be85d1094d08828defd160', name: 'Festival Bag 1 - Palm Springs' },
    { id: '68be85d1094d08828defd162', name: 'Small Messenger Bag - Vancouver' },
    { id: '68be85d2094d08828defd2b0', name: 'Case Logic Era DSLR / Spegellös kameraväska. Grå' },
    { id: '68be85d2094d08828defd34c', name: 'Tote Bags' },
    { id: '68be85d2094d08828defd38f', name: 'Case Logic Era Camera Pouch. Grå' },
    // ... and 38 more products
  ],

  // sunglasses (128 products)
  'sunglasses': [
    { id: '68be85ad094d08828def478c', name: 'Yuma - Sportsolglasögon UV400' },
    { id: '68be85ad094d08828def48e4', name: 'Uluwatu RPET solglasögon' },
    { id: '68be85b0094d08828def507c', name: 'Solglasögon av RPC Angel' },
    { id: '68be85b0094d08828def50be', name: 'Solglasögon av ABS och bambu Luis' },
    { id: '68be85be094d08828def7cdd', name: 'Solglasögon Sun ray med tryck' },
    { id: '68be85be094d08828def7cde', name: 'Solglasögon Sun Ray Kontrast med tryck' },
    { id: '68be85be094d08828def7cdf', name: 'Sun Ray rPET solglasögon' },
    { id: '68be85be094d08828def7ce1', name: 'Sun Ray solglasögon i bambu' },
    { id: '68be85be094d08828def7ce5', name: 'Tan solglasögon med skalmar av bambu' },
    { id: '68be85be094d08828def7ce6', name: 'America - Solglasögon med UV skydd' },
    { id: '68be85be094d08828def7ce8', name: 'America Touch - Solglasögon med spegellins.' },
    { id: '68be85be094d08828def7ce9', name: 'Aloha - Solglasögon med spegelglas' },
    { id: '68be85be094d08828def7ced', name: 'Macusa - Solglasögon i RPET' },
    { id: '68be85be094d08828def7cee', name: 'Rhodos - Solglasögon med bambuskalmar' },
    { id: '68be85be094d08828def7cef', name: 'Honiara - Solglasögon i bambu med påse' },
    { id: '68be85be094d08828def7cf5', name: 'Yuma - Sportsolglasögon UV400' },
    { id: '68be85be094d08828def7e3b', name: 'SunPro Solglasögon' },
    { id: '68be85be094d08828def7e3c', name: 'Faro - Solglasögon' },
    { id: '68be85be094d08828def7e3d', name: 'CELEBES. PC solglasögon' },
    { id: '68be85be094d08828def7e3e', name: 'Porto - Solglasögon' },
    { id: '68be85be094d08828def7e3f', name: 'Solglasögon Bradley Transparent UV-400' },
    { id: '68be85be094d08828def7e40', name: 'Fiesta solglasögon' },
    { id: '68be85be094d08828def7e41', name: 'Solglasögon UV400 PC och PVC Kenzie' },
    { id: '68be85be094d08828def7e42', name: 'Solglasögon Earth' },
    { id: '68be85be094d08828def7e43', name: 'Malibu solglasögon' },
    { id: '68be85be094d08828def7ec1', name: 'Färgskiftande solglasögon' },
    { id: '68be85be094d08828def7ec2', name: 'Amina - Solglasögon' },
    { id: '68be85be094d08828def7ec3', name: 'Justin RPC Solglasögon UV400' },
    { id: '68be85be094d08828def7ec4', name: 'Nice solglasögon med logo' },
    { id: '68be85be094d08828def7ec5', name: 'Monaco Solglasögon med logo' },
    { id: '68be85be094d08828def7ec6', name: 'Tim - Solglasögon' },
    { id: '68be85be094d08828def7ec7', name: 'Marseille solglasögon med logo' },
    { id: '68be85be094d08828def7ec8', name: 'Solglasögon av RPC Angel' },
    { id: '68be85be094d08828def7f1b', name: 'Cannes Solglasögon med logo' },
    { id: '68be85be094d08828def7f1c', name: 'Marina GRS Recycled PC solglasögon' },
    { id: '68be85be094d08828def7f1d', name: 'Påse med tryck till solglasögon' },
    { id: '68be85be094d08828def7f1e', name: 'Arugam solglasögon' },
    { id: '68be85be094d08828def7f1f', name: 'Solglasögon med epoxi skalm' },
    { id: '68be85be094d08828def7f20', name: 'Colobus solglasögon' },
    { id: '68be85be094d08828def7f21', name: 'CreaClean Mikrofiberduk för glasögon' },
    { id: '68be85be094d08828def7f7f', name: 'Java solglasögon' },
    { id: '68be85be094d08828def7f80', name: 'Nazare' },
    { id: '68be85be094d08828def7f81', name: 'Uluwatu RPET solglasögon' },
    { id: '68be85cd094d08828defb976', name: 'Bisight glasögonduk' },
    { id: '68be85cd094d08828defb977', name: 'Solglasögon Bambu' },
    { id: '68be85cd094d08828defb978', name: 'L387' },
    { id: '68be85cd094d08828defb979', name: 'Norr Gunnar Beige' },
    { id: '68be85cd094d08828defb97a', name: 'Norr Carl' },
    { id: '68be85cd094d08828defb97b', name: 'L320' },
    { id: '68be85cd094d08828defb97c', name: 'L357' },
    { id: '68be85cd094d08828defb996', name: 'L381' },
    { id: '68be85cd094d08828defb997', name: 'Norr Gorm Brown' },
    { id: '68be85cd094d08828defb998', name: 'L306' },
    { id: '68be85cd094d08828defb999', name: 'L321' },
    { id: '68be85cd094d08828defb99a', name: 'L307' },
    { id: '68be85cd094d08828defb99b', name: 'Solglasögon' },
    { id: '68be85cd094d08828defb99c', name: 'Looking Bamboo solglasögon' },
    { id: '68be85cd094d08828defb99d', name: 'Looking Wood solglasögon' },
    { id: '68be85cd094d08828defb99f', name: 'Rainbow solglasögon' },
    { id: '68be85cd094d08828defb9c7', name: 'Wayfarer Memphis' },
    { id: '68be85cd094d08828defb9c8', name: 'Solglasögon Sport' },
    { id: '68be85cd094d08828defb9c9', name: 'Pilot Parker' },
    { id: '68be85cd094d08828defb9cd', name: 'L383' },
    { id: '68be85cd094d08828defbfaf', name: 'PrintSun RPET-band för solglasögon med tryck' },
    { id: '68be85ce094d08828defc2c3', name: 'Solglasögon av ABS och bambu Jaxon' },
    { id: '68be85d0094d08828defc94f', name: 'Glasögonfodral, hårt Schwarzwolf Arkansas' },
    { id: '68be85d0094d08828defccd4', name: 'Solglasögon Schwarzwolf Mahaveli' },
    { id: '68be85d0094d08828defcd8e', name: 'Solglasögon Schwarzwolf IRAVADI sport' },
    { id: '68be85d1094d08828defce69', name: 'Glaffel RPET solglasögonfodral' },
    { id: '68be85d1094d08828defd021', name: 'SANIBEL. Solglasögon i bambu' },
    { id: '68be85d1094d08828defd05e', name: 'CreaFelt Sun RPET solglasögonfodral med tryck' },
    { id: '68be85d3094d08828defdb65', name: 'Nirson - Glasögonfodral i RPET-filt' },
    { id: '68be85d4094d08828defdbc1', name: 'TOBOL. Non-woven glasögonfodral (80 g/m²)' },
    { id: '68be85d4094d08828defdbc3', name: 'VARADERO. PP och bambu solglasögon' },
    { id: '68be85d4094d08828defdbcb', name: 'Wanaka - Solglasögon och fodral i bambu' },
    { id: '68be85d4094d08828defdd54', name: 'Paloma - Solglasögon med korkbåge' },
    { id: '68be85d4094d08828defdd76', name: 'Adam - Solglasögon' },
    { id: '68be85d4094d08828defde78', name: 'Woodie - Solglasögon' },
    { id: '68be85d4094d08828defde87', name: 'Alissa - Solglasögon' },
    { id: '68be85d4094d08828defdea6', name: 'Anna - Solglasögon' },
    { id: '68be85d4094d08828defdf48', name: 'Mira solglasögon med design i trälook' },
    { id: '68be85d4094d08828defdf64', name: 'CREASUN - Specialdesignade solglasögon' },
    { id: '68be85d4094d08828defe0e8', name: 'Arlo solglasögon av bambu med svart ytbeläggning' },
    { id: '68be85d4094d08828defe126', name: 'Star - Solglasögon' },
    { id: '68be85de094d08828df00761', name: 'Sun Ray rPET solglasögon' },
    { id: '68be85de094d08828df00862', name: 'Solglasögon Earth' },
    { id: '68be85de094d08828df0086d', name: 'Malibu RPET solglasögon' },
    { id: '68be85de094d08828df0094b', name: 'Havana solglasögon' },
    { id: '68be85de094d08828df00a08', name: 'Colobus solglasögon' },
    { id: '68be85df094d08828df00aa1', name: 'Java solglasögon' },
    { id: '68be85e0094d08828df00ef5', name: 'SunPro Solglasögon' },
    { id: '68be85e0094d08828df00fc4', name: 'Malibu RPET solglasögon' },
    { id: '68be85e0094d08828df00fc9', name: 'Feltro GRS RPET Pouch glasögonfodral' },
    { id: '68be85e2094d08828df01398', name: 'Solglasögon Justin UV400' },
    { id: '68be85e2094d08828df0139a', name: 'Solglasögon Jeffrey' },
    { id: '68be85e2094d08828df013a5', name: 'Solglasögon Bradley Transparent UV-400' },
    { id: '68be85e2094d08828df01496', name: 'Solglasögon Earth' },
    { id: '68be85e2094d08828df014a0', name: 'Solglasögon bradley' },
    { id: '68be85e2094d08828df0150b', name: 'Marina GRS Recycled PC solglasögon' },
    { id: '68be85e2094d08828df0160a', name: 'Solglasögon neon' },
    // ... and 28 more products
  ],

  // t-shirts (128 products)
  't-shirts': [
    { id: '68be85af094d08828def4d41', name: 'B&C T-shirt 190 Herr' },
    { id: '68be85af094d08828def4d42', name: 'B&C T-shirt 150 Herr' },
    { id: '68be85af094d08828def4d43', name: 'B&C T-shirt 150 Dam' },
    { id: '68be85af094d08828def4d44', name: 'B&C T-shirt 190 Dam' },
    { id: '68be85af094d08828def4d45', name: 'B&C T-shirt Inspire Herr' },
    { id: '68be85af094d08828def4d46', name: 'B&C T-shirt Inspire Dam' },
    { id: '68be85af094d08828def4d47', name: 'B&C T-shirt Exact 150 Barn' },
    { id: '68be85af094d08828def4d49', name: 'B&C T-shirt Triblend Herr' },
    { id: '68be85af094d08828def4d4a', name: 'B&C Långärmad T-shirt 190 Dam' },
    { id: '68be85af094d08828def4d4b', name: 'B&C T-shirt Triblend Dam' },
    { id: '68be85af094d08828def4d4d', name: 'B&C Ekologisk Långärmad T-shirt Dam' },
    { id: '68be85af094d08828def4d4e', name: 'B&C V-ringad T-shirt Triblend Herr' },
    { id: '68be85af094d08828def4d4f', name: 'B&C T-shirt Inspire Plus Herr' },
    { id: '68be85af094d08828def4d50', name: 'B&C T-shirt Inspire Plus Dam' },
    { id: '68be85af094d08828def4d51', name: 'B&C Ekologisk T-shirt Herr' },
    { id: '68be85af094d08828def4d52', name: 'B&C T-shirt DNM Herr' },
    { id: '68be85af094d08828def4d53', name: 'B&C V-ringad T-shirt Triblend Dam' },
    { id: '68be85af094d08828def4d54', name: 'B&C Ekologisk V-ringad T-shirt Herr' },
    { id: '68be85af094d08828def4d56', name: 'B&C Ekologisk V-ringad T-shirt Herr' },
    { id: '68be85af094d08828def4d57', name: 'B&C T-shirt DNM Dam' },
    { id: '68be85b2094d08828def583b', name: 'B&C T-shirt Exact 150 Barn' },
    { id: '68be85b2094d08828def583e', name: 'Cottover Ekologisk T-shirt Barn' },
    { id: '68be85b2094d08828def5842', name: 'T-shirt Auckland Barn' },
    { id: '68be85b2094d08828def5851', name: 'B&C T-shirt Exact 150 Barn' },
    { id: '68be85b2094d08828def587a', name: 'Cottover Långärmad T-shirt Herr' },
    { id: '68be85b2094d08828def5887', name: 'Ekologisk V-ringad T-shirt Kawartha Dam' },
    { id: '68be85b2094d08828def5888', name: 'Balfour ekologisk kortärmad t-shirt herr' },
    { id: '68be85b2094d08828def5891', name: 'Cottover T-shirt Herr' },
    { id: '68be85b2094d08828def5892', name: 'Cottover T-shirt Dam' },
    { id: '68be85b2094d08828def5893', name: 'B&C T-shirt Inspire Herr' },
    { id: '68be85b2094d08828def5894', name: 'B&C T-shirt Inspire Dam' },
    { id: '68be85b2094d08828def5896', name: 'Cottover V-ringad T-shirt Dam' },
    { id: '68be85b2094d08828def5897', name: 'Cottover Långärmad T-shirt Herr' },
    { id: '68be85b2094d08828def5898', name: 'Cottover Ekologisk T-shirt Barn' },
    { id: '68be85b4094d08828def5fcb', name: 'Funktions T-shirt Niagara Herr' },
    { id: '68be85b4094d08828def5fcc', name: 'Funktions T-shirt Niagara Dam' },
    { id: '68be85b5094d08828def63a1', name: 'Cottover Långärmad T-shirt Dam' },
    { id: '68be85b5094d08828def63a5', name: 'Cottover Långärmad T-shirt Herr' },
    { id: '68be85b5094d08828def645a', name: 'Cottover Långärmad T-shirt Dam' },
    { id: '68be85b5094d08828def6462', name: 'B&C Långärmad T-shirt 190 Dam' },
    { id: '68be85b6094d08828def664a', name: 'James Harvest - American U' },
    { id: '68be85b6094d08828def664b', name: 'James Harvest - American U Woman' },
    { id: '68be85b6094d08828def664c', name: 'James Harvest - Whailford Woman' },
    { id: '68be85b6094d08828def664d', name: 'James Harvest - Twoville' },
    { id: '68be85b6094d08828def664e', name: 'James Harvest - American V' },
    { id: '68be85b6094d08828def664f', name: 'James Harvest - Devons' },
    { id: '68be85b6094d08828def6650', name: 'James Harvest - Walcott  Woman' },
    { id: '68be85b6094d08828def6651', name: 'James Harvest - Scarsdale T-shirt Women' },
    { id: '68be85b6094d08828def6652', name: 'James Harvest - Scarsdale T-shirt Men' },
    { id: '68be85b7094d08828def66f3', name: 'Cottover T-shirt Dam' },
    { id: '68be85b7094d08828def66f6', name: 'Cottover T-shirt Herr' },
    { id: '68be85b7094d08828def66f7', name: 'Cottover Långärmad T-shirt Dam' },
    { id: '68be85b7094d08828def66f8', name: 'Cottover Långärmad T-shirt Herr' },
    { id: '68be85b7094d08828def66f9', name: 'Cottover Ekologisk V-ringad T-shirt Herr' },
    { id: '68be85b7094d08828def66fa', name: 'Cottover Ekologisk T-shirt Stretch Herr' },
    { id: '68be85b7094d08828def671b', name: 'Ekologisk V-ringad T-shirt Kawartha Dam' },
    { id: '68be85b7094d08828def671c', name: 'Balfour ekologisk kortärmad t-shirt herr' },
    { id: '68be85b7094d08828def6725', name: 'Cottover T-shirt Dam' },
    { id: '68be85b7094d08828def6726', name: 'Cottover T-shirt Herr' },
    { id: '68be85b7094d08828def6727', name: 'B&C T-shirt Inspire Dam' },
    { id: '68be85b7094d08828def6728', name: 'B&C T-shirt Inspire Herr' },
    { id: '68be85b7094d08828def6729', name: 'Cottover V-ringad T-shirt Dam' },
    { id: '68be85b7094d08828def672a', name: 'Cottover Långärmad T-shirt Dam' },
    { id: '68be85b7094d08828def672b', name: 'Cottover Långärmad T-shirt Herr' },
    { id: '68be85b7094d08828def672e', name: 'B&C Ekologisk T-shirt Herr' },
    { id: '68be85b7094d08828def6735', name: 'Cottover T-shirt Dam' },
    { id: '68be85b7094d08828def6736', name: 'Cottover T-shirt Herr' },
    { id: '68be85b7094d08828def6737', name: 'Cottover V-ringad T-shirt Dam' },
    { id: '68be85b7094d08828def6738', name: 'Cottover Långärmad T-shirt Dam' },
    { id: '68be85b7094d08828def6739', name: 'Cottover Ekologisk V-ringad T-shirt Herr' },
    { id: '68be85b7094d08828def673a', name: 'Cottover Ekologisk T-shirt Barn' },
    { id: '68be85b7094d08828def673d', name: 'Funktions T-shirt Niagara Herr' },
    { id: '68be85b7094d08828def673e', name: 'Funktions T-shirt Niagara Dam' },
    { id: '68be85b7094d08828def6752', name: 'T-shirt Nanaimo Dam' },
    { id: '68be85b7094d08828def6755', name: 'Funktions T-shirt Niagara Dam' },
    { id: '68be85b7094d08828def6756', name: 'Ekologisk V-ringad T-shirt Kawartha Dam' },
    { id: '68be85b7094d08828def675b', name: 'B&C T-shirt Inspire Dam' },
    { id: '68be85b7094d08828def675d', name: 'Cottover V-ringad T-shirt Dam' },
    { id: '68be85b7094d08828def675e', name: 'James Harvest - American U Woman' },
    { id: '68be85b7094d08828def6760', name: 'B&C Långärmad T-shirt 190 Dam' },
    { id: '68be85b7094d08828def6769', name: 'B&C T-shirt Triblend Dam' },
    { id: '68be85b7094d08828def676b', name: 'Heros kortärmad herrtröja' },
    { id: '68be85b7094d08828def676e', name: 'T-shirt Nanaimo Herr' },
    { id: '68be85b7094d08828def677a', name: 'Cottover T-shirt Herr' },
    { id: '68be85b7094d08828def677c', name: 'B&C T-shirt Inspire Herr' },
    { id: '68be85b7094d08828def677f', name: 'James Harvest - American U' },
    { id: '68be85b7094d08828def6794', name: 'Heros kortärmad herrtröja' },
    { id: '68be85b7094d08828def67aa', name: 'B&C T-shirt 150 Herr' },
    { id: '68be85b7094d08828def67ab', name: 'B&C T-shirt 150 Dam' },
    { id: '68be85b7094d08828def6825', name: 'B&C V-ringad T-shirt Triblend Dam' },
    { id: '68be85b7094d08828def682f', name: 'T-shirt Auckland Herr' },
    { id: '68be85b7094d08828def6832', name: 'B&C T-shirt Triblend Herr' },
    { id: '68be85b7094d08828def6836', name: 'James Harvest - Twoville' },
    { id: '68be85b7094d08828def6837', name: 'James Harvest - Whailford' },
    { id: '68be85b7094d08828def683f', name: 'B&C V-ringad T-shirt Triblend Herr' },
    { id: '68be85b8094d08828def6910', name: 'Cottover V-ringad T-shirt Dam' },
    { id: '68be85b8094d08828def6912', name: 'James Harvest - American V' },
    { id: '68be85b8094d08828def6914', name: 'B&C V-ringad T-shirt Triblend Herr' },
    { id: '68be85b8094d08828def6916', name: 'B&C V-ringad T-shirt Triblend Dam' },
    { id: '68be85d1094d08828defcff4', name: 'B&C T-shirt Sublimation Dam' },
    // ... and 28 more products
  ],

  // pladar (118 products)
  'pladar': [
    { id: '68be85ad094d08828def468c', name: 'SMOOTH. 100 % akrylfilt med band för personligt kort (270 g/m²)' },
    { id: '68be85ae094d08828def4a36', name: 'Filt i fleece (enfärgad) EU' },
    { id: '68be85af094d08828def4b4f', name: 'Plyschfigur björn med fleecefilt Owen' },
    { id: '68be85af094d08828def4c5a', name: 'Pollock Blanket' },
    { id: '68be85af094d08828def4d1f', name: 'Van Eyck Blanket' },
    { id: '68be85af094d08828def4d6e', name: 'Reporta RPET-polarfilt med tryck' },
    { id: '68be85af094d08828def4dec', name: 'Giotto Blanket' },
    { id: '68be85af094d08828def4e2e', name: 'Foglio RPET-täcke' },
    { id: '68be85b0094d08828def4f55', name: 'Quet - Rutig mohairfilt' },
    { id: '68be85b0094d08828def508b', name: 'Filt llanell-fleece (280 gr/m²) Sean' },
    { id: '68be85b0094d08828def5114', name: 'Fleecefilt Flanell (230 gr/m²)  Nikolai' },
    { id: '68be85b2094d08828def54e9', name: 'Huggy fleecefilt med påse 150 x 120 cm' },
    { id: '68be85b2094d08828def54ea', name: 'Bay extra mjuk filt i korallfleece' },
    { id: '68be85b2094d08828def54eb', name: 'Springwood mjuk rutig filt i polarfleece och sherpafleece' },
    { id: '68be85b2094d08828def54ef', name: 'Fleecepläd i fodral' },
    { id: '68be85b2094d08828def54f0', name: 'Ukiyo Aware Polylana® vävd pläd 130x150cm' },
    { id: '68be85b2094d08828def54f3', name: 'Huggy fleecefilt med påse 220 x 250 cm' },
    { id: '68be85b2094d08828def54f9', name: 'Stavenger - Fleecefilt' },
    { id: '68be85b2094d08828def54fc', name: 'Davos - Filt flannel' },
    { id: '68be85b2094d08828def54fd', name: 'Cap Code - Filt i fleece' },
    { id: '68be85b2094d08828def54fe', name: 'Bogda - RPET fleecefilt 130gr/m²' },
    { id: '68be85b2094d08828def5500', name: 'Quet - Rutig mohairfilt' },
    { id: '68be85b2094d08828def5552', name: 'Fleecepläd' },
    { id: '68be85b2094d08828def5553', name: 'Decke - Fleecefilt/pläd - 170 g /m²' },
    { id: '68be85b2094d08828def5554', name: 'Fleeceponcho' },
    { id: '68be85b2094d08828def5555', name: 'Ullpläd' },
    { id: '68be85b2094d08828def5556', name: 'Fleecepläd' },
    { id: '68be85b2094d08828def5557', name: 'SuperSoft (180 g/m²) fleecefilt' },
    { id: '68be85b2094d08828def5559', name: 'THORPE. Fleecefilt med avtagbart handtag (180 g/m²)' },
    { id: '68be85b2094d08828def555a', name: 'SULENA. Polar filt (180 g/m²)' },
    { id: '68be85b2094d08828def555b', name: 'SuperSoft RPET (180 g/m²) fleecefilt' },
    { id: '68be85b2094d08828def555d', name: 'HEIDEN. Vändbar fleecefilt (190 g/m²) med satinband och personligt kort' },
    { id: '68be85b2094d08828def555e', name: 'RILEY. (180 g/m²) fleecefilt med baksida' },
    { id: '68be85b2094d08828def555f', name: 'DYLEAF. (240 g/m²) fleecefilt med personligt kortband' },
    { id: '68be85b2094d08828def5561', name: 'Luxury throw' },
    { id: '68be85b2094d08828def5562', name: 'Filt i fleece (enfärgad) EU' },
    { id: '68be85b2094d08828def5563', name: 'Fleecepläd Jaquard' },
    { id: '68be85b2094d08828def5564', name: 'Pläd Sjövallen' },
    { id: '68be85b2094d08828def55b1', name: 'Ullpläd Rand' },
    { id: '68be85b2094d08828def55b2', name: 'SMOOTH. 100 % akrylfilt med band för personligt kort (270 g/m²)' },
    { id: '68be85b2094d08828def55b5', name: 'Sherpapläd Smeviken' },
    { id: '68be85b2094d08828def55b7', name: 'Fuskpälspläd Nordby' },
    { id: '68be85b2094d08828def55b8', name: 'Filt llanell-fleece (280 gr/m²) Sean' },
    { id: '68be85b2094d08828def55b9', name: 'Heavy Blend? Fleece Stadium Blanket' },
    { id: '68be85b2094d08828def55ba', name: 'Fleecefilt Flanell (230 gr/m²)  Nikolai' },
    { id: '68be85b2094d08828def55bb', name: 'Pollock Blanket' },
    { id: '68be85b2094d08828def55bd', name: 'Ullpläd Alba' },
    { id: '68be85b2094d08828def55be', name: 'Van Eyck Blanket' },
    { id: '68be85b2094d08828def55bf', name: 'Ullpläd Winton' },
    { id: '68be85b2094d08828def55c2', name: 'Giotto Blanket' },
    { id: '68be85b2094d08828def5603', name: 'Pläd Santa Clara' },
    { id: '68be85b2094d08828def5604', name: 'Kampanj! Esther fleecepläd' },
    { id: '68be85b2094d08828def5606', name: 'Espoo flanellfilt' },
    { id: '68be85b2094d08828def5607', name: 'Sammia korall fleece filt' },
    { id: '68be85b2094d08828def5608', name: 'Baloo Pläd' },
    { id: '68be85b2094d08828def560a', name: 'Reporta RPET-polarfilt med tryck' },
    { id: '68be85b2094d08828def560b', name: 'Foglio RPET-täcke' },
    { id: '68be85b2094d08828def560c', name: 'Glasgow Ullpläd' },
    { id: '68be85b2094d08828def560d', name: 'Aukland Ullpläd' },
    { id: '68be85b2094d08828def560e', name: 'Brooklyn Pläd' },
    { id: '68be85b2094d08828def560f', name: 'Cincinatti Pläd' },
    { id: '68be85b2094d08828def5610', name: 'Polar Pläd' },
    { id: '68be85b2094d08828def5611', name: 'Sälen Pläd' },
    { id: '68be85b2094d08828def56e7', name: 'Fleeceponcho Kuling' },
    { id: '68be85be094d08828def7dc6', name: 'Manta - Fleece-filt med en nalle på' },
    { id: '68be85be094d08828def7e4d', name: 'Plyschfigur björn med fleecefilt Owen' },
    { id: '68be85c9094d08828defa88d', name: 'Ullpläd Hamilton' },
    { id: '68be85ca094d08828defa8db', name: 'Pläd Kolstorp' },
    { id: '68be85ca094d08828defa8dd', name: 'Pläd Tanger' },
    { id: '68be85ca094d08828defa8e2', name: 'Fleeceponcho Paradise' },
    { id: '68be85ca094d08828defa8e3', name: 'Fleecepläd Paradise 2-pack' },
    { id: '68be85cb094d08828defad74', name: 'Filt i Sherpa fleece (fullfärgstryck) EU' },
    { id: '68be85d0094d08828defcd98', name: 'Filt i mikrofiber (fullfärgstryck) EU' },
    { id: '68be85d0094d08828defcdd2', name: 'Mondrian Blanket' },
    { id: '68be85d0094d08828defcde8', name: 'Ernst Blanket' },
    { id: '68be85d1094d08828defcf44', name: 'Filt i fleece (fullfärgstryck 1 sida) EU' },
    { id: '68be85d1094d08828defd006', name: 'Filt i fleece (fullfärgstryck 2 sidor) EU' },
    { id: '68be85d2094d08828defd255', name: 'Gusto - Våffelstickad filt 350 gr/m²' },
    { id: '68be85d3094d08828defd7c8', name: 'Värmefilt' },
    { id: '68be85d3094d08828defda8a', name: 'Tibble - Filt - stl. 130 x 200 cm' },
    { id: '68be85d4094d08828defdcbc', name: 'Djur - Filt - 120 x 180 cm - 280 g/m²' },
    { id: '68be85d4094d08828defddbf', name: 'FLEECE. Fleecefilt (160 g/m²)' },
    { id: '68be85d4094d08828defe00a', name: 'Bora - Filt' },
    { id: '68be85df094d08828df00c5d', name: 'Ukiyo Aware Polylana® vävd pläd 130x150cm' },
    { id: '68be85e0094d08828df00c72', name: 'Mjuk fleecepläd' },
    { id: '68be85e0094d08828df00c75', name: 'Fleecepläd i fodral' },
    { id: '68be85e0094d08828df00ee9', name: 'Härlig ullpläd från Ylleverket - Enfärgad natur' },
    { id: '68be85e0094d08828df00fc7', name: 'SuperSoft RPET (180 g/m²) fleecefilt' },
    { id: '68be85e3094d08828df0181c', name: 'SuperSoft RPET (180 g/m²) fleecefilt' },
    { id: '68be85e4094d08828df0182a', name: 'Horizon throw' },
    { id: '68be85e4094d08828df01980', name: 'Smilla - Fleecefilt - stl. 120 x 150 cm' },
    { id: '68be85e4094d08828df01b67', name: 'Baloo Pläd' },
    { id: '68be85e4094d08828df01b70', name: 'Glasgow Ullpläd' },
    { id: '68be85e4094d08828df01b76', name: 'Brooklyn Pläd' },
    { id: '68be85e4094d08828df01b77', name: 'Aukland Ullpläd' },
    { id: '68be85e4094d08828df01b7f', name: 'Quinn Pläd' },
    { id: '68be85e4094d08828df01c00', name: 'Cincinatti Pläd' },
    { id: '68be85e4094d08828df01c02', name: 'Polar Pläd' },
    { id: '68be85e4094d08828df01c03', name: 'Sälen Pläd' },
    { id: '68be85e5094d08828df01e05', name: 'Nanda RPET polarfilt' },
    // ... and 18 more products
  ],

  // candles (115 products)
  'candles': [
    { id: '68be85ad094d08828def4872', name: 'Pila - Fyrkantigt doftljus 50 gr' },
    { id: '68be85ad094d08828def48c9', name: 'Fraga Doftljus 9 cm' },
    { id: '68be85ad094d08828def48ca', name: 'Fraga Doftljus 6 cm' },
    { id: '68be85ad094d08828def48cb', name: 'LED Blockljus Utomhus' },
    { id: '68be85ad094d08828def48cc', name: 'LED Kronljus Shiny 2-pack' },
    { id: '68be85ad094d08828def48cd', name: 'LED Blockljus' },
    { id: '68be85ad094d08828def48ce', name: 'Frabli Doftljus 8 cm' },
    { id: '68be85ad094d08828def48cf', name: 'Frabli Doftljus 10 cm' },
    { id: '68be85ad094d08828def48d0', name: 'Ljuspaket LED Blockljus' },
    { id: '68be85ae094d08828def4a6d', name: 'YEUN. doftspridare i glasflaskor' },
    { id: '68be85ae094d08828def4a6e', name: 'SCENT. Ljus hållare' },
    { id: '68be85ae094d08828def4a7d', name: 'DUVAL. Aromatiskt ljus i glaskopp med korklock 180 g' },
    { id: '68be85ae094d08828def4ac0', name: 'Daizu ljus, sandelträ' },
    { id: '68be85b0094d08828def4f4a', name: 'Daizu XL ljus, sandelträ' },
    { id: '68be85b0094d08828def5047', name: 'Tindle ljus' },
    { id: '68be85b0094d08828def5061', name: 'Ljus Elipse (inkl soyavax)' },
    { id: '68be85b0094d08828def5082', name: 'Ljus Cube (inkl soyavax)' },
    { id: '68be85b0094d08828def5083', name: 'Ljus Ultra (inkl soyavax)' },
    { id: '68be85b0094d08828def5085', name: 'Ljus Aura (inkl soyavax)' },
    { id: '68be85b0094d08828def508d', name: 'Ljus Astro (inkl soyavax)' },
    { id: '68be85b0094d08828def5099', name: 'Vanulla ljus' },
    { id: '68be85b0094d08828def50ba', name: 'Ljus Lux (inkl soyavax)' },
    { id: '68be85b0094d08828def50bf', name: 'Ljus Romantic (inkl soyavax)' },
    { id: '68be85b0094d08828def50c2', name: 'Ljus Wizard (inkl soyavax)' },
    { id: '68be85b0094d08828def50c3', name: 'Ljus i hållare av glas Josiah' },
    { id: '68be85b0094d08828def50c5', name: 'Ljus i hållare av glas Lucas' },
    { id: '68be85b0094d08828def50c6', name: 'Ljus Ray (inkl soyavax)' },
    { id: '68be85b0094d08828def50c9', name: 'Ljus Glamour (inkl soyavax)' },
    { id: '68be85b0094d08828def50ce', name: 'Ljus Ambience (inkl soyavax)' },
    { id: '68be85b0094d08828def50fd', name: 'Kivas Wood - Växtbaserat vaxljus 80 gr' },
    { id: '68be85b0094d08828def5106', name: 'Valo - Växtbaserat vaxljus 70 gr' },
    { id: '68be85b0094d08828def510f', name: 'Ljus Lumena (inkl soyavax)' },
    { id: '68be85b0094d08828def516c', name: 'Landle - LED värmeljus' },
    { id: '68be85b0094d08828def5252', name: 'Ljus i metallburk Laurie' },
    { id: '68be85b0094d08828def525f', name: 'Ljus i metallburk Laurie' },
    { id: '68be85b1094d08828def533e', name: 'Ljus Finesse (inkl soyavax)' },
    { id: '68be85b1094d08828def54c3', name: 'LED-ljus, PP, Serin' },
    { id: '68be85b2094d08828def556c', name: 'Ljus Elipse (inkl soyavax)' },
    { id: '68be85b2094d08828def556d', name: 'Ljus Ultra (inkl soyavax)' },
    { id: '68be85b2094d08828def556e', name: 'Ljus Romantic (inkl soyavax)' },
    { id: '68be85b2094d08828def5570', name: 'Chakra växtbaserat ljus i glasburk' },
    { id: '68be85b2094d08828def5571', name: 'LED-ljus, PP, Serin' },
    { id: '68be85b2094d08828def5572', name: 'LED Blockljus Utomhus' },
    { id: '68be85b2094d08828def5573', name: 'Ljuspaket LED Blockljus' },
    { id: '68be85b2094d08828def55d3', name: 'Tindra fyrkantigt ljus med vaniljarom' },
    { id: '68be85b2094d08828def55d5', name: 'Selight - Ljus' },
    { id: '68be85b2094d08828def55d6', name: 'Keops Small - Växtbaserat vaxljus 120 gr' },
    { id: '68be85b2094d08828def55d7', name: 'Ancient High - Ljus med vaniljdoft i glas' },
    { id: '68be85b2094d08828def55d8', name: 'Kivas - Växtbaserat vaxljus 200 gr' },
    { id: '68be85b2094d08828def55d9', name: 'Kivas Wood - Växtbaserat vaxljus 80 gr' },
    { id: '68be85b2094d08828def55da', name: 'Valo - Växtbaserat vaxljus 70 gr' },
    { id: '68be85b2094d08828def55de', name: 'Ljus Astro (inkl soyavax)' },
    { id: '68be85b2094d08828def55df', name: 'Ljus Lux (inkl soyavax)' },
    { id: '68be85b2094d08828def55e0', name: 'Ljus i hållare av glas Josiah' },
    { id: '68be85b2094d08828def55e1', name: 'Ljus i hållare av glas Lucas' },
    { id: '68be85b2094d08828def55e2', name: 'Ljus Glamour (inkl soyavax)' },
    { id: '68be85b2094d08828def55e3', name: 'Ljus Sensitive (inkl soyavax)' },
    { id: '68be85b2094d08828def5622', name: 'DUVAL. Aromatiskt ljus i glaskopp med korklock 180 g' },
    { id: '68be85b2094d08828def5623', name: 'Ljus i metallburk Laurie' },
    { id: '68be85b2094d08828def5624', name: 'Ljus, Glas, Riven' },
    { id: '68be85b2094d08828def5625', name: 'We Love The Planet Coconut Candle ljus' },
    { id: '68be85b2094d08828def5628', name: 'Corscent ljus, hav' },
    { id: '68be85b2094d08828def5629', name: 'Daizu ljus, sandelträ' },
    { id: '68be85b2094d08828def563a', name: 'Glaslykta' },
    { id: '68be85b2094d08828def563b', name: 'Glaslykta' },
    { id: '68be85b2094d08828def5662', name: 'Fraga Doftljus 6 cm' },
    { id: '68be85b2094d08828def5663', name: 'Daizu XL ljus, sandelträ' },
    { id: '68be85b2094d08828def5664', name: 'Vanulla ljus' },
    { id: '68be85b2094d08828def5665', name: 'Frabli Doftljus 8 cm' },
    { id: '68be85b2094d08828def5666', name: 'Frabli Doftljus 10 cm' },
    { id: '68be85b2094d08828def5688', name: 'Ljus Finesse (inkl soyavax)' },
    { id: '68be85b2094d08828def5689', name: 'Flamtastique XS' },
    { id: '68be85c9094d08828defa7d7', name: 'Ljuslykta Shiny Light' },
    { id: '68be85c9094d08828defa7d8', name: 'Orrefors Tou ljuslykta 70mm' },
    { id: '68be85c9094d08828defa7d9', name: 'Orrefors Tou stormlykta 290mm' },
    { id: '68be85c9094d08828defa7da', name: 'Orrefors Carat ljuslyktor 80mm & 93mm 2-pack' },
    { id: '68be85c9094d08828defa7db', name: 'Orrefors Tou ljuslykta 84mm' },
    { id: '68be85c9094d08828defa7dc', name: 'Gusta Keramisk Lykta' },
    { id: '68be85c9094d08828defa7ff', name: 'Orrefors Light ljushållare 43mm 2-pack' },
    { id: '68be85c9094d08828defa84d', name: 'Adventljusstake' },
    { id: '68be85c9094d08828defa871', name: 'Wellmark medelstort doftljus, cederträ' },
    { id: '68be85c9094d08828defa872', name: 'Wellmark Let "s Get Cozy 650 g doftljus  cederträdoft' },
    { id: '68be85c9094d08828defa873', name: 'Wellmark Discovery 200 ml handtvål med pump och 150 g doftljus  bambudoft' },
    { id: '68be85c9094d08828defa874', name: 'Wellmark Discovery set med 200 ml handtvål med pump och 150 g doftljus  mörk bärnstensdoft' },
    { id: '68be85c9094d08828defa8a2', name: 'Originalhome ljusstake för middag  M' },
    { id: '68be85c9094d08828defa8c3', name: 'Wooosh Luminosa LED Candle' },
    { id: '68be85c9094d08828defa8ca', name: 'Originalhome julgransljus  M' },
    { id: '68be85c9094d08828defa8cb', name: 'Originalhome julgransljus  L' },
    { id: '68be85cc094d08828defb34a', name: 'Mihama ljus' },
    { id: '68be85cd094d08828defbcfb', name: 'Ljus bambu Eli' },
    { id: '68be85ce094d08828defc131', name: 'Light - LED-glaskula' },
    { id: '68be85ce094d08828defc140', name: 'Globe Light - LED-glob glasboll' },
    { id: '68be85ce094d08828defc2a9', name: 'Riu - Växtbaserat vaxljus 600gr' },
    { id: '68be85ce094d08828defc2aa', name: 'Riuada - Växtbaserat vax 1300 g' },
    { id: '68be85cf094d08828defc7e1', name: 'Takebo bambu ljus' },
    { id: '68be85d0094d08828defcc69', name: 'Xandle - LED-vaxljus i glashållare' },
    { id: '68be85d1094d08828defcf5e', name: 'ZEN 80. Aromatiskt ljus i en glaskopp med korklock 80 g' },
    { id: '68be85d1094d08828defcf9f', name: 'Veika - Växtbaserat vaxljus 200 gr' },
    { id: '68be85d1094d08828defd047', name: 'Citrus - Växtbaserat vaxljus 300 gr' },
    { id: '68be85d1094d08828defd051', name: 'Menkaure - Växtbaserat vaxljus 80 gr' },
    // ... and 15 more products
  ],

  // sangklader (112 products)
  'sangklader': [
    { id: '68be85b1094d08828def5484', name: 'Örngott & Underlakan' },
    { id: '68be85b1094d08828def5487', name: 'Örngott & Underlakan Satin' },
    { id: '68be85b1094d08828def5488', name: 'Dra-på-lakan Lyocell' },
    { id: '68be85b1094d08828def5489', name: 'Dra-på-lakan Satin' },
    { id: '68be85b1094d08828def548a', name: 'Kuvertlakan Percale' },
    { id: '68be85b1094d08828def548b', name: 'Örngott & Underlakan Mikrofiber' },
    { id: '68be85b1094d08828def548c', name: 'Dra-på-lakan' },
    { id: '68be85b1094d08828def548d', name: 'Nina Dra-på-lakan 90 x 200 cm' },
    { id: '68be85b1094d08828def548e', name: 'Nina Dra-på-lakan 180 x 200 cm' },
    { id: '68be85b1094d08828def548f', name: 'Nina Dra-på-lakan 160 x 200 cm' },
    { id: '68be85b1094d08828def5495', name: 'Överkast och kuddfodral' },
    { id: '68be85b1094d08828def54a6', name: 'Kuddfodral Salt In The Air' },
    { id: '68be85b1094d08828def54a7', name: 'Kuddfodral Rand' },
    { id: '68be85b1094d08828def54a8', name: 'Kuddfodral Enfärgad' },
    { id: '68be85b1094d08828def54a9', name: 'Kuddfodral Yacht' },
    { id: '68be85b1094d08828def54aa', name: 'Kuddfodral Victoria' },
    { id: '68be85b1094d08828def54ab', name: 'Kuddfodral Anchor' },
    { id: '68be85b1094d08828def54ac', name: 'Kuddfodral Vidar' },
    { id: '68be85b1094d08828def54ad', name: 'Kuddfodral Lödde' },
    { id: '68be85b1094d08828def54ae', name: 'Kuddfodral Falsterbo' },
    { id: '68be85b1094d08828def54af', name: 'Kuddfodral Barsebäck' },
    { id: '68be85b1094d08828def54b0', name: 'Kuddfodral Furuvik' },
    { id: '68be85b1094d08828def54b1', name: 'Kuddfodral Engesberg' },
    { id: '68be85b1094d08828def54b2', name: 'Fairtrade Cotton Piped Cushion Cover' },
    { id: '68be85b1094d08828def54b3', name: 'Bagge Fylld Kudde' },
    { id: '68be85b1094d08828def54b4', name: 'Polar Kuddfodral' },
    { id: '68be85b1094d08828def54b7', name: 'Överkast och kuddfodral' },
    { id: '68be85b2094d08828def5508', name: 'Fjällbacka Satin' },
    { id: '68be85b2094d08828def5509', name: 'Fjällbacka Satin 2-pack' },
    { id: '68be85b2094d08828def550a', name: 'Nottingham Percale Lyocell' },
    { id: '68be85b2094d08828def550b', name: 'Stormhagen Satin' },
    { id: '68be85b2094d08828def550c', name: 'Liverpool Satin' },
    { id: '68be85b2094d08828def550d', name: 'Grebbestad Satin' },
    { id: '68be85b2094d08828def550e', name: 'Kust Mikrofiber' },
    { id: '68be85b2094d08828def5510', name: 'Nottingham Lyocell 2-pack' },
    { id: '68be85b2094d08828def5511', name: 'Örngott Mosshed Flanell' },
    { id: '68be85b2094d08828def5512', name: 'Linnea Lin' },
    { id: '68be85b2094d08828def5513', name: 'Norgård Satin' },
    { id: '68be85b2094d08828def5514', name: 'Bäddset Bandene Satin' },
    { id: '68be85b2094d08828def5565', name: 'Mirage Satin Bäddset' },
    { id: '68be85b2094d08828def5567', name: 'Cortina Flanell bäddset' },
    { id: '68be85b2094d08828def55fe', name: 'Filippa Duk 140 x 250' },
    { id: '68be85b2094d08828def55ff', name: 'Fredrika Löpare' },
    { id: '68be85b2094d08828def56dd', name: 'Kuddfodral Orter' },
    { id: '68be85b2094d08828def56df', name: 'Kuddfodral Salt In The Air' },
    { id: '68be85b2094d08828def56e1', name: 'Kuddfodral Rand' },
    { id: '68be85b2094d08828def56e8', name: 'Kuddfodral Vidar' },
    { id: '68be85b2094d08828def56fe', name: 'Kuddfodral Bjärred' },
    { id: '68be85b2094d08828def5702', name: 'Kuddfodral Storsand' },
    { id: '68be85ca094d08828defa8d6', name: 'Alexandria Satin' },
    { id: '68be85ca094d08828defa8d7', name: 'Gillanda Satin' },
    { id: '68be85ca094d08828defa8d8', name: 'Bollungen Satin' },
    { id: '68be85ca094d08828defa8d9', name: 'Torgestad Slätväv' },
    { id: '68be85ca094d08828defa8da', name: 'Brunnberg Satin' },
    { id: '68be85ca094d08828defa8e0', name: 'Bäddset Hommedal Satin' },
    { id: '68be85ca094d08828defa8f3', name: 'Hult Satin' },
    { id: '68be85ca094d08828defa8f4', name: 'Paradise Satin' },
    { id: '68be85ca094d08828defa8f6', name: 'Tulip Satin' },
    { id: '68be85ca094d08828defa8f7', name: 'OK Check Satin' },
    { id: '68be85ca094d08828defa8f8', name: 'Turturduvor Satin' },
    { id: '68be85ca094d08828defa8f9', name: 'Fågelsång Satin' },
    { id: '68be85ca094d08828defa8fa', name: 'Varamon Satin' },
    { id: '68be85ca094d08828defa928', name: 'Silkeskudde' },
    { id: '68be85ca094d08828defa92b', name: 'Kuddfodral' },
    { id: '68be85ca094d08828defa936', name: 'Vikttäcke 11 kg' },
    { id: '68be85ca094d08828defa937', name: 'Vikttäcke 9 kg' },
    { id: '68be85ca094d08828defa938', name: 'Vikttäcke 7 kg' },
    { id: '68be85ca094d08828defa93c', name: 'Örngott & Underlakan Percale' },
    { id: '68be85ca094d08828defa93d', name: 'Kuvertlakan Lin' },
    { id: '68be85cb094d08828defad7f', name: 'Kudde velour (fullfärgstryck) EU' },
    { id: '68be85cc094d08828defb0d3', name: 'Fyrkantigt kuddfodral (full color print) EU' },
    { id: '68be85ce094d08828defc147', name: 'Kudde vattenavvisande (fullfärgstryck) EU' },
    { id: '68be85d0094d08828defccd9', name: 'Kudde rektangulär (fullfärgstryck) EU' },
    { id: '68be85d1094d08828defd011', name: 'Kudde i Microfiber (fullfärgstryck) EU' },
    { id: '68be85e3094d08828df0165c', name: 'Nottingham Percale Lyocell' },
    { id: '68be85e4094d08828df01838', name: 'Nottingham Lyocell 2-pack' },
    { id: '68be85e4094d08828df01b68', name: 'Mirage Satin Bäddset' },
    { id: '68be85e4094d08828df01b6d', name: 'Nina Dra-på-lakan 90 x 200 cm' },
    { id: '68be85e4094d08828df01b6e', name: 'Nina Dra-på-lakan 180 x 200 cm' },
    { id: '68be85e4094d08828df01b71', name: 'Trysil Flanell Bäddset' },
    { id: '68be85e4094d08828df01b72', name: 'Bagge Fylld Kudde' },
    { id: '68be85e4094d08828df01b74', name: 'Brooklyn Fodral' },
    { id: '68be85e4094d08828df01b7a', name: 'Polar Kuddfodral' },
    { id: '68be85e4094d08828df01b7c', name: 'Cortina Flanell bäddset' },
    { id: '68be85e4094d08828df01b7d', name: 'Nina Dra-på-lakan 160 x 200 cm' },
    { id: '68be85e4094d08828df01b7e', name: 'Filippa Duk 140 x 250' },
    { id: '68be85e4094d08828df01c01', name: 'Fredrika Löpare' },
    { id: '68be85e4094d08828df01c04', name: 'Nina Dra-på-lakan 120 x 200 cm' },
    { id: '68be85e5094d08828df01efb', name: 'Örngott & Underlakan' },
    { id: '68be85e5094d08828df01efc', name: 'Dra-på-lakan' },
    { id: '68be85e8094d08828df02972', name: 'Kuddfodral Orter' },
    { id: '68be85e8094d08828df02973', name: 'Kuddfodral Salt In The Air' },
    { id: '68be85e8094d08828df02975', name: 'Kuddfodral Rand' },
    { id: '68be85e8094d08828df0297b', name: 'Örngott & Underlakan Mikrofiber' },
    { id: '68be85e8094d08828df0297d', name: 'Kuddfodral Enfärgad' },
    { id: '68be85e8094d08828df0297e', name: 'Kuddfodral Ankare' },
    { id: '68be85e8094d08828df02980', name: 'Kudde Seaside' },
    { id: '68be85e8094d08828df02981', name: 'Kuddfodral Yacht' },
    { id: '68be85e8094d08828df02982', name: 'Kust Mikrofiber' },
    { id: '68be85e8094d08828df02984', name: 'Kuddfodral Victoria' },
    // ... and 12 more products
  ],

  // servering (110 products)
  'servering': [
    { id: '68be85ad094d08828def4780', name: 'Bridge - Stor bordsduk 280x210 cm' },
    { id: '68be85b1094d08828def536a', name: 'Mepal Ellipse isolerad lunchbägare 2.0' },
    { id: '68be85b1094d08828def5371', name: 'Mepal Ellipse Mini lunchbägare' },
    { id: '68be85b1094d08828def5380', name: 'Colorit tallrik Ø 19 cm' },
    { id: '68be85b1094d08828def5382', name: 'Colorit tallrikar Ø 22 cm' },
    { id: '68be85b1094d08828def539b', name: 'Linneserie Linn' },
    { id: '68be85b1094d08828def539d', name: 'Dukserie Tvättat Lin' },
    { id: '68be85b1094d08828def539e', name: 'Svea Servettringar 6-pack' },
    { id: '68be85b1094d08828def53b1', name: 'Nemo - Bordstablett/underlägg' },
    { id: '68be85b1094d08828def53b4', name: 'Mepal Ellipse Mini lunchbägare' },
    { id: '68be85b1094d08828def53dd', name: 'EM bricka Ø 40 cm' },
    { id: '68be85b1094d08828def5403', name: 'Linneserie Linn' },
    { id: '68be85b2094d08828def5545', name: 'Freeze-it bricka för isstavar' },
    { id: '68be85bc094d08828def7615', name: 'Caturra set med espressokoppar' },
    { id: '68be85bc094d08828def7616', name: 'Caturra Plus set med cappuccinokoppar' },
    { id: '68be85c9094d08828defa8ad', name: 'Dukserie Lin' },
    { id: '68be85ca094d08828defa9a7', name: 'Hanna rund bricka' },
    { id: '68be85ca094d08828defa9a8', name: 'Hanna bricka stor' },
    { id: '68be85ca094d08828defa9a9', name: 'Hanna rund bricka' },
    { id: '68be85ca094d08828defa9aa', name: 'Wooosh Convivio serveringsbräda' },
    { id: '68be85ca094d08828defa9ab', name: 'Serveringsbricka Bambu' },
    { id: '68be85ca094d08828defa9ac', name: 'Serveringsbricka Acacia Selection' },
    { id: '68be85ca094d08828defa9ad', name: 'Circulcup Coffee Cup Tray 6-hole Ø 8 cm' },
    { id: '68be85ca094d08828defa9ae', name: 'Garcia Serveringsbräda' },
    { id: '68be85ca094d08828defa9af', name: 'Serveringsbricka i bambu Theodor' },
    { id: '68be85ca094d08828defa9c7', name: 'Dukserie Lin' },
    { id: '68be85ca094d08828defaa1b', name: 'Örthackarset "Bunch"' },
    { id: '68be85ca094d08828defaa1d', name: 'Wooosh Tabla Pizza serveringsbräda' },
    { id: '68be85ca094d08828defaa1e', name: 'Originalhome träbricka' },
    { id: '68be85ca094d08828defaa95', name: 'MINIGRYTOR I KERAMIK - SET OM 4 - MAR AZUL' },
    { id: '68be85ca094d08828defaa99', name: 'Korg Angelica' },
    { id: '68be85ca094d08828defaa9a', name: 'Torgkorg Iza' },
    { id: '68be85ca094d08828defaa9c', name: 'Servetthållare Trä' },
    { id: '68be85ca094d08828defaa9d', name: 'Dukserie Lin' },
    { id: '68be85ca094d08828defab0f', name: 'Dante grytunderlägg i kork, 2-pack (6) Brun' },
    { id: '68be85ca094d08828defab10', name: 'Coffee & More ljus/äggkopp (6) Terrakotta' },
    { id: '68be85ca094d08828defab13', name: 'BOSKA Tapas Fondue Nero - 300 ml' },
    { id: '68be85ca094d08828defac03', name: 'Kopp Lucas Lunch Set' },
    { id: '68be85ca094d08828defacb5', name: 'Kopp med fat Sonata Premium' },
    { id: '68be85cb094d08828defad77', name: 'Tallrik King' },
    { id: '68be85cb094d08828defaebb', name: 'Serveringsbräda i bambu Kennedy' },
    { id: '68be85cf094d08828defc65d', name: 'Scaglia - Akaciaträ grytunderlägg set' },
    { id: '68be85cf094d08828defc664', name: 'Viram - Serveringsbricka julgran' },
    { id: '68be85cf094d08828defc7a9', name: 'Acaball - Serveringsbräda av akaciaträ' },
    { id: '68be85cf094d08828defc814', name: 'Red Stand B2' },
    { id: '68be85d0094d08828defcc68', name: 'Azuur - Serveringsbräda av akaciaträ' },
    { id: '68be85d0094d08828defcdd1', name: 'Claudel Board' },
    { id: '68be85d0094d08828defcdd5', name: 'Degas Board' },
    { id: '68be85d1094d08828defcf1f', name: 'Zhuli underlägg' },
    { id: '68be85d1094d08828defcf9c', name: 'Buon Appetito - Bordsunderlägg' },
    { id: '68be85d1094d08828defd04a', name: 'S&p - Salt- och pepparlåda i bambu' },
    { id: '68be85d2094d08828defd1ec', name: 'Treesguard - Bestick hållare i RPET filt' },
    { id: '68be85d2094d08828defd286', name: 'Torgkorg Eva' },
    { id: '68be85d2094d08828defd29b', name: 'Korg Freja' },
    { id: '68be85d2094d08828defd42a', name: 'Korg, oval Stina' },
    { id: '68be85d2094d08828defd42e', name: 'Torgkorg Micke' },
    { id: '68be85d2094d08828defd437', name: 'Korg Carola' },
    { id: '68be85d2094d08828defd596', name: 'Korg Hulda' },
    { id: '68be85d2094d08828defd5a2', name: 'Torgkorg Holländare' },
    { id: '68be85d2094d08828defd619', name: 'CARAWAY. Serveringsbräda i bambu' },
    { id: '68be85d2094d08828defd624', name: 'CARAWAY ROUND. Rund bambubräda' },
    { id: '68be85d2094d08828defd64c', name: 'Torgkorg Ingrid' },
    { id: '68be85d2094d08828defd656', name: 'Korg Diana' },
    { id: '68be85d2094d08828defd6e7', name: 'CARAWAY LONG. Serveringsbräda i bambu' },
    { id: '68be85d2094d08828defd73a', name: 'Torgkorg Sofia' },
    { id: '68be85d2094d08828defd742', name: 'Torgkorg Sara' },
    { id: '68be85d3094d08828defd7ee', name: 'Torgkorg Zenit' },
    { id: '68be85d3094d08828defd7f5', name: 'Torgkorg Azur' },
    { id: '68be85d3094d08828defd801', name: 'Torgkorg Ebba' },
    { id: '68be85d3094d08828defd802', name: 'Bricka rektangulär Johan' },
    { id: '68be85d3094d08828defd803', name: 'Torgkorg Perla' },
    { id: '68be85d3094d08828defd805', name: 'Torgkorg Fia' },
    { id: '68be85d3094d08828defd894', name: 'Sangsuk grytunderlägg i bambu' },
    { id: '68be85d3094d08828defd8ac', name: 'Torgkorg Gunnar' },
    { id: '68be85d3094d08828defd8b1', name: 'Korg Ylva' },
    { id: '68be85d3094d08828defd8c3', name: 'Korg Salma' },
    { id: '68be85d3094d08828defd91b', name: 'Torgkorg Lena' },
    { id: '68be85d3094d08828defd928', name: 'Torgkorg Mia' },
    { id: '68be85d3094d08828defd930', name: 'Bilkorg Bosse' },
    { id: '68be85d3094d08828defd93c', name: 'Bilkorg Karin' },
    { id: '68be85d3094d08828defd954', name: 'MUSTARD. Bambu bricka' },
    { id: '68be85d3094d08828defd9d2', name: 'Torgkorg Hedvig' },
    { id: '68be85d3094d08828defda0d', name: 'TRUFFLE. Sedlarhållare i PU' },
    { id: '68be85d3094d08828defdaaf', name: 'Imba - Vikbart grytunderlägg i bambu' },
    { id: '68be85d3094d08828defdad6', name: 'Korg Signe (2-pack)' },
    { id: '68be85d3094d08828defdb20', name: 'CAPERS. Serveringsbräda i bambu' },
    { id: '68be85d3094d08828defdb77', name: 'Bayin - Runt underlägg i bambu' },
    { id: '68be85d4094d08828defdbbd', name: 'BANON. Serveringsbräda i bambu' },
    { id: '68be85d4094d08828defdc03', name: 'Källby - Bordsunderlägg' },
    { id: '68be85d4094d08828defdc0a', name: 'Äggkorg Nils' },
    { id: '68be85d4094d08828defdc1c', name: 'Torgkorg Marie' },
    { id: '68be85d4094d08828defdc20', name: 'Bricka oval Per' },
    { id: '68be85d4094d08828defdcca', name: 'Torino - Bestick/servetthållare' },
    { id: '68be85d4094d08828defdd7e', name: 'Edge serveringsbricka av akaciaträ' },
    { id: '68be85d4094d08828defddc1', name: 'ARNICA. Bambu télåda med 4 fack och magnetstängning' },
    { id: '68be85d4094d08828defdf12', name: 'Torgkorg Buss' },
    { id: '68be85d4094d08828defdf73', name: 'Oliv -  Bordstablett/underlägg' },
    { id: '68be85d4094d08828defdf76', name: 'Myntos - Grytunderlägg' },
    { id: '68be85d4094d08828defdf99', name: 'Korg Alma (2-pack)' },
    { id: '68be85d4094d08828defe009', name: 'Remo - Bordstablett/underlägg' },
    // ... and 10 more products
  ],

  // traningstrojor (101 products)
  'traningstrojor': [
    { id: '68be85ad094d08828def48a3', name: 'THC NICOSIA. Herr sport t-shirt' },
    { id: '68be85ad094d08828def48b9', name: 'THC NICOSIA WOMEN. Sport t-shirt för damer' },
    { id: '68be85b4094d08828def5f74', name: 'SIam kortärmad sport-T-shirt för herrar' },
    { id: '68be85b4094d08828def5f75', name: 'Bugatti kortärmad unisex T-shirt av återvunnet material' },
    { id: '68be85b4094d08828def5f77', name: 'Evans unisex träningsoverall' },
    { id: '68be85b4094d08828def5f78', name: 'Montecarlo långärmad sport t-shirt för män' },
    { id: '68be85b4094d08828def5f79', name: 'Shanghai kortärmad sport-T-shirt för herr' },
    { id: '68be85b4094d08828def5f7a', name: 'Epiro långärmad unisex sweatshirt med kvartslång dragkedja' },
    { id: '68be85b4094d08828def5f7b', name: 'Shanghai kortärmad sport-T-shirt för dam' },
    { id: '68be85b4094d08828def5f7c', name: 'Estambul funktionströja med halv dragkedja för herr' },
    { id: '68be85b4094d08828def5f7d', name: 'Estoril kortärmad funktions T-shirt för herr' },
    { id: '68be85b4094d08828def5f7e', name: 'Estoril kortärmad funktions T-shirt för dam' },
    { id: '68be85b4094d08828def5f7f', name: 'Estoril unisex långärmad funktions T-shirt för herr' },
    { id: '68be85b4094d08828def5f80', name: 'Sporty - SPORTY HERR T-shirt' },
    { id: '68be85b4094d08828def5f81', name: 'Sporty Women - SPORTY DAM T-SHIRT  140g' },
    { id: '68be85b4094d08828def606e', name: 'Women"s Cool T' },
    { id: '68be85b4094d08828def6071', name: 'Pro Dry Nanoweight  Ss M' },
    { id: '68be85b4094d08828def6074', name: 'Women"s TriDri® performance t-shirt' },
    { id: '68be85b4094d08828def607e', name: 'Womens TriDri® Crop Top' },
    { id: '68be85b4094d08828def6081', name: 'Men"s Cool 1/2 Zip Sweat' },
    { id: '68be85b4094d08828def6082', name: 'Women"s Cool 1/2 Zip Sweat' },
    { id: '68be85b5094d08828def6107', name: 'Women"s Cool Cowl Neck Top' },
    { id: '68be85b5094d08828def610a', name: 'Men"s Cool Cowl Neck Top' },
    { id: '68be85b5094d08828def610f', name: 'Funktionströja Herr' },
    { id: '68be85b5094d08828def6112', name: 'Funktionströja Dam' },
    { id: '68be85b5094d08828def6114', name: 'Huvtröja Stretch Herr' },
    { id: '68be85b5094d08828def6117', name: 'Hoodjacka Sport Herr' },
    { id: '68be85b5094d08828def6118', name: 'Tank Top för herrar' },
    { id: '68be85b5094d08828def611a', name: 'Tank Top för damer' },
    { id: '68be85b5094d08828def611b', name: 'Womens TriDri® Performance 1/4 Zip' },
    { id: '68be85b5094d08828def611c', name: 'Women"s TriDri® Seamless "3D-fit" Multi-sport Perf' },
    { id: '68be85b5094d08828def611d', name: 'Men"s Muscle Vest' },
    { id: '68be85b5094d08828def611e', name: 'Womens TriDri® Seamless "3D Fit" Multi-sport Sculp' },
    { id: '68be85b5094d08828def611f', name: 'Mens TriDri® long Sleeve Performance 1/4 Zip' },
    { id: '68be85b5094d08828def6120', name: 'Hoodjacka Sport Dam' },
    { id: '68be85b5094d08828def6121', name: 'Women"s TriDri® Seamless "3D-fit" Multi-sport Perf' },
    { id: '68be85b5094d08828def6123', name: 'Pro Dry Nanoweight Ss W' },
    { id: '68be85b5094d08828def6125', name: 'Mistral Fleece Jacket' },
    { id: '68be85b5094d08828def6126', name: 'Women"s TriDri® Seamless "3D-fit" Multi-sport Perf' },
    { id: '68be85b5094d08828def61a0', name: 'Rush 2.0 Crop Top W' },
    { id: '68be85b5094d08828def6200', name: 'TriDri® performance baselayer' },
    { id: '68be85b5094d08828def6201', name: 'Women"s Mistral Fleece Jacket' },
    { id: '68be85b5094d08828def6203', name: 'W"s Base Thermal 1/4 Zip' },
    { id: '68be85b5094d08828def6204', name: 'Base Thermal 1/4 Zip' },
    { id: '68be85b5094d08828def6210', name: 'Premier Solid Jersey M' },
    { id: '68be85b5094d08828def6214', name: 'Premier Fade Jersey M' },
    { id: '68be85b5094d08828def62b9', name: 'Premier Fade Jersey W' },
    { id: '68be85b5094d08828def62bf', name: 'Premier Solid Jersey W' },
    { id: '68be85b5094d08828def62c9', name: 'Rush 2.0 Crop Top W' },
    { id: '68be85b5094d08828def62cf', name: 'SuperCool Performance T' },
    { id: '68be85b5094d08828def62d2', name: 'THC NICOSIA. Herr sport t-shirt' },
    { id: '68be85b5094d08828def62d5', name: 'THC NICOSIA WOMEN. Sport t-shirt för damer' },
    { id: '68be85b6094d08828def64d9', name: 'Layers Hz Ls W' },
    { id: '68be85b6094d08828def64da', name: 'Flow Hz Ls M' },
    { id: '68be85b6094d08828def64de', name: 'TriDri® Seamless "3D-fit" Multi-sport Performance' },
    { id: '68be85b6094d08828def64e0', name: 'Womens TriDri® Yoga Cap sleeve Top' },
    { id: '68be85b6094d08828def6564', name: 'Estambul funktionströja med halv dragkedja för herr' },
    { id: '68be85b6094d08828def658c', name: 'TriDri® Seamless "3D-fit" Multi-sport Performance' },
    { id: '68be85b6094d08828def658d', name: 'Womens TriDri® Yoga Cap sleeve Top' },
    { id: '68be85b6094d08828def658e', name: 'Womens TriDri® Performance STRAPBACK Animal Printe' },
    { id: '68be85b6094d08828def6590', name: 'Endura sport T-shirt' },
    { id: '68be85cb094d08828defaeae', name: 'Linne (135 g) EU' },
    { id: '68be85cf094d08828defc7cd', name: 'T-shirt SXT 1 (125 g) Dam EU' },
    { id: '68be85d0094d08828defc944', name: 'Sportjacka Spartan EU' },
    { id: '68be85d0094d08828defccc5', name: 'T-shirt SXT 1 (125 g) Herr EU' },
    { id: '68be85d0094d08828defccc7', name: 'Hoodie Kangaroo EU' },
    { id: '68be85d1094d08828defce88', name: 'THC NICOSIA WH. Teknisk T-shirt för män. vit färg' },
    { id: '68be85d4094d08828defdee4', name: 'CreaSport sport-T-shirt med tryck' },
    { id: '68be85d5094d08828defe4cd', name: 'Women"s TriDri® "Lazer cut" Scooped Top' },
    { id: '68be85d5094d08828defe4ce', name: 'TriDri® Seamless "3D-fit" Multi-sport Performance' },
    { id: '68be85d5094d08828defe4cf', name: 'Flow Mn Ls W' },
    { id: '68be85d5094d08828defe4d0', name: 'Flow Mn Ls M' },
    { id: '68be85d5094d08828defe4d1', name: 'Layers Thermal Mesh Cn W' },
    { id: '68be85d5094d08828defe4d2', name: 'Athleisure Layers Dry Thermal Mesh M' },
    { id: '68be85d5094d08828defe4d3', name: 'Active Comfort Ss 2 W' },
    { id: '68be85d5094d08828defe4d4', name: 'Active Comfort Ss 2 M' },
    { id: '68be85d5094d08828defe505', name: 'Womens TriDri® Seamless "3D Fit" Multi-sport Revea' },
    { id: '68be85d5094d08828defe519', name: 'Cool Urban Marl T' },
    { id: '68be85d5094d08828defe531', name: 'Yukon unisex interlock sporttröja med rund hals' },
    { id: '68be85d5094d08828defe532', name: 'Danali unisex interlock sporttröja med huva' },
    { id: '68be85e2094d08828df01472', name: 'Pro Dry Nanoweight  Ss M' },
    { id: '68be85e4094d08828df01aed', name: 'SIam kortärmad sport-T-shirt för herrar' },
    { id: '68be85e4094d08828df01b89', name: 'Bugatti kortärmad unisex T-shirt av återvunnet material' },
    { id: '68be85e4094d08828df01b8f', name: 'Indianapolis kortärmad unisex sport-T-shirt' },
    { id: '68be85e4094d08828df01b93', name: 'Evans unisex träningsoverall' },
    { id: '68be85e4094d08828df01b94', name: 'Detroit kortärmad unisex sport-T-shirt' },
    { id: '68be85e4094d08828df01b99', name: 'Montecarlo långärmad sport t-shirt för män' },
    { id: '68be85e4094d08828df01ba2', name: 'Shanghai kortärmad sport-T-shirt för herr' },
    { id: '68be85e4094d08828df01bab', name: 'Montecarlo långärmad sport t-shirt för barn' },
    { id: '68be85e5094d08828df01c12', name: 'Epiro långärmad unisex sweatshirt med kvartslång dragkedja' },
    { id: '68be85e5094d08828df01c1b', name: 'Shanghai kortärmad sport-T-shirt för dam' },
    { id: '68be85e5094d08828df01c1e', name: 'Estambul funktionströja med halv dragkedja för herr' },
    { id: '68be85e5094d08828df01c23', name: 'Estoril kortärmad funktions T-shirt för herr' },
    { id: '68be85e5094d08828df01c25', name: 'Estoril kortärmad funktions T-shirt för dam' },
    { id: '68be85e5094d08828df01c28', name: 'Estambul funktionströja med halv dragkedja för dam' },
    { id: '68be85e5094d08828df01c2f', name: 'Estoril unisex långärmad funktions T-shirt för herr' },
    { id: '68be85e5094d08828df01e02', name: 'Velocity RPET sport T-shirt' },
    { id: '68be85e6094d08828df021da', name: 'Endura sport T-shirt' },
    { id: '68be85e7094d08828df02416', name: 'Velocity RPET sport T-shirt' },
    { id: '68be85e7094d08828df025b1', name: 'Sporty - SPORTY HERR T-shirt' },
    // ... and 1 more products
  ],

  // anteckningsbocker (99 products)
  'anteckningsbocker': [
    { id: '68be85c2094d08828def8ecd', name: 'Ant.bok OXFORD A5 soft linj' },
    { id: '68be85c2094d08828def8ece', name: 'Kollegieblock OXFORD Origins A4+ lin' },
    { id: '68be85c2094d08828def8ecf', name: 'Kollegieblock A5 60g 70 bl olinj' },
    { id: '68be85c2094d08828def8ed0', name: 'Kinabok BANTEX A6 96 blad linjerat' },
    { id: '68be85c2094d08828def8ed1', name: 'Kollegieblock OXFORD Origins A4+ linj sv' },
    { id: '68be85c2094d08828def8ed2', name: 'Ant.block A4 70g 70bl linj PP svart' },
    { id: '68be85c2094d08828def8ed3', name: 'Anteckningsblock OXFORD MY RECUP A5 linj' },
    { id: '68be85c2094d08828def8ed4', name: 'Ant.bok OXFORD A5 hard linj' },
    { id: '68be85c2094d08828def8ed6', name: 'Ant.bok GRIEG Design A4 100g olinj svart' },
    { id: '68be85c2094d08828def8ed7', name: 'Anteckningsbok OXFORD Es. A5 linj inbund' },
    { id: '68be85c3094d08828def902b', name: 'Anteckningsbok BURDE A5' },
    { id: '68be85c3094d08828def902c', name: 'Blockkub refill DJOIS vit' },
    { id: '68be85c3094d08828def902e', name: 'Anteckningsbok Häft omsl A7 blå 40bl' },
    { id: '68be85c3094d08828def902f', name: 'Anteckningsbok linnetextil olinj A5 svar' },
    { id: '68be85c3094d08828def9033', name: 'Ant.bok OXFORD A6 soft linj' },
    { id: '68be85c3094d08828def9036', name: 'Kladdblock olinjerat A6 100 blad' },
    { id: '68be85c3094d08828def903a', name: 'Ant.bok BURDE A4 Linnetextil olinj svart' },
    { id: '68be85c3094d08828def903e', name: 'Anteckningsbok linnetextil linj A5 svart' },
    { id: '68be85c3094d08828def903f', name: 'Besöksbok' },
    { id: '68be85c3094d08828def9041', name: 'Anteckningsbok linnetextil linj A4 svart' },
    { id: '68be85c3094d08828def9042', name: 'Anteckningsblock OXFORD MY RECUP A5 rut' },
    { id: '68be85c3094d08828def9044', name: 'Anteckningsbok DotNotes FSC svart' },
    { id: '68be85c3094d08828def9045', name: 'Anteckningsbok Häft omsl A6 blå 40 bl' },
    { id: '68be85c3094d08828def9046', name: 'Anteckningsbok OXFORD Inbunden A4 linj.' },
    { id: '68be85c3094d08828def9047', name: 'Kinabok BANTEX A4 96 blad linjerat' },
    { id: '68be85c3094d08828def9048', name: 'Ant.block A5 70g 70bl linj PP svart' },
    { id: '68be85c3094d08828def9049', name: 'Anteckningsbok OXFORD Inbunden A5 linj.' },
    { id: '68be85c3094d08828def904a', name: 'Ant.block A5 70g 200 blad 10 avdelare' },
    { id: '68be85c3094d08828def904b', name: 'Kladdblock olinjerat A7 100 blad' },
    { id: '68be85c3094d08828def904c', name: 'Kinabok BANTEX A5 96 blad linjerat' },
    { id: '68be85c3094d08828def904d', name: 'Kladdblock olinjerat A5 100 blad' },
    { id: '68be85c3094d08828def904e', name: 'Ant.block A4 70g 150 blad med 5 avdelare' },
    { id: '68be85c3094d08828def904f', name: 'Ant.block A5 70g 150 blad med 5 avdelare' },
    { id: '68be85d5094d08828defe19f', name: 'Ant.bok GRIEG Design A4 100g linj svart' },
    { id: '68be85dd094d08828df00505', name: 'Ant.block A5 70g 120 blad med 5 avdelar' },
    { id: '68be85dd094d08828df00506', name: 'Ant.block A4 70g 120 blad med 5 avdelar' },
    { id: '68be85dd094d08828df00507', name: 'Ant.bok LEITZ Style A5 H rut. 80bl svart' },
    { id: '68be85dd094d08828df00508', name: 'Ant.block A5 70g 200 blad 10 avdelare' },
    { id: '68be85dd094d08828df00509', name: 'Ant.bok LEITZ Style A5 H linj 80bl' },
    { id: '68be85dd094d08828df0050a', name: 'Ant.bok LEITZ Style A5 H linj 80bl' },
    { id: '68be85dd094d08828df0050b', name: 'Ant.bok LEITZ Style A5 H linj 80bl' },
    { id: '68be85dd094d08828df0050c', name: 'Ant.bok LEITZ Style A5 H linj 80bl' },
    { id: '68be85dd094d08828df00510', name: 'Anteckningsblock GREENBOOK A5+ rut recy' },
    { id: '68be85dd094d08828df00512', name: 'Anteckningsblock GREENBOOK A5+ linj recy' },
    { id: '68be85dd094d08828df00514', name: 'Anteckningsblock GREENBOOK A4+ rut recy' },
    { id: '68be85dd094d08828df00516', name: 'Anteckningsblock GREENBOOK A4+ linj recy' },
    { id: '68be85dd094d08828df00517', name: 'Ant.bok LEITZ Solid A4 H linj 80bl svart' },
    { id: '68be85dd094d08828df00518', name: 'Ant.bok BURDE A4 textil linj' },
    { id: '68be85dd094d08828df0051a', name: 'Ant.bok BURDE A5 textil linj' },
    { id: '68be85dd094d08828df0051b', name: 'Ant.bok LEITZ Solid A5 H linj 80bl svart' },
    { id: '68be85dd094d08828df0051c', name: 'Ant.bok BURDE A4 textil linj' },
    { id: '68be85dd094d08828df0051d', name: 'Ant.bok BURDE A5 textil linj' },
    { id: '68be85dd094d08828df0051e', name: 'Anteckningsbok LEITZ Complete A4 rutat' },
    { id: '68be85dd094d08828df0051f', name: 'Ant.bok BURDE A5 textil linj' },
    { id: '68be85dd094d08828df00521', name: 'Anteckningsbok LEITZ Complete A5 linj' },
    { id: '68be85dd094d08828df00586', name: 'Ant.bok BURDE A5 beige' },
    { id: '68be85dd094d08828df00587', name: 'Anteckningsblock OXFORD MY RECUP A4 rut' },
    { id: '68be85dd094d08828df00588', name: 'Ant.bok BURDE A4 textil linj' },
    { id: '68be85dd094d08828df00589', name: 'Ant.block LINICOLOR A4+ 3-flik sort' },
    { id: '68be85dd094d08828df0058a', name: 'Kollegieblock FW A5 60g 70bl rut oh' },
    { id: '68be85dd094d08828df0058c', name: 'Kollegieblock FW A5 70g 70bl rut h' },
    { id: '68be85dd094d08828df0058d', name: 'Anteckningsbok inbunden A5 linjerad blå' },
    { id: '68be85dd094d08828df0058e', name: 'Ant.bok BURDE A5 textil olinj. mörkblå' },
    { id: '68be85dd094d08828df0058f', name: 'Ant.bok BURDE A4 textil olinj mörkblå' },
    { id: '68be85dd094d08828df00590', name: 'Kollegieblock FW A4 80g 80bl rut' },
    { id: '68be85dd094d08828df00591', name: 'Kollegieblock FW A4 70g 70bl linj' },
    { id: '68be85dd094d08828df00592', name: 'Kollegieblock FW A4 60g 70bl linj h' },
    { id: '68be85dd094d08828df00593', name: 'Ant.bok BURDE A5 textil olinj svart' },
    { id: '68be85dd094d08828df00594', name: 'Anteckningsbok inbunden A4 linjerad blå' },
    { id: '68be85dd094d08828df00595', name: 'Kollegieblock FW A4 70g 80bl linj' },
    { id: '68be85dd094d08828df00596', name: 'Anteckningsbok BURDE A5 Marble' },
    { id: '68be85dd094d08828df00598', name: 'Anteckningsbok BURDE A5 Flower' },
    { id: '68be85dd094d08828df0059a', name: 'Kollegieblock FW A4 70g 70bl rut' },
    { id: '68be85dd094d08828df0059b', name: 'Kollegieblock FW A5 70g 70bl linj oh' },
    { id: '68be85dd094d08828df0059c', name: 'Refill A7 block, 2-pack' },
    { id: '68be85dd094d08828df0059e', name: 'Ant.block LINICOLOR A5+ 3-flik sort' },
    { id: '68be85dd094d08828df0059f', name: 'Kollegieblock FW A4 80g 80bl linj' },
    { id: '68be85dd094d08828df005a1', name: 'Anteckningsbok inbunden A4 rutad blå' },
    { id: '68be85dd094d08828df005a6', name: 'Anteckningsbok BURDE A5 Notes' },
    { id: '68be85dd094d08828df005a7', name: 'Anteckningsbok BURDE A5' },
    { id: '68be85dd094d08828df005a9', name: 'Journalistblock A7, svart' },
    { id: '68be85dd094d08828df005ab', name: 'Kollegieblock FW A4 70g 80bl rut' },
    { id: '68be85dd094d08828df005ac', name: 'Anteckningsbok BURDE Deluxe A5 grön' },
    { id: '68be85dd094d08828df005ad', name: 'Kollegieblock FW A4 60g 70bl rut h grå' },
    { id: '68be85dd094d08828df00622', name: 'Ant.bok FORMAT A6 linj 24 blad' },
    { id: '68be85dd094d08828df00623', name: 'Kollegieblock FW A5 60g 70bl linj oh' },
    { id: '68be85dd094d08828df00624', name: 'Kollegieblock FW A5 70g 70bl rut oh' },
    { id: '68be85dd094d08828df00625', name: 'Kollegieblock FW A4 70g 70bl olinj' },
    { id: '68be85dd094d08828df00626', name: 'Kollegieblock FW A5 70g 70bl linj h' },
    { id: '68be85dd094d08828df00628', name: 'Anteckningsbok BURDE A4 black' },
    { id: '68be85dd094d08828df0062b', name: 'Anteckningsbok BANTEX A4 rutad blå' },
    { id: '68be85dd094d08828df0062d', name: 'Ant.bok Oxford Signature A5 rutad svart' },
    { id: '68be85dd094d08828df0062f', name: 'Kollegieblock OXFORD Origins A4+ lin' },
    { id: '68be85dd094d08828df00630', name: 'Anteckningsbok BURDE Soft A5 svart' },
    { id: '68be85dd094d08828df00632', name: 'Ant.block RHODIA A7 80b linj svart' },
    { id: '68be85dd094d08828df00634', name: 'Anteckningsbok BURDE A5 Notes' },
    { id: '68be85dd094d08828df00636', name: 'Anteckningsbok MOLESKINE A5 svart' },
    { id: '68be85dd094d08828df00637', name: 'Spiralblock 140x90mm linj' },
    { id: '68be85dd094d08828df00638', name: 'Anteckningsblock OXFORD MY RECUP A4 linj' },
  ],

  // matlador (95 products)
  'matlador': [
    { id: '68be85ad094d08828def459e', name: 'PYRUS. Lunchlåda. 1000ml PP hermetisk låda' },
    { id: '68be85af094d08828def4d7f', name: 'Beibabox - PLA-majs lunchlåda 1000ml' },
    { id: '68be85af094d08828def4e8c', name: 'Tintoretto Lunchbox' },
    { id: '68be85af094d08828def4ed5', name: 'Kolapso - Hopvikbar lunchlåda i silikon' },
    { id: '68be85b0094d08828def4f48', name: 'Rebento lunchlåda' },
    { id: '68be85b0094d08828def50d7', name: 'Fuboo lunchlåda' },
    { id: '68be85b0094d08828def5130', name: 'Vitrio Lunch - Lunchlåda i glas 800 ml' },
    { id: '68be85b0094d08828def515e', name: 'Lunchlåda av PP med dubbla lager Maxton' },
    { id: '68be85b0094d08828def5171', name: 'Lunchbox med dubbla väggar Nash' },
    { id: '68be85b1094d08828def533f', name: 'Lunchbox i PP Ondine' },
    { id: '68be85b1094d08828def5356', name: 'MIYO lunchlåda i dubbla lager' },
    { id: '68be85b1094d08828def5357', name: 'MIYO lunchlåda i ett lager' },
    { id: '68be85b1094d08828def5358', name: 'Mepal Ellipse lunch box' },
    { id: '68be85b1094d08828def5359', name: 'Mepal Take-a-break stor lunchlåda' },
    { id: '68be85b1094d08828def535a', name: 'Mepal Take-a-break lunchlåda midi' },
    { id: '68be85b1094d08828def535c', name: 'MIYO lunchlåda i ett lager' },
    { id: '68be85b1094d08828def535d', name: 'MIYO lunchlåda i dubbla lager' },
    { id: '68be85b1094d08828def5361', name: 'MIYO Renew lunchlåda i ett lager' },
    { id: '68be85b1094d08828def5364', name: 'Black+Blum Lunch Box Original' },
    { id: '68be85b1094d08828def5368', name: 'Black+Blum Lunchskål i glas 750 ml' },
    { id: '68be85b1094d08828def5387', name: 'Lunchbox i PP Ondine' },
    { id: '68be85b1094d08828def53b6', name: 'Dovi 800 ml lunchlåda' },
    { id: '68be85b1094d08828def53b8', name: 'Sunday - Lunchlåda med bestick' },
    { id: '68be85b1094d08828def53b9', name: 'Lux Lunch - Lunchlåda i PP för mikro' },
    { id: '68be85b1094d08828def53bb', name: 'Thursday - Lunchlåda med bambulock' },
    { id: '68be85b1094d08828def53be', name: 'Lekker - PP-lunchlåda 700 ml' },
    { id: '68be85b1094d08828def53c0', name: 'Kolapso - Hopvikbar lunchlåda i silikon' },
    { id: '68be85b1094d08828def53c6', name: 'Lunchbox i PP Selwyn' },
    { id: '68be85b1094d08828def53e3', name: 'Mepal Lunchbox Take a Break midi 900 ml matboks' },
    { id: '68be85b1094d08828def53e5', name: 'Mepal Lunchbox Bento Large 1,5 L lunchlåda' },
    { id: '68be85b1094d08828def53e7', name: 'Mepal Bento Cirqula Bowl' },
    { id: '68be85b1094d08828def53eb', name: 'Mepal Lunchbox Take a Break large 1,5 L matboks' },
    { id: '68be85b1094d08828def53ec', name: 'Lunchlåda Fresh 1000ml' },
    { id: '68be85b1094d08828def53ee', name: 'Mepal Lunchbox Bento midi 900 ml lunchlåda' },
    { id: '68be85b1094d08828def53ef', name: 'Lunchbox One 950ml' },
    { id: '68be85b1094d08828def53f0', name: 'Lunchlåda Smörgås' },
    { id: '68be85b1094d08828def53f3', name: 'Lunchlåda 1200ml' },
    { id: '68be85b1094d08828def53f5', name: 'DILL. Infällbar hermetisk låda i silikon och PP (480 & 760ml)' },
    { id: '68be85b1094d08828def5450', name: 'Mepal Lunchbox Take a Break Flat 800 ml matboks' },
    { id: '68be85b1094d08828def5451', name: 'Lunchbox med dubbla väggar Nash' },
    { id: '68be85b1094d08828def5456', name: 'Amuse Classic Lunchbox Medium' },
    { id: '68be85b1094d08828def545b', name: 'Amuse Classic Lunchbox Large' },
    { id: '68be85b1094d08828def54a2', name: 'Mepal Snackpot Ellipse 500 ml' },
    { id: '68be85b1094d08828def54a3', name: 'Sondix lunchlåda' },
    { id: '68be85b1094d08828def54a5', name: 'Fuboo lunchlåda' },
    { id: '68be85ca094d08828defa92d', name: 'Brabantia Make & Take Lunchlåda Stor 2 L' },
    { id: '68be85ca094d08828defa92e', name: 'Brabantia Make & Take Lunchlåda Medium 1,1 L' },
    { id: '68be85ca094d08828defa932', name: 'Amuse Lunchbox 3-in-1' },
    { id: '68be85ca094d08828defa933', name: 'Amuse Lunchbox Clip 670 ml' },
    { id: '68be85ca094d08828defa935', name: 'Amuse Snackbox Small 200 ml' },
    { id: '68be85ca094d08828defaa15', name: 'Förvaringslåda, PP, äpple, Danika' },
    { id: '68be85ca094d08828defab16', name: 'Black+Blum Lunch Pot Original' },
    { id: '68be85cb094d08828defacd4', name: 'Lunchlåda i stål Kasen' },
    { id: '68be85cb094d08828defadd9', name: 'Delibox 1300 box för avhämtning' },
    { id: '68be85cb094d08828defade1', name: 'Delibox 750 box för avhämtning' },
    { id: '68be85cf094d08828defc7be', name: 'Lox - Lunchlåda 850 ml' },
    { id: '68be85d0094d08828defc91c', name: 'Sud - PP-lunchlåda för barn' },
    { id: '68be85d0094d08828defcaac', name: 'Canoa - Lunchlåda i glas med korklock' },
    { id: '68be85d0094d08828defccda', name: 'Lunchbox i glas Nicole' },
    { id: '68be85d0094d08828defcd09', name: 'Picasso Lunchbox' },
    { id: '68be85d0094d08828defcd1e', name: 'Tundra 3 - Lunchlåda med bambulock' },
    { id: '68be85d0094d08828defcd27', name: 'Lox Plus - Lunchlåda 1500 ml' },
    { id: '68be85d1094d08828defd141', name: 'Bambento lunchlåda' },
    { id: '68be85d3094d08828defdb35', name: 'Laksa lunchlåda' },
    { id: '68be85d3094d08828defdb78', name: 'Makan - Lunchlåda med bestick i PP' },
    { id: '68be85d4094d08828defdbca', name: 'Iceberg - kylväska RPET med lunchlåda' },
    { id: '68be85d4094d08828defdd9e', name: 'Adobo lunchlåda' },
    { id: '68be85d4094d08828defded0', name: 'Planche PLA lunchlåda' },
    { id: '68be85d4094d08828defdee6', name: 'Ruttata lunchlåda av glas' },
    { id: '68be85d4094d08828defe012', name: 'Jolly - Presentset' },
    { id: '68be85d4094d08828defe029', name: 'Vista 750 ml salladsskål' },
    { id: '68be85df094d08828df00c71', name: 'PP lunchlåda med spork' },
    { id: '68be85e2094d08828df01577', name: 'Lunchlåda Fresh 1000ml' },
    { id: '68be85e3094d08828df0174b', name: 'Lunchbox One 950ml' },
    { id: '68be85e3094d08828df01800', name: 'Lunchlåda Smörgås' },
    { id: '68be85e4094d08828df0193a', name: 'Lunchlåda 1200ml' },
    { id: '68be85e6094d08828df02096', name: 'MIYO lunchlåda i dubbla lager' },
    { id: '68be85e6094d08828df0209e', name: 'MIYO lunchlåda i ett lager' },
    { id: '68be85e8094d08828df02669', name: 'Mepal Lunchbox Take a Break midi 900 ml matboks' },
    { id: '68be85e8094d08828df0266b', name: 'Mepal Lunchbox Bento Large 1,5 L lunchlåda' },
    { id: '68be85e8094d08828df0266d', name: 'Mepal Bento Cirqula Bowl' },
    { id: '68be85e8094d08828df02671', name: 'Mepal Lunchbox Take a Break large 1,5 L matboks' },
    { id: '68be85e8094d08828df02672', name: 'Mepal Lunchbox Bento midi 900 ml lunchlåda' },
    { id: '68be85e8094d08828df02679', name: 'Mepal Lunchbox Take a Break Flat 800 ml matboks' },
    { id: '68be85e8094d08828df0267b', name: 'Mepal Isolerad Stål Lunchpot Ellipse Titanium 500 ml' },
    { id: '68be85e8094d08828df0267d', name: 'Mepal Basic Bento Lunchskål Vita 1,5 L' },
    { id: '68be85e8094d08828df0267f', name: 'Mepal Snackpot Ellipse 500 ml' },
    { id: '68be85e8094d08828df026d1', name: 'Sondix lunchlåda' },
    { id: '68be85e9094d08828df02c03', name: 'Roby lunchlåda i glas med bambulock' },
    { id: '68be85e9094d08828df02cd5', name: 'Sunday - Lunchlåda med bestick' },
    { id: '68be85e9094d08828df02cdf', name: 'Lux Lunch - Lunchlåda i PP för mikro' },
    { id: '68be85e9094d08828df02d88', name: 'MIYO lunchlåda i ett lager' },
    { id: '68be85ea094d08828df02e1c', name: 'MIYO lunchlåda i dubbla lager' },
    { id: '68be85eb094d08828df030c6', name: 'MIYO Renew lunchlåda i dubbla lager' },
    { id: '68be85eb094d08828df030da', name: 'MIYO Renew lunchlåda i ett lager' },
  ],

  // forkladen (95 products)
  'forkladen': [
    { id: '68be85ad094d08828def46a0', name: 'VESPER. Förkläde i 100 % bomullsduk (300 g/m²) med metalldetaljer' },
    { id: '68be85ad094d08828def4750', name: 'Sandhamn, förkläde' },
    { id: '68be85ad094d08828def4753', name: 'Florens, förkläde' },
    { id: '68be85ad094d08828def4766', name: 'Florens, serveringsförkläde' },
    { id: '68be85ae094d08828def4a77', name: 'CUMIN. Förkläde i bomullstwill (180 g/m²)' },
    { id: '68be85af094d08828def4c55', name: 'Kandinsky Apron' },
    { id: '68be85af094d08828def4d12', name: 'Rubens Apron' },
    { id: '68be85af094d08828def4de5', name: 'Goya Apron' },
    { id: '68be85b1094d08828def533c', name: 'Canvasförkläde (450 gsm) Maria' },
    { id: '68be85b1094d08828def5428', name: 'Naima Apron - Förkläde i Hampa 200 gr/m²' },
    { id: '68be85b1094d08828def542b', name: 'Klassiskt Förkläde Barn' },
    { id: '68be85b1094d08828def542c', name: 'Organic Cotton Bib Apron' },
    { id: '68be85b1094d08828def542d', name: 'Sandhamn, förkläde' },
    { id: '68be85b1094d08828def542e', name: 'Förkläde Canvas' },
    { id: '68be85b1094d08828def5431', name: 'Förkläde' },
    { id: '68be85b1094d08828def5432', name: 'Förkläde Bomull Will' },
    { id: '68be85b1094d08828def5433', name: 'Förkläde Waxed Denim' },
    { id: '68be85b1094d08828def5434', name: 'Midjeförkläde Waxed Denim' },
    { id: '68be85b1094d08828def5435', name: 'Apron - Förkläde - 170 g/m²' },
    { id: '68be85b1094d08828def5436', name: 'Förkläde District Waxed Denim' },
    { id: '68be85b1094d08828def5437', name: 'Förkläde Jeans Stitch Denim' },
    { id: '68be85b1094d08828def5438', name: 'Förkläde Denim' },
    { id: '68be85b1094d08828def545f', name: 'Annex Oxford Bib Apron' },
    { id: '68be85b1094d08828def5460', name: 'Midjeförkläde Contrast Denim' },
    { id: '68be85b1094d08828def5462', name: 'Midjeförkläde Jeans Stitch Denim' },
    { id: '68be85b1094d08828def5464', name: 'Pema - Förkläde - 180 g/m²' },
    { id: '68be85b1094d08828def5465', name: 'Cocina Organic Cotton (180 g/m²) förkäde' },
    { id: '68be85b1094d08828def5466', name: 'Apron (130 g/m²) förkläde' },
    { id: '68be85b1094d08828def5469', name: 'CELERY. Non-woven förkläde (80 g/m²)' },
    { id: '68be85b1094d08828def546a', name: 'Hanna - Förkläde - 340 g / m²' },
    { id: '68be85b1094d08828def546c', name: 'Förkläde' },
    { id: '68be85b1094d08828def546f', name: 'Bröstlappsförkläde' },
    { id: '68be85b1094d08828def5471', name: 'Florens, serveringsförkläde' },
    { id: '68be85b1094d08828def5473', name: 'VESPER. Förkläde i 100 % bomullsduk (300 g/m²) med metalldetaljer' },
    { id: '68be85b1094d08828def54cd', name: 'Kandinsky Apron' },
    { id: '68be85b1094d08828def54ce', name: 'CUMIN. Förkläde i bomullstwill (180 g/m²)' },
    { id: '68be85b1094d08828def54cf', name: 'Rubens Apron' },
    { id: '68be85b1094d08828def54d0', name: 'Goya Apron' },
    { id: '68be85b1094d08828def54d1', name: 'Canvasförkläde (450 gsm) Maria' },
    { id: '68be85b1094d08828def54d2', name: 'Förkläde i Bomull' },
    { id: '68be85b1094d08828def54d4', name: 'Förkläde randigt' },
    { id: '68be85b1094d08828def54d5', name: 'Midjeförkläde Canvas' },
    { id: '68be85b1094d08828def54d6', name: 'Choux förkläde' },
    { id: '68be85b1094d08828def54d7', name: 'Garcon förkläde' },
    { id: '68be85b1094d08828def54d8', name: 'Madeline' },
    { id: '68be85b2094d08828def54e8', name: 'Filippa Förkläde' },
    { id: '68be85c1094d08828def8853', name: 'Bröstlappsförkläde' },
    { id: '68be85c1094d08828def8854', name: 'Bröstlappsförkläde' },
    { id: '68be85c1094d08828def89c8', name: 'Klassiskt Förkläde Barn' },
    { id: '68be85c1094d08828def89c9', name: 'Förkläde Canvas' },
    { id: '68be85c1094d08828def89cf', name: 'Förkläde Waxed Denim' },
    { id: '68be85c1094d08828def89d0', name: 'Midjeförkläde Waxed Denim' },
    { id: '68be85c1094d08828def89d3', name: 'Förkläde Jeans Stitch Denim' },
    { id: '68be85c1094d08828def8a31', name: 'Midjeförkläde Jeans Stitch Denim' },
    { id: '68be85c1094d08828def8b13', name: 'Midjeförkläde Canvas' },
    { id: '68be85ca094d08828defa90d', name: 'Midjeförkläde' },
    { id: '68be85ca094d08828defa90e', name: 'Skinnförkläde' },
    { id: '68be85ca094d08828defa90f', name: 'RPET-förkläde Baylor' },
    { id: '68be85ca094d08828defa910', name: 'SNYGGT FÖRKLÄDE I HÄRLIG CANVAS' },
    { id: '68be85ca094d08828defa913', name: 'Skinnförkläde' },
    { id: '68be85ca094d08828defa955', name: 'Förkläde Fairtrade' },
    { id: '68be85ca094d08828defab80', name: 'Köksförkläde (fullfärgstryck) EU' },
    { id: '68be85cb094d08828defacc8', name: 'Förkläde i denim (280 g/m²) Greg' },
    { id: '68be85cb094d08828defade2', name: 'Fercook Fairtrade-förkläde' },
    { id: '68be85cb094d08828defaf4f', name: 'CreaChef Kid RPET-förkläde med tryck' },
    { id: '68be85d0094d08828defcb52', name: 'CHICORY. Multifunktionsförkläde i bomullscanvas (260 g/m²)' },
    { id: '68be85d1094d08828defce61', name: 'CreaChef Pocket RPET-förkläde med tryck' },
    { id: '68be85d1094d08828defd13e', name: 'CreaChef Specialtillverkat förkläde' },
    { id: '68be85d2094d08828defd3e3', name: 'Brännö, förkläde skinn' },
    { id: '68be85d2094d08828defd61b', name: 'HOLM. Canvas förkläde i 100 % bomull (320 g/m²) med metalldetaljer' },
    { id: '68be85d4094d08828defdbd3', name: 'Denipur - Förkläde i denim 240gsm' },
    { id: '68be85d4094d08828defddb5', name: 'LAVENDER. Barnförkläde i non-woven (80 g/m²)' },
    { id: '68be85e0094d08828df00e9f', name: 'Nagpur Colour - Förkläde i ekologisk bomull' },
    { id: '68be85e0094d08828df00ea2', name: 'Raipur Colour - Förkläde i ekologisk bomull' },
    { id: '68be85e0094d08828df00fb9', name: 'Cocina GRS Recycled Cotton (160 g/m²) förkläde' },
    { id: '68be85e0094d08828df00fc8', name: 'Cocina Organic Cotton (180 g/m²) förkäde' },
    { id: '68be85e1094d08828df01202', name: 'Apron Recycled Cotton (170 g/m²) förkläde' },
    { id: '68be85e2094d08828df01459', name: 'Organic Cotton Bib Apron' },
    { id: '68be85e3094d08828df01669', name: 'Cocina GRS Recycled Cotton (160 g/m²) förkläde' },
    { id: '68be85e4094d08828df01b73', name: 'Filippa Förkläde' },
    { id: '68be85e4094d08828df01bce', name: 'Bröstlappsförkläde' },
    { id: '68be85e4094d08828df01bcf', name: 'Bröstlappsförkläde' },
    { id: '68be85e4094d08828df01bd3', name: 'Bröstlappsförkläde' },
    { id: '68be85e5094d08828df01c4a', name: 'Bröstlappsförkläde' },
    { id: '68be85e5094d08828df01e08', name: 'Cuoco Förkläde i bomull' },
    { id: '68be85e6094d08828df022da', name: 'Choux förkläde' },
    { id: '68be85e6094d08828df02374', name: 'Garcon förkläde' },
    { id: '68be85e6094d08828df02397', name: 'Madeline' },
    { id: '68be85e7094d08828df0240f', name: 'Madeline' },
    { id: '68be85e8094d08828df026e3', name: 'Cuoco Förkläde i bomull' },
    { id: '68be85e9094d08828df02a93', name: 'Apron - Förkläde - 170 g/m²' },
    { id: '68be85e9094d08828df02aa4', name: 'Förkläde Rand' },
    { id: '68be85e9094d08828df02b11', name: 'Naima Apron - Förkläde i Hampa 200 gr/m²' },
    { id: '68be85e9094d08828df02d59', name: 'Asos - Förkläde - 180 g/m²' },
    { id: '68be85ea094d08828df02e89', name: 'Pema - Förkläde - 180 g/m²' },
  ],

  // midjevaskor (94 products)
  'midjevaskor': [
    { id: '68be85ad094d08828def4814', name: 'Escape, waistbag Bergen' },
    { id: '68be85ad094d08828def4817', name: 'Escape, waistbag Bergen' },
    { id: '68be85ad094d08828def481c', name: 'Duffy, midjeväska' },
    { id: '68be85ad094d08828def4886', name: 'Duffy, bumbag medium' },
    { id: '68be85ad094d08828def4888', name: 'Duffy, bumbag large' },
    { id: '68be85ad094d08828def4897', name: 'Escape, waistbag Bergen' },
    { id: '68be85ae094d08828def49e2', name: 'Lollap RPET midjeväska med korsade axlar' },
    { id: '68be85ae094d08828def4a15', name: 'Toshi - Midjeväska i 300D RPET' },
    { id: '68be85af094d08828def4c05', name: 'Bai - Midjeväska i mjuk PU' },
    { id: '68be85af094d08828def4cf9', name: 'Midjeväska i polyester (600D) Leonardo' },
    { id: '68be85af094d08828def4dc3', name: 'MYKONOS. Midjeväska i 600D återvunnen polyester och foder i 210D återvunnen polyester' },
    { id: '68be85b0094d08828def504a', name: 'Wappu RPET midjeväska' },
    { id: '68be85b0094d08828def510b', name: 'Bangkok Waist - Midjeväska i 600D RPET' },
    { id: '68be85b0094d08828def521a', name: 'CreaWaist Compact midjeväska med tryck' },
    { id: '68be85bf094d08828def8048', name: 'Santander midjeväska' },
    { id: '68be85bf094d08828def8049', name: 'Byron magväska av återvunnet material 1,5 liter' },
    { id: '68be85bf094d08828def804a', name: 'Impact AWARE magväska 285gsm ofärgad rcanvas' },
    { id: '68be85bf094d08828def804c', name: 'Nomad midjeväska för löpning av GRS-återvunnet material' },
    { id: '68be85bf094d08828def804d', name: 'Parkbag - Midjeväska /Magväska' },
    { id: '68be85bf094d08828def804e', name: 'Toshi - Midjeväska i 300D RPET' },
    { id: '68be85bf094d08828def804f', name: 'Bai - Midjeväska i mjuk PU' },
    { id: '68be85bf094d08828def8050', name: 'Belt Bag' },
    { id: '68be85bf094d08828def8051', name: 'Molle Utility Waistpack' },
    { id: '68be85bf094d08828def8052', name: 'Midjeväska STEP' },
    { id: '68be85bf094d08828def8053', name: 'Studio Waistpack' },
    { id: '68be85bf094d08828def8054', name: 'Magväska Oversized Across' },
    { id: '68be85bf094d08828def8055', name: 'Midjeväska i oxfordtyg Ellie' },
    { id: '68be85bf094d08828def8056', name: 'Midjeväska i polyester (300D)' },
    { id: '68be85bf094d08828def80f3', name: 'MUZEUL. 300D midjeväska' },
    { id: '68be85bf094d08828def80f4', name: 'LAGOS. 600D midjeväska' },
    { id: '68be85bf094d08828def80f5', name: 'Midjeväska i polyester (600D) Leonardo' },
    { id: '68be85bf094d08828def80f6', name: 'Belt Bag' },
    { id: '68be85bf094d08828def80f7', name: 'Midjeväska Flash' },
    { id: '68be85bf094d08828def80f8', name: 'Escape, waistbag Bergen' },
    { id: '68be85bf094d08828def80f9', name: 'Duffy, midjeväska' },
    { id: '68be85bf094d08828def80fa', name: 'Midjeväska Belly' },
    { id: '68be85bf094d08828def80fb', name: 'Duffy, bumbag medium' },
    { id: '68be85bf094d08828def80fc', name: 'Duffy, bumbag large' },
    { id: '68be85bf094d08828def80fd', name: 'Escape, waistbag Bergen' },
    { id: '68be85bf094d08828def80fe', name: 'Bältesväska' },
    { id: '68be85bf094d08828def80ff', name: 'Midjeväska Quad' },
    { id: '68be85bf094d08828def81d1', name: 'Oversized belt bag' },
    { id: '68be85bf094d08828def81d2', name: 'Matsuri midjeväska' },
    { id: '68be85bf094d08828def81d3', name: 'Bumber midjeväska' },
    { id: '68be85bf094d08828def81d4', name: 'CreaWaist RFID midjeväska i RPET med tryck' },
    { id: '68be85bf094d08828def81d5', name: 'Lollap RPET midjeväska med korsade axlar' },
    { id: '68be85bf094d08828def81d6', name: 'Wappu RPET midjeväska' },
    { id: '68be85bf094d08828def821e', name: 'Recycled Waistpack' },
    { id: '68be85ca094d08828defaa92', name: 'Midjeväska i polyester (600D) Fabienne' },
    { id: '68be85cb094d08828defaeb8', name: 'Midjeväska ripstop (600D) Juniper' },
    { id: '68be85cd094d08828defb4fe', name: 'Warathon midjeväska med reflexer' },
    { id: '68be85cd094d08828defb92a', name: 'Midjeväska Buddy' },
    { id: '68be85cd094d08828defb92b', name: 'Midjeväska Buddy' },
    { id: '68be85cd094d08828defb92c', name: 'Magväska Donegal Move' },
    { id: '68be85cd094d08828defb93a', name: 'BrandCharger Combo konvertibel väska' },
    { id: '68be85cd094d08828defb93b', name: 'Midjeväska, sport SCHWARZWOLF Mafadi' },
    { id: '68be85cd094d08828defb946', name: 'Reflective Belt Bag' },
    { id: '68be85cd094d08828defb947', name: 'Expandable fitness belt' },
    { id: '68be85cd094d08828defb948', name: 'Running Belt magväska' },
    { id: '68be85cd094d08828defb949', name: 'Midjeväska SLX 5L Performance' },
    { id: '68be85ce094d08828defc2cd', name: 'Midjeväska EU' },
    { id: '68be85d0094d08828defc93c', name: 'Midjeväska, Reflekterande i polyester Jocelyn' },
    { id: '68be85d0094d08828defcaca', name: 'Nyko - Midjeväska i 420D nylon' },
    { id: '68be85d0094d08828defcdb6', name: 'EDINBURGH. Midjeväska i högdensitet 600D återvunnen polyester och 210D återvunnen polyesterfoder' },
    { id: '68be85d1094d08828defce66', name: 'Numet midjeväska' },
    { id: '68be85d1094d08828defcea6', name: 'Midjeväska SCHWARZWOLF MOBILA, vikbar' },
    { id: '68be85d1094d08828defd14b', name: 'Hip Bag - Detroit' },
    { id: '68be85d1094d08828defd158', name: 'Belt Bag - Chicago' },
    { id: '68be85d1094d08828defd15b', name: 'Hip Bag - Helsinki' },
    { id: '68be85d1094d08828defd15f', name: 'Hip Bag - Toronto' },
    { id: '68be85d2094d08828defd2d3', name: 'DELFOS POUCH. Midjeväska av 300D med återvunnen polyester och 600D medåtervunnen polyester med refle' },
    { id: '68be85d3094d08828defd81f', name: 'Cebag - Crossover väska i 600D Rpet' },
    { id: '68be85d3094d08828defdad7', name: 'Midjeväska, i polyester (600D), Amari' },
    { id: '68be85d4094d08828defdcd5', name: 'Otella - Midjeväska' },
    { id: '68be85d4094d08828defdd67', name: 'Broby - Midjeväska' },
    { id: '68be85d4094d08828defdefa', name: 'APRIL. 600D midjeväska' },
    { id: '68be85d4094d08828defdf58', name: 'Cochel RPET midjeväska' },
    { id: '68be85d4094d08828defe092', name: 'Visiwaist - Midjeväska reflexmaterial' },
    { id: '68be85d4094d08828defe0ff', name: 'Midjeväska i neopren med dragkedja' },
    { id: '68be85d5094d08828defe196', name: 'Brott - Midjeväska i 600D RPET' },
    { id: '68be85de094d08828df00a28', name: 'Journey GRS midjeväska' },
    { id: '68be85df094d08828df00ab5', name: 'Byron magväska av återvunnet material 1,5 liter' },
    { id: '68be85df094d08828df00bf4', name: 'Herschel Classic midjeväska' },
    { id: '68be85df094d08828df00c6d', name: 'Impact AWARE magväska 285gsm ofärgad rcanvas' },
    { id: '68be85e0094d08828df00d1b', name: 'Recycled Waistpack' },
    { id: '68be85e0094d08828df01004', name: 'Impact AWARE magväska 285gsm ofärgad rcanvas' },
    { id: '68be85e6094d08828df02287', name: 'Santander midjeväska' },
    { id: '68be85e6094d08828df0229c', name: 'Journey GRS midjeväska' },
    { id: '68be85e6094d08828df02377', name: 'Matsuri midjeväska' },
    { id: '68be85e8094d08828df026db', name: 'Bumber midjeväska' },
    { id: '68be85e9094d08828df029c5', name: 'Parkbag - Midjeväska /Magväska' },
    { id: '68be85ea094d08828df02ecb', name: 'Byron magväska av återvunnet material 1,5 liter' },
    { id: '68be85eb094d08828df03084', name: 'Midjeväska i oxfordtyg Ellie' },
    { id: '68be85eb094d08828df0312d', name: 'Midjeväska i polyester (300D)' },
  ],

  // traningsbyxor (91 products)
  'traningsbyxor': [
    { id: '68be85ad094d08828def47ee', name: 'Basic Sweatpants' },
    { id: '68be85ad094d08828def47fc', name: 'Heavy Sweatpants' },
    { id: '68be85ae094d08828def4930', name: 'Unisex Sponge Fleece Jogger Sweatpants' },
    { id: '68be85ae094d08828def4a76', name: 'THC SPRINT. Mjukisbyxor (unisex)' },
    { id: '68be85b4094d08828def5f5b', name: 'Juve unisex sportset' },
    { id: '68be85b4094d08828def5f5c', name: 'Adelpho byxor för herr' },
    { id: '68be85b4094d08828def5f5d', name: 'Neutral - Unisex Sweatpants med elastiskt avslut' },
    { id: '68be85b4094d08828def5f76', name: 'Juve unisex sportset' },
    { id: '68be85b4094d08828def601b', name: 'Evolve 2.0 Pants M' },
    { id: '68be85b4094d08828def604c', name: 'Craft Korta Kompressionstights Pro Control Unisex' },
    { id: '68be85b4094d08828def604f', name: 'Basic Active Pants' },
    { id: '68be85b4094d08828def6050', name: 'Premium OC Pants' },
    { id: '68be85b4094d08828def6054', name: 'Women"s Cool Capri' },
    { id: '68be85b4094d08828def6056', name: 'Premium OC Pants Women' },
    { id: '68be85b4094d08828def6059', name: 'Women"s performance leggings' },
    { id: '68be85b4094d08828def605a', name: 'Womens Seamless "3D Fit" Multi-sport Sculpt Leggin' },
    { id: '68be85b4094d08828def605b', name: 'Kenai' },
    { id: '68be85b4094d08828def605d', name: 'Joggingshorts Herr' },
    { id: '68be85b4094d08828def6061', name: 'Womens Seamless "3D Fit" Multi-sport Denim Look Le' },
    { id: '68be85b5094d08828def60d9', name: 'Adv Join Sweat Pant M' },
    { id: '68be85b5094d08828def60f2', name: 'Ladies TriDri ® Performance Compression Leggings' },
    { id: '68be85b5094d08828def60f4', name: 'Kenai Women' },
    { id: '68be85b5094d08828def60f5', name: 'TriDri® training leggings' },
    { id: '68be85b5094d08828def60f6', name: 'Womens TriDri® Yoga Leggings' },
    { id: '68be85b5094d08828def60f7', name: 'Womens TriDri® Seamless "3D Fit" Multi-sport Sculp' },
    { id: '68be85b5094d08828def60f8', name: 'Friluftsbyxa, herr' },
    { id: '68be85b5094d08828def60fa', name: 'Friluftsbyxa, dam' },
    { id: '68be85b5094d08828def60fb', name: 'Basic Sweatpants' },
    { id: '68be85b5094d08828def60fd', name: 'Womens TriDri® Ribbed Seamless Multi-Sport Legging' },
    { id: '68be85b5094d08828def60ff', name: 'Men´s Pants' },
    { id: '68be85b5094d08828def61ab', name: 'Rush 2.0 Hot Pant W' },
    { id: '68be85b5094d08828def61e6', name: 'Women´s Pants' },
    { id: '68be85b5094d08828def61e7', name: 'Womens TriDri® Hourglass Leggings' },
    { id: '68be85b5094d08828def61ea', name: 'Unisex Sponge Fleece Jogger Sweatpants' },
    { id: '68be85b5094d08828def61eb', name: 'Pro Explore Hiking Pant M' },
    { id: '68be85b5094d08828def61ed', name: 'Core Nordic Sk Club Fz Pants W' },
    { id: '68be85b5094d08828def61ee', name: 'Girls Cool Athletic Pant' },
    { id: '68be85b5094d08828def61ef', name: 'Core Nordic Ski Club Wind Tights M' },
    { id: '68be85b5094d08828def61f0', name: 'Craft Korta Kompressionstights Pro Control Junior' },
    { id: '68be85b5094d08828def61f3', name: 'Adv Nord Ski Club Wind Tigt Jr' },
    { id: '68be85b5094d08828def61f5', name: 'Adv Join Sweat Pant M' },
    { id: '68be85b5094d08828def62a9', name: 'Rush 2.0 Hot Pant W' },
    { id: '68be85b5094d08828def62af', name: 'Community 2.0 Pants W' },
    { id: '68be85b5094d08828def62b0', name: 'Community 2.0 Pants Jr' },
    { id: '68be85b5094d08828def6392', name: 'Ability 3/4 Tights Uni' },
    { id: '68be85b5094d08828def639a', name: 'Frequent Sweatshorts M' },
    { id: '68be85b6094d08828def648e', name: 'Explore Padded Pants M' },
    { id: '68be85b6094d08828def648f', name: 'Explore Padded Pants W' },
    { id: '68be85b6094d08828def6490', name: 'M\'s Alder lightweight pant' },
    { id: '68be85b6094d08828def6491', name: 'Womens TriDri® Performance Animal printed Leggings' },
    { id: '68be85b6094d08828def6492', name: 'Stratus Lightweight Pants' },
    { id: '68be85b6094d08828def6493', name: 'Hi vis jogging pants (HV016T)' },
    { id: '68be85b6094d08828def6494', name: 'Women"s TriDri® Performance Corners Leggings 3/4' },
    { id: '68be85d1094d08828defcf5c', name: 'THC SPRINT WH. Mjukisbyxor (unisex)' },
    { id: '68be85d5094d08828defe4d6', name: 'Mens TriDri® Ankle Zip Training leggings' },
    { id: '68be85d5094d08828defe4d7', name: 'Men"s Cool Sports Legging' },
    { id: '68be85d5094d08828defe4df', name: 'Explore Power Fleece Tights M' },
    { id: '68be85d5094d08828defe4e0', name: 'Core Explore Shell Pants W' },
    { id: '68be85d5094d08828defe4e1', name: 'Explore Power Fleece Tights W' },
    { id: '68be85d5094d08828defe4e2', name: 'Explore Power Fleece Short Tights W' },
    { id: '68be85d5094d08828defe4e3', name: 'Explore Power Fleece Short Tights M' },
    { id: '68be85d5094d08828defe4e4', name: 'Adv Explore Shell Pants W' },
    { id: '68be85d5094d08828defe4e5', name: 'Adv Explore Shell Pants M' },
    { id: '68be85d5094d08828defe4e6', name: 'Core Explore Shell Pants M' },
    { id: '68be85d5094d08828defe4e7', name: 'Pro Control Pants M' },
    { id: '68be85d5094d08828defe4fd', name: 'Rush 2.0 Zip Tights M' },
    { id: '68be85d5094d08828defe508', name: 'Craft Korta Tights Rush Junior' },
    { id: '68be85d5094d08828defe509', name: 'Adv Essence Short Tights 2 W' },
    { id: '68be85d5094d08828defe50a', name: 'Womens TriDri® Running Shorts' },
    { id: '68be85d5094d08828defe50c', name: 'Rush 2.0 Zip Tights W' },
    { id: '68be85d5094d08828defe51a', name: 'Womens TriDri® High-shine Leggings' },
    { id: '68be85d5094d08828defe51b', name: 'Mens TriDri® Running shorts' },
    { id: '68be85d5094d08828defe51c', name: 'Women"s TriDri® Performance Camo Leggings' },
    { id: '68be85d5094d08828defe51e', name: 'Women"s TriDri® Seamless "3D-fit" Multi-sport Perf' },
    { id: '68be85d5094d08828defe51f', name: 'Womens TriDri® Legging Shorts' },
    { id: '68be85d5094d08828defe521', name: 'Womens Seamless "3D Fit" Multi-sport Reveal Leggin' },
    { id: '68be85d5094d08828defe522', name: 'Women"s capri fitness leggings' },
    { id: '68be85d5094d08828defe523', name: 'Craft Kompressionstights Pro Control Unisex' },
    { id: '68be85d5094d08828defe52f', name: 'Träningsleggings Dam' },
    { id: '68be85d5094d08828defe536', name: 'Stevens Pants' },
    { id: '68be85e1094d08828df011f8', name: 'Neutral - Unisex Sweatpants med elastiskt avslut' },
    { id: '68be85e2094d08828df0151c', name: 'TXlite Flex Shorts Men' },
    { id: '68be85e3094d08828df0166b', name: 'Premium OC Pants' },
    { id: '68be85e3094d08828df01768', name: 'Premium OC Pants Women' },
    { id: '68be85e4094d08828df01b92', name: 'Juve unisex sportset' },
    { id: '68be85e5094d08828df01c17', name: 'Neapolis unisexbyxor' },
    { id: '68be85e5094d08828df01c2e', name: 'Adelpho byxor för dam' },
    { id: '68be85e5094d08828df01c30', name: 'Adelpho byxor för herr' },
    { id: '68be85e5094d08828df01c33', name: 'Argos unisexbyxor' },
    { id: '68be85e5094d08828df01df0', name: 'Men´s Pants' },
    { id: '68be85e5094d08828df01df2', name: 'Women´s Pants' },
  ],

  // ovrigt-fritid (88 products)
  'ovrigt-fritid': [
    { id: '68be85ad094d08828def4658', name: 'SuboBike Frame väska med anpassad cykelram' },
    { id: '68be85af094d08828def4bc5', name: 'SuboBike Handle väska för cykelstyre med tryck' },
    { id: '68be85b1094d08828def538e', name: 'PP visselpipa Damon' },
    { id: '68be85b2094d08828def56f5', name: 'The Fold-A-Cup med tryck' },
    { id: '68be85bc094d08828def7658', name: 'The Fold-A-Cup med tryck' },
    { id: '68be85be094d08828def7ca0', name: 'Grip 2-delat set med träningsband' },
    { id: '68be85be094d08828def7ca1', name: 'Fanny - Solfjäder' },
    { id: '68be85be094d08828def7ca2', name: 'Fanny Wood - Solfjäder' },
    { id: '68be85be094d08828def7d61', name: 'The Fold-A-Cup med tryck' },
    { id: '68be85be094d08828def7d63', name: 'Solfjäder i papper Dylan' },
    { id: '68be85be094d08828def7d64', name: 'Svettband' },
    { id: '68be85be094d08828def7d66', name: 'Svettband, extra brett' },
    { id: '68be85be094d08828def7d68', name: 'Handtränare' },
    { id: '68be85be094d08828def7d6d', name: 'Banda Fitness Band träningsband' },
    { id: '68be85be094d08828def7de7', name: 'Hi-lou flaska 1.8L' },
    { id: '68be85be094d08828def7e5a', name: 'Flaskhållare Cool Hiking' },
    { id: '68be85be094d08828def7e5b', name: 'Bayex träningsband' },
    { id: '68be85be094d08828def7e5c', name: 'Pulpit nordiska vandringsstavar' },
    { id: '68be85be094d08828def7e5d', name: 'Sweber Armband' },
    { id: '68be85be094d08828def7f02', name: 'SuboBike Handle väska för cykelstyre med tryck' },
    { id: '68be85c0094d08828def853a', name: 'SuboBike Frame väska med anpassad cykelram' },
    { id: '68be85ca094d08828defaae8', name: 'Visselpipa i metall Rebecca' },
    { id: '68be85cd094d08828defb9a7', name: 'Träningsmotståndsband Strong Power 15,9-38,6kg' },
    { id: '68be85cd094d08828defb9a8', name: 'Bird Lodge fågelholk' },
    { id: '68be85cd094d08828defb9a9', name: 'Träningsmotståndsband Strong Power 6,8-15kg' },
    { id: '68be85cd094d08828defb9aa', name: 'Träningsmotståndsband Fitness Time' },
    { id: '68be85cd094d08828defb9ab', name: 'Sporthjul' },
    { id: '68be85cd094d08828defb9ac', name: 'Träningsmotståndsband Strong Power 11,3-29,5kg' },
    { id: '68be85cd094d08828defb9ad', name: 'Träningsmotståndsband' },
    { id: '68be85cd094d08828defb9ae', name: 'Träningsmotståndsband Gym Hero' },
    { id: '68be85cd094d08828defb9af', name: 'Hopprep' },
    { id: '68be85cd094d08828defb9b0', name: 'Trädgårdsset' },
    { id: '68be85cd094d08828defb9d0', name: 'Fitnessband' },
    { id: '68be85cd094d08828defb9d1', name: 'Birdhouse fågelholk' },
    { id: '68be85cd094d08828defb9d2', name: 'Skidglasögon med egen logga' },
    { id: '68be85cd094d08828defb9d3', name: 'Media Belt' },
    { id: '68be85cd094d08828defb9d4', name: 'Elastiq Resistance Band träningsband' },
    { id: '68be85cd094d08828defb9d7', name: 'Bouncer hopprep' },
    { id: '68be85cd094d08828defba1d', name: 'Fågelhus, MDF-kit Taylor' },
    { id: '68be85cd094d08828defbcf8', name: 'Volleyboll i PVC Jimmy' },
    { id: '68be85cd094d08828defbfb9', name: 'Whoxy visselpipa' },
    { id: '68be85cf094d08828defc7af', name: 'Xiula - Metall visselpipa' },
    { id: '68be85d0094d08828defcab7', name: 'Nole - Stavar för stavgång' },
    { id: '68be85d0094d08828defccd3', name: 'Gåstavar Schwarzwolf Denali, Set med 2' },
    { id: '68be85d0094d08828defccdd', name: 'Bikupa i trä Fahim' },
    { id: '68be85d0094d08828defcd14', name: 'Flomix - Blandade blommorfrön' },
    { id: '68be85d2094d08828defd233', name: 'Basket Erica' },
    { id: '68be85d2094d08828defd302', name: 'King Petit - Mini Kubbspel' },
    { id: '68be85d2094d08828defd350', name: 'Överdrag, Hjälmöverdrag' },
    { id: '68be85d2094d08828defd35c', name: 'Träningsband, elastiska, set med 3 st, Bettina' },
    { id: '68be85d2094d08828defd3fb', name: 'Rimies - Strandstol i trä' },
    { id: '68be85d2094d08828defd655', name: 'Nyckelring, UV-nyckelring' },
    { id: '68be85d2094d08828defd670', name: 'Hållare, Skidhållare (20 mm)' },
    { id: '68be85d3094d08828defd809', name: 'Klocka, UV-klocka Original' },
    { id: '68be85d3094d08828defd8b8', name: 'Trädgårdskorg Henrik' },
    { id: '68be85d3094d08828defd941', name: 'BURPEE. Set med elastiska band med non-woven påse' },
    { id: '68be85d3094d08828defd96f', name: 'Piri - Träningsredskap' },
    { id: '68be85d3094d08828defda76', name: 'Basket - Basketboll - Ø 20 cm' },
    { id: '68be85d3094d08828defdae7', name: 'Fågelholk målarset Wesley' },
    { id: '68be85d3094d08828defdb53', name: 'Volly - Beachvolleyboll - Ø 17 cm' },
    { id: '68be85d4094d08828defdbd5', name: 'Top Fit - Set med 3st TPE träningsband' },
    { id: '68be85d4094d08828defdc93', name: 'King - Kubbspel i furu' },
    { id: '68be85d4094d08828defdd22', name: 'CreaSnow anpassat skydd för skidglasögon' },
    { id: '68be85d4094d08828defdda0', name: 'CreaTrain anpassat träningsband' },
    { id: '68be85d4094d08828defde64', name: 'Baggy - Dubbelsidig MDF spel' },
    { id: '68be85d4094d08828defde72', name: 'Woohouse - Fågelholk trä' },
    { id: '68be85d4094d08828defde89', name: 'My - Beachbollsset' },
    { id: '68be85d4094d08828defded7', name: 'Svarga yogablock av kork' },
    { id: '68be85d4094d08828defdf0f', name: 'Skräpplockare Stål Olga' },
    { id: '68be85d4094d08828defdf79', name: 'Mori - Yogablock' },
    { id: '68be85d4094d08828defe09a', name: 'Vueltas - Minifläkt' },
    { id: '68be85d4094d08828defe114', name: 'Elastiskt träningsband i gummi Hammad' },
    { id: '68be85de094d08828df00924', name: 'Flowpack med 1st Dextro Energy Tablett' },
    { id: '68be85de094d08828df00925', name: 'Flowpack med 1 st mini Dextro Energy tablett' },
    { id: '68be85e0094d08828df00fb1', name: 'The Fold-A-Cup med tryck' },
    { id: '68be85e3094d08828df01735', name: 'Fitness expander' },
    { id: '68be85e6094d08828df022b5', name: 'Flowpack med 1st Dextro Energy Tablett' },
    { id: '68be85e6094d08828df023ba', name: 'Svettband Hyper med tryck' },
    { id: '68be85e8094d08828df0265e', name: 'Hi-lou flaska 1.8L' },
    { id: '68be85e8094d08828df026f8', name: 'Fanny - Solfjäder' },
    { id: '68be85e8094d08828df02700', name: 'Fanny Wood - Solfjäder' },
    { id: '68be85e8094d08828df027fc', name: 'Bayex träningsband' },
    { id: '68be85e8094d08828df028eb', name: 'Solfjäder i papper Dylan' },
    { id: '68be85e9094d08828df02b8e', name: 'Pulpit nordiska vandringsstavar' },
    { id: '68be85e9094d08828df02d7d', name: 'Flip Flap - Spa toffla i påse' },
    { id: '68be85ea094d08828df02dae', name: 'Solfjäder i plast med tyg Kasimira' },
    { id: '68be85eb094d08828df02fb7', name: 'Virabha yogarem i RPET' },
    { id: '68be85eb094d08828df0312e', name: 'Hållare, Skidhållare Längd' },
  ],

  // blankettfack-och-boxar (85 products)
  'blankettfack-och-boxar': [
    { id: '68be85c3094d08828def90ed', name: 'Förvaringsbox BIGSO L grå' },
    { id: '68be85c3094d08828def90ee', name: 'Blankettbox EXACOMPTA Harlequin 7 lådor' },
    { id: '68be85c3094d08828def90ef', name: 'Blankettbox EXACOMPTA BeeBlue 4 lådor' },
    { id: '68be85c3094d08828def90f0', name: 'Blankettbox EXACOMPTA Skandi 6 lådor' },
    { id: '68be85c3094d08828def90f1', name: 'Blankettbox EXACOMPTA Skandi 4 lådor' },
    { id: '68be85c3094d08828def90f2', name: 'Blankettbox EXACOMPTA BeeBlue 6 lådor' },
    { id: '68be85c3094d08828def90f3', name: 'Blankettfack vägg CEP Mineral 3-fack' },
    { id: '68be85c3094d08828def90f5', name: 'Blankettbox EXACOMPTA BIGBOX 4 låd svart' },
    { id: '68be85c3094d08828def918a', name: 'Blankettbox CEP Smoove 5-lådor vit/beech' },
    { id: '68be85c3094d08828def918b', name: 'Skrivbordsbyrå CEP MoovUp Miner. 3-lådor' },
    { id: '68be85c3094d08828def918c', name: 'Blankettbox CEP Smoove Mineral 5-lådor' },
    { id: '68be85c3094d08828def918d', name: 'Blankettfack EXCOMPTA MODULODOC 12 f grå' },
    { id: '68be85c3094d08828def918e', name: 'Blankettbox EXACOMPTA BIGBOX 5 lådo' },
    { id: '68be85c3094d08828def918f', name: 'Blankettfack vägg CEP Mineral 5-fack grå' },
    { id: '68be85c3094d08828def9198', name: 'Blankettfack ALBA A4L 5-fack sv metall' },
    { id: '68be85c3094d08828def9199', name: 'Blankettfack CEP magnetisk 1-fack svart' },
    { id: '68be85c3094d08828def919b', name: 'Blankettfack ALBA A4S 5-fack sv metall' },
    { id: '68be85c3094d08828def919c', name: 'Blankettbox CEP vändbar svart' },
    { id: '68be85c3094d08828def91a2', name: 'Blankettbox CEP Riviera 5-lådor' },
    { id: '68be85c3094d08828def91a3', name: 'Blankettbox EXACOMPTA BIGBOX 5 lådo' },
    { id: '68be85c3094d08828def91a4', name: 'Blankettbox CEP Moovup 2-lådor' },
    { id: '68be85c3094d08828def91a5', name: 'Blankettbox CEP Moovup 3-lådor' },
    { id: '68be85c3094d08828def91a6', name: 'Blankettfack Flexiboxx A4S 6-fack' },
    { id: '68be85c3094d08828def91a7', name: 'Blankettfack Flexiboxx A4S 12-fack' },
    { id: '68be85c3094d08828def91a9', name: 'Blankettfack CEP ljusgrå' },
    { id: '68be85c3094d08828def91aa', name: 'Blankettfack CEP magnetisk 1-fack transp' },
    { id: '68be85c3094d08828def91ab', name: 'Blankettbox MODULO 5 lådor' },
    { id: '68be85c3094d08828def91ad', name: 'Blankettbox STORE-BOX MAXI 6 lådor' },
    { id: '68be85c3094d08828def91ae', name: 'Blankettfack magnetiskt CEP 361x86x270mm' },
    { id: '68be85c3094d08828def91af', name: 'Blankettbox BIGBOX PLUS 5 lådor svart' },
    { id: '68be85c3094d08828def91b0', name: 'Blankettbox BIG-BOX 4 lådor' },
    { id: '68be85c3094d08828def91b1', name: 'Blankettfack A4S 10-fack transparent' },
    { id: '68be85c3094d08828def91b2', name: 'Blankettbox MODULO 10 lådor' },
    { id: '68be85c3094d08828def91b3', name: 'Broschyrställ för golv A4 40-fack' },
    { id: '68be85c3094d08828def91b4', name: 'Broschyrställ vägg 7 fack A4 Krom' },
    { id: '68be85c3094d08828def91b5', name: 'Förvaringsbox m.lock karton' },
    { id: '68be85c3094d08828def91b6', name: 'Broschyrställ A4 stående 5-fack svart' },
    { id: '68be85c3094d08828def91b7', name: 'Blankettfack CEP Ecoline 1-fack svart' },
    { id: '68be85c3094d08828def91b8', name: 'Förvaringsbox m.lock kartong sto' },
    { id: '68be85c3094d08828def91b9', name: 'Lådinsats ALBA Meshorg 8 fack grå' },
    { id: '68be85c3094d08828def91ba', name: 'Blankettfack LEITZ 5 fack svart/grå' },
    { id: '68be85c3094d08828def91bb', name: 'Blankettfack ALBA A4L 3-fack sv metall' },
    { id: '68be85c3094d08828def91bc', name: 'Förvaringsbox m.lock karton' },
    { id: '68be85c3094d08828def91bd', name: 'Blankettfack Flexiboxx 6 A4L svart' },
    { id: '68be85c3094d08828def91be', name: 'Förvaring med handtag BIGSO' },
    { id: '68be85c3094d08828def91bf', name: 'Skrivbordsbyrå kartong 2-lådo' },
    { id: '68be85c3094d08828def92e8', name: 'Blankettfack CEP ReCeption 5-fack vit' },
    { id: '68be85c3094d08828def92e9', name: 'Skrivbordsbyrå kartong 2-lådo' },
    { id: '68be85c3094d08828def92ea', name: 'Broschyrställ A4 liggande 5-fack svart' },
    { id: '68be85c3094d08828def92eb', name: 'Förvaringsbox m.lock kartong sto' },
    { id: '68be85c3094d08828def92ec', name: 'Blankettfack Flexiboxx A4L 12-fack' },
    { id: '68be85c3094d08828def92ed', name: 'Förvaring med handtag BIGSO Hurry' },
    { id: '68be85c3094d08828def92ee', name: 'Förvaring med handtag BIGSO Hurry' },
    { id: '68be85c3094d08828def92ef', name: 'Förvaringskorg 6 L svart' },
    { id: '68be85c3094d08828def92f0', name: 'Skrivbordsbyrå kart. m. läderhand' },
    { id: '68be85c3094d08828def92f1', name: 'Förvaringsbox m.lock karton' },
    { id: '68be85c3094d08828def92f3', name: 'Utbyggnadsfack Combiboxx 8579 A4' },
    { id: '68be85c3094d08828def92f4', name: 'Blankettfack PALASET 3-fack klar' },
    { id: '68be85c3094d08828def92f5', name: 'Broschyrställ A5 stående 6-fack svart' },
    { id: '68be85c3094d08828def92f6', name: 'Tidningsställ 5-fack svart' },
    { id: '68be85c3094d08828def92f7', name: 'Blankettfack Flexiboxx A4L 12-fack' },
    { id: '68be85c3094d08828def92f8', name: 'Blankettfacksfront Flexiboxx A4 stående' },
    { id: '68be85c3094d08828def92f9', name: 'Skrivbordsbyrå kart. m. läderhand. svart' },
    { id: '68be85c3094d08828def92fa', name: 'Blankettfack Combiboxx 8578 A4' },
    { id: '68be85c3094d08828def92fb', name: 'Blankettfack Flexiboxx A4S 1-fack vit' },
    { id: '68be85c3094d08828def92fc', name: 'Blankettbox Idealbox Basic 5-fack grå' },
    { id: '68be85c3094d08828def92fd', name: 'Blankettfack Combiboxx 8580 A4 Set L' },
    { id: '68be85c3094d08828def92fe', name: 'Blankettfack Flexiboxx A4L 12-fack klar' },
    { id: '68be85c3094d08828def92ff', name: 'Blankettfack Flexiboxx A4S 12-fack klar' },
    { id: '68be85c3094d08828def9300', name: 'Blankettbox HAN 4 lådor svart' },
    { id: '68be85c3094d08828def9301', name: 'Blankettbox DURABLE Varicolor 10' },
    { id: '68be85c3094d08828def9302', name: 'Blankettfack Flexiboxx A4L 6-fack vit' },
    { id: '68be85c3094d08828def9303', name: 'Blankettfack 3-fack transparent' },
    { id: '68be85c3094d08828def9304', name: 'Blankettfack FlexiPlus A4L 2-fack klar' },
    { id: '68be85c3094d08828def9305', name: 'Blankettbox DURABLE Varicolor 5' },
    { id: '68be85c3094d08828def9306', name: 'Blankettfack FlexiPlus A4L 2 fack svart' },
    { id: '68be85c3094d08828def9307', name: 'Blankettfack Flexiboxx A4S 12-fack' },
    { id: '68be85c3094d08828def9308', name: 'Blankettfack FlexiPlus A5S 2-fack klar' },
    { id: '68be85c3094d08828def9309', name: 'Blankettfack Flexiboxx A4L 6-fack klar' },
    { id: '68be85c3094d08828def930a', name: 'Blankettbox HAN 5 lådor svart' },
    { id: '68be85c3094d08828def930b', name: 'Blankettfack Flexiboxx A4S 6-fack' },
    { id: '68be85c3094d08828def930c', name: 'Blankettfack Flexiboxx A4S 6-fack klar' },
    { id: '68be85c3094d08828def930d', name: 'Blankettfack FlexiPlus A4S 2-fack klar' },
    { id: '68be85c3094d08828def930e', name: 'Förvaringsbox m.lock kartong stor linne' },
    { id: '68be85c3094d08828def930f', name: 'Skrivbordsbyrå kart. m. läderhand' },
  ],

  // friluftsliv (84 products)
  'friluftsliv': [
    { id: '68be85ae094d08828def49c1', name: 'Victorinox fickkniv Spartan' },
    { id: '68be85ae094d08828def4add', name: 'Faltbar - Hopvikbart sittunderlag' },
    { id: '68be85b0094d08828def504c', name: 'Gorner Mini mini multifunktionell fickkniv' },
    { id: '68be85b0094d08828def50d3', name: 'Breithorn multifunktionell fickkniv' },
    { id: '68be85b0094d08828def5109', name: 'Onda - Bärbar radio med LED-ficklampa' },
    { id: '68be85b0094d08828def5190', name: 'Gorner Plus multifunktionell fickkniv' },
    { id: '68be85b2094d08828def564c', name: 'Onda - Bärbar radio med LED-ficklampa' },
    { id: '68be85bd094d08828def7ac0', name: 'Nödsovsäck Bivy 2 pack NYHET' },
    { id: '68be85be094d08828def7d24', name: 'Opinel Colorama No 08 fickkniv' },
    { id: '68be85be094d08828def7d26', name: 'Fickkniv "Slide it"' },
    { id: '68be85be094d08828def7d27', name: 'Nödkniv "Distress"' },
    { id: '68be85be094d08828def7d39', name: 'Epsy 3-in-1  sked, gaffel och kniv' },
    { id: '68be85be094d08828def7d3d', name: 'Moments - Sittunderlag' },
    { id: '68be85be094d08828def7d3e', name: 'Vikmuggen  0,2 L' },
    { id: '68be85be094d08828def7d3f', name: 'LILLKÅSA OVAL 0,4 l' },
    { id: '68be85be094d08828def7d41', name: 'KÅSA RUND, 0,2 L' },
    { id: '68be85be094d08828def7d42', name: 'Enjow - Sittunderlag med ficka' },
    { id: '68be85be094d08828def7d43', name: 'Flex Sittdyna' },
    { id: '68be85be094d08828def7d44', name: 'Sittunderlag vikbar präglad 390x290x5 mm' },
    { id: '68be85be094d08828def7d46', name: 'Sittunderlag Rektangulär' },
    { id: '68be85be094d08828def7d47', name: 'Sittunderlag Trippelvikt' },
    { id: '68be85be094d08828def7d48', name: 'Fanseat anpassad stadionkudde' },
    { id: '68be85be094d08828def7dbe', name: 'Mingus' },
    { id: '68be85be094d08828def7dbf', name: 'Gorner Mini mini multifunktionell fickkniv' },
    { id: '68be85be094d08828def7dc0', name: 'Breithorn multifunktionell fickkniv' },
    { id: '68be85be094d08828def7dcc', name: 'Edmund Karbinhake' },
    { id: '68be85be094d08828def7dcd', name: 'Peary Överlevnadsarmband' },
    { id: '68be85c1094d08828def87a5', name: 'Victorinox fickkniv Spartan' },
    { id: '68be85ca094d08828defa95b', name: 'Lampa med camping-funktion: ABS multifunktionell Araminta' },
    { id: '68be85ca094d08828defa95c', name: 'Lampa ABS Hadrian' },
    { id: '68be85cc094d08828defb170', name: 'Galloway multifunktionell fickkniv' },
    { id: '68be85cc094d08828defb177', name: 'Mears fickkniv' },
    { id: '68be85cd094d08828defb790', name: 'RYGGSÄCK WATERPROOF' },
    { id: '68be85cd094d08828defb9d9', name: 'Utomhus/Campinglampa' },
    { id: '68be85cd094d08828defb9da', name: 'Campinglampa' },
    { id: '68be85cd094d08828defb9db', name: 'Campinglampa med fläkt' },
    { id: '68be85cd094d08828defb9dc', name: 'Sovsäck' },
    { id: '68be85cd094d08828defb9f4', name: 'Angus fickkniv' },
    { id: '68be85cd094d08828defba1f', name: 'RYGGSÄCK WATERPROOF' },
    { id: '68be85cd094d08828defba20', name: 'Karl-Johan väska med svampkniv (6) Beige/svart' },
    { id: '68be85cd094d08828defba21', name: 'Stapi Set - Campingbestick i 3 delar' },
    { id: '68be85cd094d08828defba22', name: 'Homey"s Binoculars Katie kikare' },
    { id: '68be85cd094d08828defba23', name: 'Opinel Outdoor M Bältesfodral' },
    { id: '68be85cd094d08828defba24', name: 'Fickkniv MA-BU' },
    { id: '68be85cd094d08828defba25', name: 'Fickkniv "Eco Cut"' },
    { id: '68be85cd094d08828defba26', name: 'Fickkniv Bamboo Hit' },
    { id: '68be85cd094d08828defba27', name: 'Lock-It fickkniv' },
    { id: '68be85cd094d08828defba28', name: 'Columbus överlevnadskniv' },
    { id: '68be85cd094d08828defba2a', name: 'Fife - Fällkniv i aluminium' },
    { id: '68be85d0094d08828defc938', name: 'Skarp - Fällkniv i akacia' },
    { id: '68be85d0094d08828defcb75', name: 'Stroud multifunktionell fickkniv' },
    { id: '68be85d1094d08828defcea8', name: 'Väska uppblåsbar SCHWARZWOLF KASAI 10L' },
    { id: '68be85d1094d08828defcf38', name: 'Kikare Schwarzwolf TRIVOR, i neoprenfodral' },
    { id: '68be85d1094d08828defcf41', name: 'Victorinox Fickkniv Bantam' },
    { id: '68be85d1094d08828defcf49', name: 'Fickkniv, Klassisk SD, Victorinox®' },
    { id: '68be85d1094d08828defcfa1', name: 'Bladekork - Fällkniv med kork' },
    { id: '68be85d1094d08828defd0ec', name: 'Madrass uppblåsbar SCHWARZWOLF SAJAMA' },
    { id: '68be85d2094d08828defd30e', name: 'Sithru - Kompakt lättviktskikare' },
    { id: '68be85d2094d08828defd374', name: 'Bluetooth-solcellsdriven nödradio med handvev' },
    { id: '68be85d2094d08828defd3a9', name: 'ZIKMUND. Metall Kompass' },
    { id: '68be85d2094d08828defd444', name: 'Sovsäck Schwarzwolf Kinabalu' },
    { id: '68be85d3094d08828defd7e0', name: 'Stormkök 10 delar' },
    { id: '68be85d4094d08828defdc1b', name: 'Svampkniv Schwarzwolf Pilz' },
    { id: '68be85d4094d08828defdce3', name: 'Fickkniv Schwarzwolf Yerger' },
    { id: '68be85d4094d08828defdf23', name: 'Mansan - Vikbar kniv i bambu' },
    { id: '68be85d4094d08828defdf70', name: 'Tilla - Fickkniv' },
    { id: '68be85d4094d08828defdf9d', name: 'Kikare i plast Giselle' },
    { id: '68be85e0094d08828df00ef7', name: 'Flex Sittdyna' },
    { id: '68be85e1094d08828df010a1', name: 'Nödsovsäck Bivy 2 pack NYHET' },
    { id: '68be85e3094d08828df017ca', name: 'Vikmuggen  0,2 L' },
    { id: '68be85e3094d08828df017cb', name: 'LILLKÅSA OVAL 0,4 l' },
    { id: '68be85e3094d08828df017cd', name: 'KÅSA RUND, 0,2 L' },
    { id: '68be85e5094d08828df01ed0', name: 'Sittunderlag handtag 360x270x7 mm' },
    { id: '68be85e5094d08828df01ed5', name: 'Sittunderlag vikbar präglad 390x290x5 mm' },
    { id: '68be85e6094d08828df02143', name: 'Opinel Colorama No 08 fickkniv' },
    { id: '68be85e6094d08828df02228', name: 'Epsy 3-in-1  sked, gaffel och kniv' },
    { id: '68be85e6094d08828df0237f', name: 'Edmund Karbinhake' },
    { id: '68be85e7094d08828df0241d', name: 'Peary Överlevnadsarmband' },
    { id: '68be85e7094d08828df02591', name: 'Mingus' },
    { id: '68be85e8094d08828df02687', name: 'Sittunderlag Rektangulär' },
    { id: '68be85e8094d08828df026cb', name: 'Mingus' },
    { id: '68be85e9094d08828df02afc', name: 'Enjow - Sittunderlag med ficka' },
    { id: '68be85ea094d08828df02e34', name: 'Sittunderlag Trippelvikt' },
    { id: '68be85ea094d08828df02e38', name: 'Sittunderlag Dubbelvikt' },
  ],

  // halsdukar-scarfs (80 products)
  'halsdukar-scarfs': [
    { id: '68be85b0094d08828def4fda', name: 'Mellax RPET multifunktionell halsduk' },
    { id: '68be85b0094d08828def5141', name: 'Fleece scarf Pure' },
    { id: '68be85b0094d08828def5149', name: 'Halsduk Wrap' },
    { id: '68be85b5094d08828def6095', name: 'Elles AWARE Polylana® halsduk 180x30cm' },
    { id: '68be85b5094d08828def6096', name: 'Bandana Bandido - Scarf i Polycotton' },
    { id: '68be85b5094d08828def609f', name: 'Supreme bomullshalsduk' },
    { id: '68be85b5094d08828def60a4', name: 'Wood Made Halsduk' },
    { id: '68be85b5094d08828def60a5', name: 'Wood Lux Halsduk' },
    { id: '68be85b5094d08828def60a6', name: 'Scarf' },
    { id: '68be85b5094d08828def60a7', name: 'Scarf' },
    { id: '68be85b5094d08828def60aa', name: 'Halsduk' },
    { id: '68be85b5094d08828def60ab', name: 'Halsduk' },
    { id: '68be85b5094d08828def60ac', name: 'Scarf' },
    { id: '68be85b5094d08828def60ad', name: 'Halsduk' },
    { id: '68be85b5094d08828def60ae', name: 'Scarf' },
    { id: '68be85b5094d08828def6131', name: 'Fleecehalsduk' },
    { id: '68be85b5094d08828def6132', name: 'Scarf' },
    { id: '68be85b5094d08828def6136', name: 'JASON. Polar fleece halsduk (200 g/m²)' },
    { id: '68be85b5094d08828def6137', name: 'Scarf/Bandana' },
    { id: '68be85b5094d08828def6138', name: 'Scarf' },
    { id: '68be85b5094d08828def6139', name: 'Scarf' },
    { id: '68be85b5094d08828def613a', name: 'Scarf' },
    { id: '68be85b5094d08828def613b', name: 'Ella' },
    { id: '68be85b5094d08828def613c', name: 'Scarf' },
    { id: '68be85b5094d08828def613d', name: 'Scarf' },
    { id: '68be85b5094d08828def613e', name: 'Helsinki scarf' },
    { id: '68be85b5094d08828def613f', name: 'His & Her scarf' },
    { id: '68be85b5094d08828def6141', name: 'Fleece scarf Pure' },
    { id: '68be85b5094d08828def6142', name: 'Halsduk Wrap' },
    { id: '68be85b5094d08828def6144', name: 'Essence Wool Necktube' },
    { id: '68be85b5094d08828def6147', name: 'Essence Wool Headband' },
    { id: '68be85b5094d08828def6148', name: 'Core Essence Headband' },
    { id: '68be85b5094d08828def6220', name: 'Summit mångsidig scarf' },
    { id: '68be85b5094d08828def6227', name: 'Capra halsduk' },
    { id: '68be85b5094d08828def6228', name: 'Drippan halsduk' },
    { id: '68be85b5094d08828def6229', name: 'Swoosh halsvärmare och mössa' },
    { id: '68be85b5094d08828def622b', name: 'Chamonix halsduk för män' },
    { id: '68be85d0094d08828defc943', name: 'Halsduk 2-i-1 Schwarzwolf Mogoton, stickad multifunktionell' },
    { id: '68be85d4094d08828defdcae', name: 'Denali - Set mössa, halsduk, vante RPET' },
    { id: '68be85d4094d08828defe15d', name: 'Glovii uppvärmd halsduk. Svart' },
    { id: '68be85d5094d08828defe514', name: 'Explore Power Fleece Headband' },
    { id: '68be85d5094d08828defe515', name: 'Explore Power Fleece Necktube' },
    { id: '68be85d5094d08828defe516', name: 'Halsduk Schwarzwolf Mismi, varm och multifunktionell' },
    { id: '68be85d5094d08828defe517', name: 'Set i fleece med mössa och halsduk' },
    { id: '68be85d5094d08828defe526', name: 'Mjuk halsvärmare' },
    { id: '68be85d5094d08828defe527', name: 'Herringbone halsduk' },
    { id: '68be85d5094d08828defe528', name: 'London halsduk' },
    { id: '68be85d5094d08828defe529', name: 'Birmingham halsduk' },
    { id: '68be85d5094d08828defe52a', name: 'Re:Knit halsduk' },
    { id: '68be85d5094d08828defe52c', name: 'Vävd halsduk' },
    { id: '68be85d5094d08828defe52d', name: 'Fashionhalsduk med vävd applikation' },
    { id: '68be85df094d08828df00c67', name: 'Impact AWARE Polylana®stickad halsduk 180x25cm' },
    { id: '68be85e0094d08828df00e62', name: 'Impact AWARE Polylana®stickad halsduk 180x25cm' },
    { id: '68be85e1094d08828df01122', name: 'Supreme bomullshalsduk' },
    { id: '68be85e2094d08828df01269', name: 'Elles AWARE Polylana® halsduk 180x30cm' },
    { id: '68be85e3094d08828df017d3', name: 'Ella' },
    { id: '68be85e4094d08828df019e3', name: 'Helsinki scarf' },
    { id: '68be85e5094d08828df01e67', name: 'Scarf' },
    { id: '68be85e5094d08828df01e6c', name: 'Scarf' },
    { id: '68be85e5094d08828df01e6e', name: 'Scarf' },
    { id: '68be85e5094d08828df01e75', name: 'Scarf' },
    { id: '68be85e5094d08828df01e7c', name: 'Halsduk' },
    { id: '68be85e5094d08828df01e81', name: 'Halsduk' },
    { id: '68be85e5094d08828df01e86', name: 'Scarf' },
    { id: '68be85e5094d08828df01e87', name: 'Halsduk' },
    { id: '68be85e5094d08828df01f44', name: 'Scarf' },
    { id: '68be85e5094d08828df01f4f', name: 'Scarf' },
    { id: '68be85e5094d08828df01f52', name: 'Scarf' },
    { id: '68be85e5094d08828df01f5c', name: 'Scarf/Bandana' },
    { id: '68be85e5094d08828df01f5d', name: 'Scarf' },
    { id: '68be85e5094d08828df01f63', name: 'Scarf' },
    { id: '68be85e6094d08828df02046', name: 'Scarf' },
    { id: '68be85e6094d08828df02047', name: 'Scarf' },
    { id: '68be85e6094d08828df02049', name: 'Scarf' },
    { id: '68be85e6094d08828df0204d', name: 'Scarf' },
    { id: '68be85e6094d08828df021d9', name: 'Summit mångsidig scarf' },
    { id: '68be85e6094d08828df02272', name: 'Capra halsduk' },
    { id: '68be85e6094d08828df02390', name: 'Drippan halsduk' },
    { id: '68be85e7094d08828df02414', name: 'Swoosh halsvärmare och mössa' },
    { id: '68be85e9094d08828df02d18', name: 'Fleecehalsduk' },
  ],

  // traryggsparmar-a4 (78 products)
  'traryggsparmar-a4': [
    { id: '68be85c4094d08828def95b9', name: 'Gaffelpärm ACTUAL 60mm FSC' },
    { id: '68be85c4094d08828def95ba', name: 'Gaffelpärm ACTUAL 60mm FSC' },
    { id: '68be85c4094d08828def95bb', name: 'Gaffelpärm ACTUAL 60mm FSC' },
    { id: '68be85c4094d08828def95bc', name: 'Gaffelpärm ACTUAL 60mm FSC' },
    { id: '68be85c4094d08828def95bd', name: 'Gaffelpärm ACTUAL 60mm FSC' },
    { id: '68be85c4094d08828def95be', name: 'Mapp LEITZ Premium 0,15 A4 100/fp' },
    { id: '68be85c4094d08828def95bf', name: 'Gaffelpärm ACTUAL 60mm FSC' },
    { id: '68be85c4094d08828def95c0', name: 'Gaffelpärm ACTUAL 60mm FSC' },
    { id: '68be85c4094d08828def95c1', name: 'Gaffelpärm ACTUAL 40mm FSC' },
    { id: '68be85c4094d08828def971a', name: 'Gaffelpärm ACTUAL 40mm FSC' },
    { id: '68be85c4094d08828def971c', name: 'Gaffelpärm ACTUAL 40mm FSC' },
    { id: '68be85c4094d08828def971d', name: 'Gaffelpärm JOPA A4 60mm' },
    { id: '68be85c4094d08828def971e', name: 'Gaffelpärm FSC A4 40mm' },
    { id: '68be85c4094d08828def971f', name: 'Kontorspärm ACTUAL A4L 60mm blå' },
    { id: '68be85c4094d08828def9720', name: 'Gaffelpärm JOPA A4 60mm' },
    { id: '68be85c4094d08828def9721', name: 'Kontorspärm neutral A4 80mm' },
    { id: '68be85c4094d08828def9722', name: 'Kontorspärm neutral A4 80mm' },
    { id: '68be85c4094d08828def9723', name: 'Gaffelpärm JOPA A4 60mm' },
    { id: '68be85c4094d08828def9724', name: 'Gaffelpärm JOPA A4 60mm' },
    { id: '68be85c4094d08828def9725', name: 'Gaffelpärm ACTUAL 60mm FSC' },
    { id: '68be85c4094d08828def9726', name: 'Gaffelpärm JOPA A4 40mm' },
    { id: '68be85c4094d08828def9727', name: 'Gaffelpärm JOPA A4 60mm' },
    { id: '68be85c4094d08828def9728', name: 'Gaffelpärm ACTUAL 40mm FSC' },
    { id: '68be85c4094d08828def9729', name: 'Gaffelpärm JOPA A4 40mm' },
    { id: '68be85c4094d08828def972a', name: 'Gaffelpärm ACTUAL 60mm FSC' },
    { id: '68be85c4094d08828def972b', name: 'Kontorspärm neutral A4 80mm' },
    { id: '68be85c4094d08828def972c', name: 'Gaffelpärm ACTUAL 40mm FSC' },
    { id: '68be85c4094d08828def972d', name: 'Gaffelpärm FSC A4 60mm' },
    { id: '68be85c4094d08828def972e', name: 'Gaffelpärm JOPA A4 40mm' },
    { id: '68be85c4094d08828def972f', name: 'Gaffelpärm FSC A4 40mm' },
    { id: '68be85c4094d08828def9730', name: 'Gaffelpärm JOPA A4 40mm' },
    { id: '68be85c4094d08828def9731', name: 'Gaffelpärm FSC A4 60mm' },
    { id: '68be85c4094d08828def9732', name: 'Gaffelpärm ACTUAL 40mm FSC' },
    { id: '68be85c4094d08828def9733', name: 'Kontorspärm neutral A4 40mm' },
    { id: '68be85c4094d08828def9734', name: 'Gaffelpärm JOPA A4 60mm' },
    { id: '68be85c4094d08828def9735', name: 'Gaffelpärm JOPA A4 40mm' },
    { id: '68be85c4094d08828def9736', name: 'Gaffelpärm AGRIPPA A5 60mm svart' },
    { id: '68be85c4094d08828def9737', name: 'Gaffelpärm JOPA A4 60mm' },
    { id: '68be85c4094d08828def9738', name: 'Gaffelpärm FSC A4 40mm' },
    { id: '68be85c4094d08828def9739', name: 'Gaffelpärm FSC A4 40mm' },
    { id: '68be85c4094d08828def973a', name: 'Gaffelpärm JOPA A4 40mm' },
    { id: '68be85c4094d08828def973b', name: 'Gaffelpärm FSC A4 60mm' },
    { id: '68be85c4094d08828def973c', name: 'Gaffelpärm JOPA A4 60mm' },
    { id: '68be85c4094d08828def973d', name: 'Gaffelpärm FSC A4 60mm' },
    { id: '68be85c4094d08828def973e', name: 'Gaffelpärm JOPA A4 40mm' },
    { id: '68be85c4094d08828def973f', name: 'Gaffelpärm FSC A4 40mm' },
    { id: '68be85c4094d08828def9740', name: 'Gaffelpärm FSC A4 60mm' },
    { id: '68be85c4094d08828def9741', name: 'Kontorspärm neutral A4 80mm' },
    { id: '68be85c5094d08828def98f4', name: 'Gaffelpärm JOPA A4 60mm' },
    { id: '68be85c5094d08828def98f5', name: 'Kontorspärm neutral A4 80mm' },
    { id: '68be85c5094d08828def98f6', name: 'Gaffelpärm JOPA A4 40mm' },
    { id: '68be85c5094d08828def98f7', name: 'Gaffelpärm JOPA A4 60mm' },
    { id: '68be85c5094d08828def98f8', name: 'Kontorspärm neutral A4 80mm' },
    { id: '68be85c5094d08828def98f9', name: 'Gaffelpärm FSC A4 40mm' },
    { id: '68be85c5094d08828def98fa', name: 'Gaffelpärm JOPA A4 60mm' },
    { id: '68be85c5094d08828def98fb', name: 'Gaffelpärm FSC A4 40mm' },
    { id: '68be85c5094d08828def98fd', name: 'Gaffelpärm JOPA A4 40mm' },
    { id: '68be85c5094d08828def98ff', name: 'Kontorspärm neutral A4 80mm' },
    { id: '68be85c5094d08828def9901', name: 'Gaffelpärm JOPA A4 60mm' },
    { id: '68be85c5094d08828def9902', name: 'Kontorspärm neutral A4 40mm' },
    { id: '68be85c5094d08828def9903', name: 'Kontorspärm neutral A4 40mm' },
    { id: '68be85c5094d08828def9904', name: 'Gaffelpärm JOPA A4 40mm' },
    { id: '68be85c5094d08828def9905', name: 'Gaffelpärm ACTUAL 60mm FSC mintgrön' },
    { id: '68be85c5094d08828def9906', name: 'Kontorspärm neutral A4 60mm' },
    { id: '68be85c5094d08828def9907', name: 'Kontorspärm neutral A4 40mm' },
    { id: '68be85c5094d08828def9908', name: 'Kontorspärm neutral A4 60mm' },
    { id: '68be85c5094d08828def9909', name: 'Kontorspärm neutral A4 60mm' },
    { id: '68be85c5094d08828def990c', name: 'Kontorspärm neutral A4 60mm' },
    { id: '68be85c5094d08828def9912', name: 'Kontorspärm neutral A4 60mm' },
    { id: '68be85c5094d08828def9914', name: 'Kontorspärm ACTUAL A3L 60mm blå' },
    { id: '68be85c5094d08828def9915', name: 'Gaffelpärm JOPA A4 40mm' },
    { id: '68be85c5094d08828def9916', name: 'Kontorspärm neutral A4 40mm' },
    { id: '68be85c5094d08828def9917', name: 'Gaffelpärm FSC A4 40mm bordeaux' },
    { id: '68be85c5094d08828def9918', name: 'Kontorspärm ACTUAL A5 60mm blå' },
    { id: '68be85c5094d08828def9920', name: 'Kontorspärm neutral A3 60mm blå' },
    { id: '68be85c5094d08828def9921', name: 'Pärm LAF LEITZ 180 EU-hål. A4/80mm vit' },
    { id: '68be85c5094d08828def9924', name: 'Ringpärm EU A4 ficka rygg o framsida vit' },
    { id: '68be85c5094d08828def992a', name: 'Gaffelpärm JOPA A4 60 mm linne' },
  ],

  // brevkorgar (75 products)
  'brevkorgar': [
    { id: '68be85c3094d08828def911a', name: 'Brevkorg LYRECO A4' },
    { id: '68be85c3094d08828def911b', name: 'Brevkorg CEP Mineral 4-korg grå-vit-rosa' },
    { id: '68be85c3094d08828def911d', name: 'Blankettfack EXCOMPTA vertikal 5 av. ECO' },
    { id: '68be85c3094d08828def911e', name: 'Brevkorg EXACOMPTA combo2 standard' },
    { id: '68be85c3094d08828def911f', name: 'Brevkorg ARCHIVO 2000 A4' },
    { id: '68be85c3094d08828def9120', name: 'Brevkorg ARCHIVO 2000 A4' },
    { id: '68be85c3094d08828def9121', name: 'Brevkorg DJOIS A4 Eco svart' },
    { id: '68be85c3094d08828def9122', name: 'Brevkorg TWINCO Panorama 4 del' },
    { id: '68be85c3094d08828def9208', name: 'Brevkorg EXACOMPTA A4+ combo2 mini svart' },
    { id: '68be85c3094d08828def9209', name: 'Brevkorg DURABLE ECO' },
    { id: '68be85c3094d08828def920a', name: 'Brevkorg DURABLE ECO' },
    { id: '68be85c3094d08828def920b', name: 'Tidskriftssamlare CEP Mineral grå' },
    { id: '68be85c3094d08828def920c', name: 'Brevkorg ARCHIVO 2000 A4' },
    { id: '68be85c3094d08828def920d', name: 'Brevkorg EXACOMPTA BeeBlue A4 4/fp' },
    { id: '68be85c3094d08828def920e', name: 'Brevkorg HAN recycle A4' },
    { id: '68be85c3094d08828def920f', name: 'Brevkorg ARCHIVO 2000 A4' },
    { id: '68be85c3094d08828def9210', name: 'Brevkorg HAN A4' },
    { id: '68be85c3094d08828def9211', name: 'Brevkorg EXACOMPTA combo2 standard klar' },
    { id: '68be85c3094d08828def9212', name: 'Blankettbox Idealbox grå' },
    { id: '68be85c3094d08828def9213', name: 'Brevkorg HAN A4' },
    { id: '68be85c3094d08828def9214', name: 'Brevkorg ARCHIVO 2000 A4' },
    { id: '68be85c3094d08828def9215', name: 'Brevkorg LYRECO A4' },
    { id: '68be85c3094d08828def9216', name: 'Prylställ CEP Silva 5 fack Bamboo' },
    { id: '68be85c3094d08828def9217', name: 'Brevkorg HAN A4' },
    { id: '68be85c3094d08828def9218', name: 'Brevkorg EXACOMPTA combo2 öpp.lån' },
    { id: '68be85c3094d08828def9219', name: 'Häftstift EXACOMPTA sort.färger 1000/fp' },
    { id: '68be85c3094d08828def9222', name: 'Brevkorg Jumbo EXACOMPTA combo2 blå' },
    { id: '68be85c3094d08828def922b', name: 'Brevkorg ARCHIVO 2000 A4 transp. röd' },
    { id: '68be85c3094d08828def922c', name: 'Distanspinne LYRECO brevkorg svart 4/fp' },
    { id: '68be85c3094d08828def922d', name: 'Brevkorg CEP Maxi A4 svart' },
    { id: '68be85c3094d08828def922e', name: 'Brevkorg ARCHIVO 2000 A4 transp.turkosbl' },
    { id: '68be85c3094d08828def922f', name: 'Brevkorg Jumbo LEITZ Plus öpp.lång blå' },
    { id: '68be85c3094d08828def9231', name: 'Brevkorg DURABLE Varicolor A4 grå 5/fp' },
    { id: '68be85c3094d08828def9232', name: 'Brevkorg LYRECO A4 klar' },
    { id: '68be85c3094d08828def923a', name: 'Brevkorg EXACOMPTA combo2 öpp.lån' },
    { id: '68be85c3094d08828def923b', name: 'Brevkorg LEITZ WOW Plus' },
    { id: '68be85c3094d08828def923c', name: 'Brevkorg CEP Maxi transparent' },
    { id: '68be85c3094d08828def923d', name: 'Brevkorg EXACOMPTA combo2 standard' },
    { id: '68be85c3094d08828def923e', name: 'Brevkorg HAN Maxi' },
    { id: '68be85c3094d08828def9248', name: 'Brevkorg HAN recycle A4' },
    { id: '68be85c4094d08828def9368', name: 'Häftstift EXACOMPTA mässing 750/fp' },
    { id: '68be85c4094d08828def9369', name: 'Brevkorg Jumbo EXACOMPTA öpp.lång svart' },
    { id: '68be85c4094d08828def936a', name: 'Brevkorg metall 1 fack A4 svart' },
    { id: '68be85c4094d08828def936e', name: 'Brevkorg CEP Happy A4 lila' },
    { id: '68be85c4094d08828def936f', name: 'Brevkorg standard LEITZ Plus' },
    { id: '68be85c4094d08828def9370', name: 'Blankettbox BIGBOX PLUS 5 lådor regnbåge' },
    { id: '68be85c4094d08828def9371', name: 'Brevkorg LEITZ Sorty Jumbo' },
    { id: '68be85c4094d08828def9373', name: 'Blankettbox DJOIS 4 lådor Eco svart' },
    { id: '68be85c4094d08828def937d', name: 'Brevkorg EXACOMPTA forever svart' },
    { id: '68be85c4094d08828def937e', name: 'Brevkorg Jumbo LEITZ Plus' },
    { id: '68be85c4094d08828def937f', name: 'Blankettbox CEP Happy Multicolour' },
    { id: '68be85c4094d08828def9380', name: 'Blankettbox DURABLE Varicolor 4 Safe' },
    { id: '68be85c4094d08828def9381', name: 'Brevkorg EXACOMPTA combo2 maxi svart' },
    { id: '68be85c4094d08828def9382', name: 'Brevkorg kartong grå 2/fp' },
    { id: '68be85c4094d08828def9383', name: 'Brevkorg HAN recycle A4' },
    { id: '68be85c4094d08828def9385', name: 'Förslagslåda EXACOMPTA transparent' },
    { id: '68be85c4094d08828def9386', name: 'Brevkorg LEITZ WOW Plus' },
    { id: '68be85c4094d08828def9387', name: 'Brevkorg metall 3-facks' },
    { id: '68be85c4094d08828def9388', name: 'Brevkorg EXACOMPTA A4+ Midi öpp.lång blå' },
    { id: '68be85c4094d08828def9389', name: 'Brevkorg BIGSO kartong mint 2/fp' },
    { id: '68be85c4094d08828def938a', name: 'Brevkorgsset EXACOMPTA combo klar 4/fp' },
    { id: '68be85c4094d08828def938b', name: 'Brevkorg HAN A4' },
    { id: '68be85c4094d08828def938c', name: 'Korg BIGSO Konad' },
    { id: '68be85c4094d08828def938d', name: 'Brevkorg EXACOMPTA combo2 standard' },
    { id: '68be85c4094d08828def938e', name: 'Brevkorg standard LEITZ Plus' },
    { id: '68be85c4094d08828def938f', name: 'Brevkorg metall 3-facks' },
    { id: '68be85c4094d08828def9390', name: 'Brevkorg HAN A4' },
    { id: '68be85c4094d08828def9391', name: 'Brevkorg Jumbo LEITZ Plus' },
    { id: '68be85c4094d08828def9394', name: 'Distanspinnar för brevkorgar 4/fp' },
    { id: '68be85c4094d08828def9395', name: 'Brevkorg HAN Maxi' },
    { id: '68be85c4094d08828def9396', name: 'Brevkorg LEITZ Plus transparent' },
    { id: '68be85c4094d08828def9398', name: 'Brevkorg LEITZ Style sidensvart' },
    { id: '68be85c4094d08828def9399', name: 'Brevkorg HAN Ice Black' },
    { id: '68be85c4094d08828def939b', name: 'Brevkorg LEITZ Sorty Jumbo blå' },
    { id: '68be85c4094d08828def939c', name: 'Brevkorg TWINCO Panorama 4 del' },
  ],

  // planbocker (72 products)
  'planbocker': [
    { id: '68be85ad094d08828def480c', name: 'Florens, kreditkortsfodral 6' },
    { id: '68be85ad094d08828def4894', name: 'Florens, kort­ och sedelplånbok' },
    { id: '68be85ad094d08828def489c', name: 'Duffy, wallet' },
    { id: '68be85af094d08828def4bbe', name: 'Carpex RPET kreditkortshållare' },
    { id: '68be85b3094d08828def5904', name: 'Reseset - Passfodral & Bagageetikett' },
    { id: '68be85bf094d08828def7feb', name: 'MMV Luton Plånbok' },
    { id: '68be85bf094d08828def7fff', name: 'C-secure RFID korthållare & plånbok' },
    { id: '68be85bf094d08828def8000', name: 'Standard aluminium RFID korthållare' },
    { id: '68be85bf094d08828def8001', name: 'C-secure RFID korthållare i aluminium' },
    { id: '68be85bf094d08828def8007', name: 'Reseset - Passfodral & Bagageetikett' },
    { id: '68be85bf094d08828def8008', name: 'Korthållare med RFID skydd' },
    { id: '68be85bf094d08828def8009', name: 'Korthållare Anti-skim Soft' },
    { id: '68be85bf094d08828def800f', name: 'Korthållare i plast med RFID-skydd Yara' },
    { id: '68be85bf094d08828def8010', name: 'Nyckelplånbok i nylon, Imelda' },
    { id: '68be85bf094d08828def8011', name: 'Plånbok Schwarzwolf Coin Black i neopren' },
    { id: '68be85bf094d08828def8014', name: 'MEITNER. RFID-blockerande korthållare i aluminium' },
    { id: '68be85bf094d08828def80c9', name: 'Boutique Card Holder' },
    { id: '68be85bf094d08828def80ca', name: 'RFID blockeringskort ABS' },
    { id: '68be85bf094d08828def80cb', name: 'Korthållare Anti-skim' },
    { id: '68be85bf094d08828def80cc', name: 'Florens, kreditkortsfodral 6' },
    { id: '68be85bf094d08828def80cd', name: 'Florens, kort­ och sedelplånbok' },
    { id: '68be85bf094d08828def80ce', name: 'Balboa handväska' },
    { id: '68be85bf094d08828def80cf', name: 'Denar handväska' },
    { id: '68be85bf094d08828def80d0', name: 'Allux kreditkortshållare' },
    { id: '68be85bf094d08828def81a9', name: 'Dirham RPET-väska' },
    { id: '68be85bf094d08828def81ac', name: 'Carpex RPET kreditkortshållare' },
    { id: '68be85c0094d08828def83ff', name: 'Dirham RPET-väska' },
    { id: '68be85ca094d08828defaa03', name: 'BrandCharger Wally Porto kort plånbok' },
    { id: '68be85cb094d08828defaf58', name: 'CreaFelt Card Kreditkortsinnehavare med tryck' },
    { id: '68be85cb094d08828defb018', name: 'CreaFelt Card Plus Kreditkortsinnehavare med tryck' },
    { id: '68be85cd094d08828defb942', name: 'Antiskimming kort' },
    { id: '68be85cd094d08828defb951', name: 'Kreditkortshållare' },
    { id: '68be85cd094d08828defb952', name: 'Blocking - RFID anti-skimming kort, alu' },
    { id: '68be85d0094d08828defc9a7', name: 'Gulden RPET plånbok' },
    { id: '68be85d0094d08828defccc1', name: 'ORVYN. Plånbok i läder med RFID för 10 kort' },
    { id: '68be85d0094d08828defcd9f', name: 'Plånbok, i konstläder, Leanne' },
    { id: '68be85d1094d08828defd070', name: 'Paffix kreditkortshållare' },
    { id: '68be85d1094d08828defd159', name: 'Wallet - Las Vegas' },
    { id: '68be85d2094d08828defd209', name: 'AFFLECK. Plånbok i läder med RFID för 9 kort' },
    { id: '68be85d2094d08828defd3de', name: 'Secure, korthållare 8 Secure' },
    { id: '68be85d2094d08828defd3e4', name: 'Secure, korthållare 6 Secure' },
    { id: '68be85d2094d08828defd431', name: 'Kreditkortsplånbok, (get läder) RFID Roy' },
    { id: '68be85d2094d08828defd562', name: '11017. Plånbok för kvinnor av konstläder' },
    { id: '68be85d2094d08828defd592', name: 'Plånbok RFID Yvonne' },
    { id: '68be85d2094d08828defd5e6', name: 'Secure, korthållare 8 Secure' },
    { id: '68be85d2094d08828defd5e7', name: 'Secure, korthållare 6 Secure' },
    { id: '68be85d2094d08828defd730', name: 'Kreditkortsplånbok RFID Logan' },
    { id: '68be85d3094d08828defd7ec', name: 'RFID-Kort blockerande' },
    { id: '68be85d3094d08828defd8bc', name: 'Kreditkortsplånbok, RFID Lee' },
    { id: '68be85d3094d08828defd9fc', name: 'REEVES. Korthållare i aluminium och PU' },
    { id: '68be85d3094d08828defdae4', name: 'Nyckelplånbok i läder, Zander' },
    { id: '68be85d4094d08828defdbbb', name: 'DANIEL. kork korthållare' },
    { id: '68be85d4094d08828defdbc5', name: 'SANDLER. Metall- och PU-korthållare' },
    { id: '68be85d4094d08828defdc68', name: 'LONE. Dubbel korthållare i metall och PU' },
    { id: '68be85de094d08828df00952', name: 'Recycled Leather Cardholder korthållare' },
    { id: '68be85de094d08828df00969', name: 'Standard aluminium RFID korthållare' },
    { id: '68be85e0094d08828df00ff0', name: 'Dirham RPET-väska' },
    { id: '68be85e4094d08828df0192f', name: 'RFID Blockeringskort' },
    { id: '68be85e4094d08828df019c1', name: 'RFID korthållare med plånbok' },
    { id: '68be85e6094d08828df02251', name: 'RFID blockeringskort ABS' },
    { id: '68be85e6094d08828df02256', name: 'Korthållare aluminium' },
    { id: '68be85e6094d08828df022db', name: 'Balboa handväska' },
    { id: '68be85e6094d08828df022e8', name: 'Denar handväska' },
    { id: '68be85e6094d08828df022ef', name: 'Allux kreditkortshållare' },
    { id: '68be85e6094d08828df02373', name: 'Allux kreditkortshållare' },
    { id: '68be85e6094d08828df02382', name: 'Dirham RPET-väska' },
    { id: '68be85e6094d08828df02395', name: 'Cardox kreditkortshållare' },
    { id: '68be85e7094d08828df02410', name: 'Cardox kreditkortshållare' },
    { id: '68be85e7094d08828df024a7', name: 'Korthållare Anti-skim' },
    { id: '68be85e7094d08828df02574', name: 'MMV Luton Plånbok' },
    { id: '68be85e8094d08828df0293d', name: 'Recycled Leather Cardholder korthållare' },
    { id: '68be85e9094d08828df02d0a', name: 'Korthållare i plast med RFID-skydd Yara' },
  ],

  // mobilhallare-mobilstall (70 products)
  'mobilhallare-mobilstall': [
    { id: '68be85af094d08828def4e22', name: 'Chatom RPET trådlös laddare för bärbar dator' },
    { id: '68be85b0094d08828def512c', name: 'Rinbook - A5 anteckningsbok telefonställ' },
    { id: '68be85b0094d08828def5205', name: 'Cohol Neck nyckelband för mobilhållare, fyrkantigt' },
    { id: '68be85b0094d08828def5212', name: 'Magba magnetisk mobilhållare' },
    { id: '68be85bb094d08828def7397', name: 'Rinbook - A5 anteckningsbok telefonställ' },
    { id: '68be85bd094d08828def7b59', name: 'Chatom RPET trådlös laddare för bärbar dator' },
    { id: '68be85c0094d08828def85e6', name: 'Dot - Mobilhållare' },
    { id: '68be85c0094d08828def85e7', name: 'Mobilhållare Bilfläkt Magnetisk' },
    { id: '68be85c0094d08828def85e9', name: 'PopSockets® Plant mobilhållare' },
    { id: '68be85c0094d08828def85ea', name: 'Magvent mobilhållare för bil' },
    { id: '68be85c0094d08828def873b', name: 'Kameralins, stativ för surfplatta/smartphone' },
    { id: '68be85c0094d08828def873c', name: 'Cross - Mobilhållare' },
    { id: '68be85c0094d08828def873d', name: 'Mobilhållare Händer' },
    { id: '68be85c1094d08828def882f', name: 'PopSockets® 2.0 mobilhållare' },
    { id: '68be85c1094d08828def8830', name: 'Plassi' },
    { id: '68be85c1094d08828def8831', name: 'Rango mobilhållare' },
    { id: '68be85c1094d08828def8835', name: 'Zring mobilhållare ring' },
    { id: '68be85c1094d08828def8836', name: 'Bonabik mobilhållare' },
    { id: '68be85c1094d08828def8837', name: 'Cohol Neck nyckelband för mobilhållare, fyrkantigt' },
    { id: '68be85c1094d08828def8875', name: 'Chatom RPET trådlös laddare för bärbar dator' },
    { id: '68be85ca094d08828defabf6', name: 'Handledsband i bomull (D16) Maxim' },
    { id: '68be85cc094d08828defb185', name: 'Modyx skrivbord mobilhållare' },
    { id: '68be85cc094d08828defb356', name: 'Dubbo mobilhållare' },
    { id: '68be85cd094d08828defb7e2', name: 'Ställ för Surfplatta & Laptop' },
    { id: '68be85cd094d08828defb7e3', name: 'Mobilställ "Hold me to go"' },
    { id: '68be85cd094d08828defb7e4', name: 'Smartphone hållare' },
    { id: '68be85cd094d08828defb802', name: 'Smartphone hållare med stressavlastning' },
    { id: '68be85cd094d08828defb83e', name: 'Mobile Stand Smart Alu' },
    { id: '68be85cd094d08828defb8a5', name: 'Mobilhållare för bil' },
    { id: '68be85cd094d08828defb8a7', name: 'Mobilhållare' },
    { id: '68be85ce094d08828defc150', name: 'Nyckel- och mobilhållare av bambu Orlando' },
    { id: '68be85d0094d08828defc941', name: 'Hållare i ABS för mobilen Didi' },
    { id: '68be85d0094d08828defccd7', name: 'Mobilställ i bambu med nyckelring Kian' },
    { id: '68be85d0094d08828defccdf', name: 'Mobilställ i bambu Margarita' },
    { id: '68be85d0094d08828defcd56', name: 'SuboFob Mobile RPET RPET handledsrem för mobil med tryck' },
    { id: '68be85d1094d08828defcff1', name: 'Modek mobilhållare' },
    { id: '68be85d1094d08828defd00b', name: 'Mobilhållare, i gummiträ, Nyla' },
    { id: '68be85d1094d08828defd01f', name: 'ERWIN. Skrivbordsset med mobiltelefonhållare och kopp' },
    { id: '68be85d1094d08828defd0e3', name: 'Mobilring i ABS Brandy' },
    { id: '68be85d1094d08828defd13d', name: 'Boovent mobilhållare för bil' },
    { id: '68be85d2094d08828defd378', name: 'Mobilställ Aluminium' },
    { id: '68be85d2094d08828defd406', name: 'Hocora skrivbordsorganisatör' },
    { id: '68be85d2094d08828defd5bc', name: 'Ellagan - Magnetisk mobilhållare' },
    { id: '68be85d3094d08828defd90e', name: 'Blama - A5 RPET anteckningsbok linje' },
    { id: '68be85d3094d08828defd9cb', name: 'Mobilhållare i ABS Lizzie' },
    { id: '68be85d3094d08828defdabe', name: 'Gankey - Stativ och nyckelring i bambu' },
    { id: '68be85d3094d08828defdb8d', name: 'Labbo hållare för mobil och surfplatta' },
    { id: '68be85d4094d08828defdbd7', name: 'Tuanui - Hållare i bambu för surfplatta' },
    { id: '68be85d4094d08828defdc9b', name: 'Robin - Stativ för surfplatta/smartphon' },
    { id: '68be85d4094d08828defdca3', name: 'Trevis - Mobilstativ bambu med notisar' },
    { id: '68be85d4094d08828defdcdd', name: 'Mobilhållare ABS smart Sienna' },
    { id: '68be85d4094d08828defdce0', name: 'Mobilhållare i ASB Laura' },
    { id: '68be85d4094d08828defdf80', name: 'Fikon - Mobil/Ipadhållare' },
    { id: '68be85d4094d08828defe044', name: 'Panjabi mobilhållare' },
    { id: '68be85d4094d08828defe08d', name: 'Whippy - Mobilhållare i bambu' },
    { id: '68be85d5094d08828defe1b9', name: 'Badbräda i bambu' },
    { id: '68be85de094d08828df00a01', name: 'PopSockets® Plant mobilhållare' },
    { id: '68be85e2094d08828df0149b', name: 'Mobilhållare Bilfläkt Magnetisk' },
    { id: '68be85e2094d08828df0155f', name: 'Mobilhållare bilfläkt basic' },
    { id: '68be85e3094d08828df0173b', name: 'Mobilhållare Händer' },
    { id: '68be85e5094d08828df01e89', name: 'PopSockets® Aluminium mobilhållare' },
    { id: '68be85e5094d08828df01e8b', name: 'PopSockets® 2.0 mobilhållare' },
    { id: '68be85e6094d08828df022e4', name: 'Plassi' },
    { id: '68be85e7094d08828df02418', name: 'Magvent mobilhållare för bil' },
    { id: '68be85e7094d08828df02589', name: 'Rango mobilhållare' },
    { id: '68be85e9094d08828df02b7b', name: 'Kameralins, stativ för surfplatta/smartphone' },
    { id: '68be85e9094d08828df02c8c', name: 'Cross - Mobilhållare' },
    { id: '68be85e9094d08828df02d48', name: 'Barry' },
    { id: '68be85e9094d08828df02d6b', name: 'Dot - Mobilhållare' },
    { id: '68be85ea094d08828df02e77', name: 'Zring mobilhållare ring' },
  ],

  // mobilladdare (70 products)
  'mobilladdare': [
    { id: '68be85b8094d08828def6a30', name: 'Rizo - 3 kablar' },
    { id: '68be85c0094d08828def85c4', name: 'Freal 5 W trådlös laddningsplatta' },
    { id: '68be85c0094d08828def85c5', name: 'SCX.design W12 trådlös laddningsstation' },
    { id: '68be85c0094d08828def8634', name: 'Unipad - Trådlös laddningsplatta' },
    { id: '68be85c0094d08828def86f3', name: 'Musmatta med Trådlös Laddning 5W' },
    { id: '68be85c0094d08828def8715', name: 'Trådlös laddningsplatta 5W' },
    { id: '68be85c0094d08828def8717', name: 'Blade Air Wireless charging pad 5W' },
    { id: '68be85c0094d08828def8719', name: 'Trådlös laddstation 5W' },
    { id: '68be85c0094d08828def8791', name: 'Laddsladd Get Three' },
    { id: '68be85c0094d08828def8792', name: 'Laddsladd Retract' },
    { id: '68be85c1094d08828def87eb', name: 'Trådlös laddningsstation' },
    { id: '68be85c9094d08828defa839', name: 'Light & Charge' },
    { id: '68be85ca094d08828defaa20', name: 'Kolvik - Bluetooth-högtalare' },
    { id: '68be85cb094d08828defad75', name: 'RPET-trådlös snabbladdningsmusmatta Selene' },
    { id: '68be85cb094d08828defad78', name: 'Nyckelring i bambu Sutton' },
    { id: '68be85cb094d08828defaeb0', name: 'Nyckelring i bambu Bianca' },
    { id: '68be85cc094d08828defb171', name: 'Komono multifunktionell skrivbordslampa' },
    { id: '68be85cd094d08828defb4f8', name: 'Mugory nyckelring USB-laddarkabel' },
    { id: '68be85cd094d08828defb7e7', name: 'Laddplatta Induction' },
    { id: '68be85cd094d08828defb7e8', name: 'Laddplatta Reloaded' },
    { id: '68be85cd094d08828defb7e9', name: 'Mobilställ med laddning' },
    { id: '68be85cd094d08828defb7ea', name: 'Trådlös laddningsplatta bambu 15W' },
    { id: '68be85cd094d08828defb7f2', name: 'Laddsladd Announcer' },
    { id: '68be85cd094d08828defb7f4', name: 'Laddsladd Roll On' },
    { id: '68be85cd094d08828defb7f5', name: 'Laddsladd Transfer' },
    { id: '68be85cd094d08828defb7f7', name: 'Sinox universal 90W strömförsörjning' },
    { id: '68be85cd094d08828defb81e', name: 'Laddsladd Charge distance' },
    { id: '68be85cd094d08828defb850', name: 'iOS Connector iPhone' },
    { id: '68be85cd094d08828defb88e', name: 'SCX.design C50 5-i-1 snabbladdningssladd på 100 W/5 A med digital display' },
    { id: '68be85cd094d08828defb894', name: 'SCX.design C49 5-i-1-laddningssladd' },
    { id: '68be85cd094d08828defb896', name: 'SCX.design C48 CarPlay 5-i-1-laddningssladd' },
    { id: '68be85cd094d08828defb899', name: 'Mobilställ  FutureMultiFlexCharge' },
    { id: '68be85cd094d08828defb89a', name: 'Pennkopp med laddning FutureChargeDeskHub' },
    { id: '68be85cd094d08828defb89d', name: 'SCX.design W16 15 W upplyst trådlöst laddningsställ' },
    { id: '68be85cd094d08828defb8ba', name: 'SCX.design W13 10 W trådlös laddningsstation i trä' },
    { id: '68be85cd094d08828defbfbc', name: 'Komugo USB-laddkabel' },
    { id: '68be85ce094d08828defc143', name: 'Cortona - A5 anteckningsbok/15W laddare' },
    { id: '68be85cf094d08828defc7ad', name: 'Neuz - Trådlös laddplatta 15W' },
    { id: '68be85d0094d08828defc931', name: 'Clauerc - Nyckelring och stativ i bambu' },
    { id: '68be85d0094d08828defcac1', name: 'Sibit - Trådlös laddare & muggvärmare' },
    { id: '68be85d0094d08828defcd55', name: 'Galaxy RABS multifunktionell skrivbordslampa' },
    { id: '68be85d1094d08828defce08', name: 'Orio - Vikbar laddningsstation 15W' },
    { id: '68be85d1094d08828defcff3', name: 'Junshan trådlös laddare koppvärmare' },
    { id: '68be85d2094d08828defd3eb', name: 'Tuono - 15W trådlös högtalare' },
    { id: '68be85d2094d08828defd3ec', name: 'Viento - Bordsfläkt med ljus' },
    { id: '68be85d3094d08828defd9b9', name: 'Koke - 10W trådlös laddningsplatta' },
    { id: '68be85d3094d08828defdb68', name: 'Superpad - RPET musmatta trådlösladd. 15W' },
    { id: '68be85d4094d08828defdbd6', name: 'Uve Charging + - Trådlös laddningsplatta 15W' },
    { id: '68be85d4094d08828defdcb3', name: 'BLASTY. 4-i-1 högtalare i ABS, PP och tyg' },
    { id: '68be85d4094d08828defdd50', name: 'Wireless Plato Set - Reseladdset' },
    { id: '68be85d4094d08828defdd9b', name: 'Chapati trådlös laddare musmatta' },
    { id: '68be85d4094d08828defde68', name: 'Malabar - Laddplatta QI för skrivbord sto' },
    { id: '68be85d4094d08828defdf3f', name: 'Peak 10 W magnetisk trådlös laddningsplatta' },
    { id: '68be85d4094d08828defdf6b', name: 'Helle - Laddhållare/mobil' },
    { id: '68be85d4094d08828defdff1', name: 'Cuadro - Laddplatta i Bambu, Qi laddning' },
    { id: '68be85d4094d08828defe02b', name: 'Essence trådlös laddningsplatta i bambu, 15 W' },
    { id: '68be85d5094d08828defe343', name: 'Atrova trådlös laddare musmatta' },
    { id: '68be85d5094d08828defe373', name: 'RCS Recycled Wireless Charging Mousepad musmatta' },
    { id: '68be85d5094d08828defe377', name: 'Musmatta i kork med inbyggd trådlös laddning musmatta' },
    { id: '68be85d5094d08828defe385', name: 'Skrivbordsorganisatör i bambu, Faye' },
    { id: '68be85e2094d08828df015be', name: 'Magnapad 15W magnetisk 3 i 1 laddningsplatta i RCS rplast' },
    { id: '68be85e4094d08828df01aad', name: 'Trådlös laddningsplatta 5W' },
    { id: '68be85e4094d08828df01bec', name: 'Blade Air Wireless charging pad 5W' },
    { id: '68be85e5094d08828df01c56', name: 'Musmatta med Trådlös Laddning 5W' },
    { id: '68be85e5094d08828df01c5d', name: 'Trådlös laddningsplatta 5W' },
    { id: '68be85e5094d08828df01db6', name: 'Trådlös laddstation 5W' },
    { id: '68be85e7094d08828df02470', name: 'Freal 5 W trådlös laddningsplatta' },
    { id: '68be85e9094d08828df02d6f', name: 'Rizo - 3 kablar' },
    { id: '68be85e9094d08828df02d94', name: 'Trådlös magnetisk laddningsplatta 15W' },
    { id: '68be85eb094d08828df0311e', name: 'Wireless Plato - Rund trådlös laddplatta' },
  ],

  // bil-cykel (69 products)
  'bil-cykel': [
    { id: '68be85ae094d08828def4926', name: 'Sadelskydd i RPET, Florence' },
    { id: '68be85ae094d08828def49bf', name: 'Sadelskydd i RPET, Florence' },
    { id: '68be85af094d08828def4e38', name: 'Edison väska med kabel för EV-laddare' },
    { id: '68be85c0094d08828def879a', name: 'Bellix cykelringklocka' },
    { id: '68be85c0094d08828def879c', name: 'Bike Bell ringklocka' },
    { id: '68be85c0094d08828def879d', name: 'Rush cykelklocka' },
    { id: '68be85c1094d08828def87e7', name: 'Vikbar tratt' },
    { id: '68be85c1094d08828def87e8', name: 'Luftfräschare för bilfläkt' },
    { id: '68be85c1094d08828def8842', name: 'CreaScent luftfräschare för bil' },
    { id: '68be85c1094d08828def889f', name: 'Butix bilbagageorganisatör' },
    { id: '68be85c1094d08828def88a0', name: 'Edison väska med kabel för EV-laddare' },
    { id: '68be85cb094d08828defafc0', name: 'Uppladdningsbar cykellampa  av ABS Elisabeth' },
    { id: '68be85cc094d08828defb187', name: 'CreaPark Eco Pico parkeringskort' },
    { id: '68be85cd094d08828defb508', name: 'CreaPark Pico parkeringskort' },
    { id: '68be85cd094d08828defb7d2', name: 'CreaPark parkeringskort' },
    { id: '68be85cd094d08828defb7da', name: 'Car Air Freshener' },
    { id: '68be85cd094d08828defb7db', name: 'Bilväska "Car assistant"' },
    { id: '68be85cd094d08828defb7dc', name: 'Bilväska "Cable Home"' },
    { id: '68be85cd094d08828defb7dd', name: 'Bilväska "Car-Gadget"' },
    { id: '68be85cd094d08828defb7de', name: 'Bilväska "Super Gadget"' },
    { id: '68be85cd094d08828defb7df', name: 'Bildoft i trä' },
    { id: '68be85cd094d08828defb7e0', name: 'EuroNorm P-skiva' },
    { id: '68be85cd094d08828defb7f8', name: 'Ridella bil solskydd paraply' },
    { id: '68be85cd094d08828defb7f9', name: 'Förvaringsback, hopfällbar, Simon' },
    { id: '68be85cd094d08828defb7fa', name: 'P-Skiva' },
    { id: '68be85cd094d08828defb7fb', name: 'Sunglasses Clip' },
    { id: '68be85cd094d08828defb7fc', name: 'SmartLight cykellampa' },
    { id: '68be85cd094d08828defb818', name: 'Airbell Original Cykelklocka' },
    { id: '68be85cd094d08828defb819', name: 'Airbell Pro Cykelklocka' },
    { id: '68be85cd094d08828defbcbf', name: 'Bicox uppladdningsbar cykellampa' },
    { id: '68be85cd094d08828defbe7b', name: 'Bilorganisatör i polyester (600D) Thatcher' },
    { id: '68be85ce094d08828defc14c', name: 'Påfyllnadsbar bildoft Roman' },
    { id: '68be85cf094d08828defc63f', name: 'Bilux uppladdningsbar cykellampa' },
    { id: '68be85d1094d08828defd131', name: 'Haert - Hjärtformad lampa' },
    { id: '68be85d2094d08828defd1f0', name: 'CreaRide Reflect specialtillverkat RPET-överdrag för cykelsits' },
    { id: '68be85d2094d08828defd3ae', name: 'CRADLE. PE och aluminiumfodrad solskydd för bilar' },
    { id: '68be85d3094d08828defdacb', name: 'Cabag - Väska för laddkabel elbil' },
    { id: '68be85d4094d08828defdc45', name: 'Eddy reparationssats för cyklar' },
    { id: '68be85d4094d08828defdd1d', name: 'Dullux cykelljus set' },
    { id: '68be85d4094d08828defddb7', name: 'DIG. Metall hopfällbar spade med kompass' },
    { id: '68be85d4094d08828defddfb', name: 'Beamix cykelbelysningsset' },
    { id: '68be85d4094d08828defdf4d', name: 'Breton reparationssats för cyklar' },
    { id: '68be85d4094d08828defdf9c', name: 'Parkeringsskiva PVC Donovan' },
    { id: '68be85d4094d08828defdfea', name: 'Ombra Pouch - Solskydd för bil' },
    { id: '68be85d4094d08828defe0fd', name: 'Bilvårdsset 6 delar (600D) Lisbet' },
    { id: '68be85d4094d08828defe106', name: '3M reflexer för cykel' },
    { id: '68be85d5094d08828defe4ae', name: 'Parkeringsskiva Euronorm med Isskrapa' },
    { id: '68be85de094d08828df0085e', name: 'Seat Cover ECO Standard sadelskydd' },
    { id: '68be85de094d08828df0094c', name: 'Seat Cover RPET Standard sadelskydd' },
    { id: '68be85de094d08828df00a3f', name: 'Solar Bikelight cykellampa' },
    { id: '68be85e0094d08828df00e13', name: 'Trunk GRS RPET Felt Organizer Cooler väska' },
    { id: '68be85e0094d08828df00fb3', name: 'Seat Cover ECO Standard sadelskydd' },
    { id: '68be85e1094d08828df0112e', name: 'Trunk GRS RPET Felt Organizer Cooler väska' },
    { id: '68be85e2094d08828df0143f', name: 'Bike Seat Cover GRS RPET sadelskydd' },
    { id: '68be85e2094d08828df0161e', name: 'Vikbar tratt' },
    { id: '68be85e4094d08828df018b2', name: 'Luftfräschare för bilfläkt' },
    { id: '68be85e4094d08828df01930', name: 'Sadelskydd R-PET' },
    { id: '68be85e6094d08828df021f9', name: 'CreaScent luftfräschare för bil' },
    { id: '68be85e6094d08828df0227d', name: 'Rush cykelklocka' },
    { id: '68be85e7094d08828df02429', name: 'Butix bilbagageorganisatör' },
    { id: '68be85e7094d08828df02564', name: 'Cykelklocka' },
    { id: '68be85e7094d08828df02594', name: 'Billok cykellås' },
    { id: '68be85e8094d08828df026ce', name: 'Billok cykellås' },
    { id: '68be85e9094d08828df02b3c', name: 'Sadelskydd "Meilen"' },
    { id: '68be85e9094d08828df02c0f', name: 'Ringring - Ringklocka cykel' },
    { id: '68be85e9094d08828df02c10', name: 'Bypro Rpet - Sadelskydd i RPET' },
    { id: '68be85e9094d08828df02c6d', name: 'Hopvikbar väska (80 gr/m2) och organisatör för bilen' },
    { id: '68be85ea094d08828df02db2', name: 'Cykelbelysning med två LED-lampor, Abigail' },
    { id: '68be85ea094d08828df02ef6', name: 'Cykellampa med 4 LED-lampor Duncan' },
  ],

  // balloons (68 products)
  'balloons': [
    { id: '68be85ad094d08828def476a', name: 'Ballong med tryck' },
    { id: '68be85ad094d08828def476c', name: 'Reklamballong med eget tryck' },
    { id: '68be85ad094d08828def476d', name: 'Ballongbokstäver i guld 50 cm' },
    { id: '68be85ad094d08828def476e', name: 'Reklamballong Metallic 33 cm' },
    { id: '68be85ad094d08828def476f', name: 'Ballongbokstäver i guld 90 cm' },
    { id: '68be85ad094d08828def4771', name: 'Ballongbokstäver i silver 90 cm' },
    { id: '68be85ad094d08828def4773', name: 'Ballongbokstäver i silver 50 cm' },
    { id: '68be85ad094d08828def4775', name: 'Reklamballong med logo' },
    { id: '68be85ad094d08828def4778', name: 'Reklamballong Crystal 30 cm' },
    { id: '68be85ad094d08828def477a', name: 'Ballongsiffror i guld 50 cm' },
    { id: '68be85ad094d08828def477b', name: 'Ballongsiffror i silver 50 cm' },
    { id: '68be85ad094d08828def477d', name: 'Reklamballong - Metallic 60 cm i diam' },
    { id: '68be85ad094d08828def477f', name: 'Reklamballong - Metallic 90 cm i diam' },
    { id: '68be85ad094d08828def4827', name: 'Reklamballong - Glossy 33 cm i diam' },
    { id: '68be85ad094d08828def4829', name: 'Ballongsiffror i silver ca 86 cm höga' },
    { id: '68be85ad094d08828def482b', name: 'ballongvikt till ballongklasar 170 gram' },
    { id: '68be85ad094d08828def482c', name: 'Ballongsiffror i guld ca 86 cm höga' },
    { id: '68be85b7094d08828def67f8', name: 'Ballong med tryck' },
    { id: '68be85b7094d08828def67fa', name: 'Reklamballong med eget tryck' },
    { id: '68be85b7094d08828def67fb', name: 'Ballongbokstäver i guld 50 cm' },
    { id: '68be85b7094d08828def67fc', name: 'Ballongbokstäver i guld 90 cm' },
    { id: '68be85b7094d08828def67fd', name: 'Reklamballong Metallic 33 cm' },
    { id: '68be85b7094d08828def67fe', name: 'Ballongbokstäver i silver 90 cm' },
    { id: '68be85b7094d08828def67ff', name: 'Ballongbokstäver i silver 50 cm' },
    { id: '68be85b7094d08828def6802', name: 'Reklamballong Crystal 30 cm' },
    { id: '68be85b7094d08828def6804', name: 'Ballongsiffror i silver 50 cm' },
    { id: '68be85b7094d08828def6805', name: 'Ballongsiffror i guld 50 cm' },
    { id: '68be85b7094d08828def6806', name: 'Reklamballong - Metallic 60 cm i diam' },
    { id: '68be85b7094d08828def6808', name: 'Reklamballong - Metallic 90 cm i diam' },
    { id: '68be85b8094d08828def68a7', name: 'ballongvikt till ballongklasar 170 gram' },
    { id: '68be85b8094d08828def68a8', name: 'Ballongsiffror i guld ca 86 cm höga' },
    { id: '68be85b8094d08828def69e4', name: 'Ballong med tryck' },
    { id: '68be85b8094d08828def69e6', name: 'Ballongbokstäver i guld 50 cm' },
    { id: '68be85b8094d08828def69e7', name: 'Reklamballong Metallic 33 cm' },
    { id: '68be85b8094d08828def69e8', name: 'Ballongbokstäver i guld 90 cm' },
    { id: '68be85b8094d08828def69ea', name: 'Ballongbokstäver i silver 50 cm' },
    { id: '68be85b8094d08828def69eb', name: 'Reklamballong med logo' },
    { id: '68be85b8094d08828def69ee', name: 'Ballongsiffror i guld 50 cm' },
    { id: '68be85b8094d08828def69ef', name: 'Reklamballong - Metallic 60 cm i diam' },
    { id: '68be85b8094d08828def6a73', name: 'Reklamballong - Glossy 33 cm i diam' },
    { id: '68be85b8094d08828def6a74', name: 'Ballongsiffror i silver ca 86 cm höga' },
    { id: '68be85d2094d08828defd4e8', name: 'Röda Ballong hjärtan i folie' },
    { id: '68be85d2094d08828defd4e9', name: 'Ballongbåge kit glamorös' },
    { id: '68be85d2094d08828defd4ea', name: 'Ballongbåge kit regnbåge' },
    { id: '68be85d2094d08828defd4eb', name: 'Ballongbåge kit guld' },
    { id: '68be85d2094d08828defd4ec', name: 'Ballongbåge kit rosa' },
    { id: '68be85d2094d08828defd4ed', name: 'Ballongbåge kit blå' },
    { id: '68be85d2094d08828defd4ee', name: 'Ballongpinne av Papper 100% BIO' },
    { id: '68be85d2094d08828defd4ef', name: 'Ballongpinne av Papper 100% BIO' },
    { id: '68be85d2094d08828defd4f1', name: 'Ballongpinne av trä 100% BIO' },
    { id: '68be85d2094d08828defd5c6', name: 'Ballongbåge kit silver' },
    { id: '68be85d2094d08828defd5c9', name: 'Ballongpelare inkl ballonger för dekoration' },
    { id: '68be85d2094d08828defd5ca', name: 'Hifloat 284 cl' },
    { id: '68be85d2094d08828defd5ce', name: 'Ballongpelare inkl ballonger för dekoration. För nybörjare' },
    { id: '68be85d2094d08828defd5d6', name: 'Ballongvikt 12' },
    { id: '68be85d2094d08828defd5d9', name: 'Hifloat Pump' },
    { id: '68be85d2094d08828defd5db', name: 'Ballongvikt 10' },
    { id: '68be85d2094d08828defd5dd', name: 'Ställbar ballongpump' },
    { id: '68be85d2094d08828defd5e0', name: 'Små ballongförslutare' },
    { id: '68be85d2094d08828defd5e1', name: 'Stor ballongpump' },
    { id: '68be85d2094d08828defd5e2', name: 'Hifloat 71 cl' },
    { id: '68be85d2094d08828defd68f', name: 'Ballongpump' },
    { id: '68be85d2094d08828defd690', name: 'Bordsdekoration till ballonger' },
    { id: '68be85d2094d08828defd696', name: 'Ballongställ i metall' },
    { id: '68be85d2094d08828defd698', name: 'Snabbförslutande ballongband' },
    { id: '68be85d2094d08828defd6a0', name: 'Heliumtub för ballonger' },
    { id: '68be85de094d08828df00860', name: 'Reklamballong - Metallic 60 cm i diam' },
    { id: '68be85de094d08828df00861', name: 'Reklamballong - Metallic 90 cm i diam' },
  ],

  // stamplar (65 products)
  'stamplar': [
    { id: '68be85c3094d08828def9272', name: 'Stämpeldyna TRODAT 5205 6/55 svart' },
    { id: '68be85c3094d08828def9273', name: 'K-Stämpel 1211 - Max 35 x 35 mm' },
    { id: '68be85c3094d08828def9274', name: 'K-Stämpel 1202 - Max 40 x 15 mm' },
    { id: '68be85c4094d08828def93e3', name: 'K-Stämpel 1222 - Max 100 x 50 mm' },
    { id: '68be85c4094d08828def93e4', name: 'Dynkassett COLOP E/2600 Röd/Blå' },
    { id: '68be85c4094d08828def93e5', name: 'K-Stämpel 1213 - Max 50 x 50 mm' },
    { id: '68be85c4094d08828def93e6', name: 'K-Stämpel 1212 - Max 50 x 35 mm' },
    { id: '68be85c4094d08828def93e7', name: 'K-Stämpel 1221 - Max 80 x 50 mm' },
    { id: '68be85c4094d08828def93e8', name: 'K-Stämpel 1207 - Max 75 x 30 mm' },
    { id: '68be85c4094d08828def93e9', name: 'K-Stämpel 1208 - Max 75 x 40 mm' },
    { id: '68be85c4094d08828def93ea', name: 'K-Stämpel 1205 - Max 75 x 22 mm' },
    { id: '68be85c4094d08828def93ec', name: 'Stämpel PRINTY 4750/L2 Datum - Betald' },
    { id: '68be85c4094d08828def93ed', name: 'Stämpel PRINTY Standard 33 Kopia' },
    { id: '68be85c4094d08828def93ee', name: 'K-Stämpel 1201 - Max 40 x 8 mm' },
    { id: '68be85c4094d08828def93ef', name: 'Stämpelfärg STAMKO 10 ml blå' },
    { id: '68be85c4094d08828def93f2', name: 'Dynkassett TRODAT 6/53 Blå 2-pack' },
    { id: '68be85c4094d08828def93f3', name: 'Stämpelfärg 30ml' },
    { id: '68be85c4094d08828def93f4', name: 'Stämpelfärg 30ml' },
    { id: '68be85c4094d08828def93f5', name: 'Stämpel K-Bläck 10 ml svart (arkivbest)' },
    { id: '68be85c4094d08828def93f6', name: 'Stämpelfärg självfärgande 10ml' },
    { id: '68be85c4094d08828def93f7', name: 'Stämpel TRODAT 5030 Datumstämpel' },
    { id: '68be85c4094d08828def93f8', name: 'Stämpel TRODAT Dynkas. 70X110 MM' },
    { id: '68be85c4094d08828def93f9', name: 'Dynkassett TRODAT 6/56 Svart 2-pack' },
    { id: '68be85c4094d08828def93fa', name: 'Dynkassett TRODAT 6/50 Röd 2-pack' },
    { id: '68be85c4094d08828def93fb', name: 'Stämpel TRODAT Dynkas. 70X110 MM' },
    { id: '68be85c4094d08828def93fc', name: 'Dynkassett TRODAT 4911 Svart 2-pack' },
    { id: '68be85c4094d08828def93fd', name: 'Stämpelfärg 30ml' },
    { id: '68be85c4094d08828def93fe', name: 'Dynkassett COLOP E/2300 Svart' },
    { id: '68be85c4094d08828def93ff', name: 'Stämpel REINER paginering B6K 5,5mm' },
    { id: '68be85c4094d08828def9400', name: 'Tryckplatta Adigraf 24x30cm' },
    { id: '68be85c4094d08828def9401', name: 'Stämpel Dynkassett COLOP E20 2/fp' },
    { id: '68be85c4094d08828def9402', name: 'Stämpel Paginering REINER B6K 4,5mm' },
    { id: '68be85c4094d08828def9403', name: 'Stämpel TRODAT Dynkas. 70X110 MM' },
    { id: '68be85c4094d08828def9404', name: 'Stämpel Dynkas. 2100 sv. Arkiv' },
    { id: '68be85c4094d08828def9405', name: 'Dynkassett till TRODAT 4750 röd/blå 2/fp' },
    { id: '68be85c4094d08828def9407', name: 'Stämpelfärg COLOP 801 25ml' },
    { id: '68be85c4094d08828def9408', name: 'Stämpelfärg självfärgande 10ml' },
    { id: '68be85c4094d08828def9409', name: 'Stämpelfärg COLOP 801 25ml' },
    { id: '68be85c4094d08828def940a', name: 'Stämpeldyna COLOP E/2100' },
    { id: '68be85c4094d08828def958f', name: 'Stämpel Dynkassett COLOP E20 2/fp' },
    { id: '68be85c4094d08828def9590', name: 'Dynkassett Trodat 6/50 Svart 2/fp' },
    { id: '68be85c4094d08828def9591', name: 'Stämpel Dynkassett COLOP E30 svart 2/fp' },
    { id: '68be85c4094d08828def9592', name: 'Stämpelfärg självfärgande 10ml' },
    { id: '68be85c4094d08828def9593', name: 'Stämpelfärg EOS 10ml' },
    { id: '68be85c4094d08828def9594', name: 'Stämpeldyna COLOP 90x50mm' },
    { id: '68be85c4094d08828def9595', name: 'Stämpelfärg EOS 10ml' },
    { id: '68be85c4094d08828def9596', name: 'Stämpel Dynkas. COLOP E2100 svart 2/fp' },
    { id: '68be85c4094d08828def9597', name: 'Dynkassett COLOP E/2600' },
    { id: '68be85c4094d08828def9598', name: 'Stämpeldyna COLOP E/2100' },
    { id: '68be85c4094d08828def9599', name: 'Stämpeldyna COLOP 90x50mm' },
    { id: '68be85c4094d08828def959a', name: 'Stämpel Dynkas. COLOP E2600 svart 2/fp' },
    { id: '68be85c4094d08828def959b', name: 'Datumstämpel COLOP Printer 160 "Betald"' },
    { id: '68be85c4094d08828def959c', name: 'Stämpel Dynkas. COLOP E2100 röd/blå 2/fp' },
    { id: '68be85c4094d08828def959d', name: 'Stämpel Dynkassett COLOP E10 svart 2/fp' },
    { id: '68be85c4094d08828def959e', name: 'Dynkassett COLOP E/2300 svart 2/fp' },
    { id: '68be85c4094d08828def95a1', name: 'Stämpel COLOP datum stativ S2100/4' },
    { id: '68be85c4094d08828def95a3', name: 'Stämpel Dynkas. COLOP E10 röd/blå 2/fp' },
    { id: '68be85c4094d08828def95a5', name: 'Stämpeldyna TRODAT 4430/5430 röd/blå' },
    { id: '68be85c4094d08828def95a7', name: 'Stämpeldyna COLOP 2300 svart' },
    { id: '68be85c4094d08828def95aa', name: 'Stämpel COLOP datum Printer 160 Ankom' },
    { id: '68be85c4094d08828def95ab', name: 'Stämpel COLOP Printer Voucher' },
    { id: '68be85c4094d08828def95b1', name: 'Dynkassett TRODAT 6/53 svart 2/fp' },
    { id: '68be85c4094d08828def95b2', name: 'Stämpel COLOP datum stativ S2160/RL' },
    { id: '68be85c4094d08828def95b4', name: 'Stämpel COLOP Printer Gör det själv' },
    { id: '68be85c4094d08828def95b6', name: 'Stämpel COLOP datum 2000/WD' },
  ],

  // haftklammer-och-tillbehor (63 products)
  'haftklammer-och-tillbehor': [
    { id: '68be85c3094d08828def92cf', name: 'Klammerborttagare LYRECO metall' },
    { id: '68be85c3094d08828def92d0', name: 'Häftklammer LYRECO nr.10 5000/fp' },
    { id: '68be85c3094d08828def92d2', name: 'Häftklammer LYRECO nr.10 1000/fp' },
    { id: '68be85c3094d08828def92d3', name: 'Häftklammer LYRECO 21/4 2000/fp' },
    { id: '68be85c3094d08828def92d4', name: 'Häftklammer LYRECO 23/23 1000/fp' },
    { id: '68be85c3094d08828def92d5', name: 'Klammerborttagare svart' },
    { id: '68be85c3094d08828def92d6', name: 'Häftklammer LYRECO 26/6 5000/fp' },
    { id: '68be85c3094d08828def92d7', name: 'Häftklammer LYRECO 23/17 stand. 1000/fp' },
    { id: '68be85c3094d08828def92d8', name: 'Häftklammer LYRECO 24/6 1000/fp' },
    { id: '68be85c3094d08828def92d9', name: 'Häftklammer RAPID Optima HD70 2500/fp' },
    { id: '68be85c3094d08828def92da', name: 'Metallklammer 1000/fp' },
    { id: '68be85c3094d08828def92db', name: 'Häftklammerkassett CANON J1 15000/fp' },
    { id: '68be85c3094d08828def92dc', name: 'Häftklammer RAPID 21/4 galv 2000/fp' },
    { id: '68be85c3094d08828def92dd', name: 'Häftklammer REXEL Odyssey 2500/fp' },
    { id: '68be85c3094d08828def92de', name: 'Häftklammer LYRECO 26/6 1000/fp' },
    { id: '68be85c3094d08828def92df', name: 'Häftklammer LEITZ E2 2500/fp' },
    { id: '68be85c3094d08828def92e0', name: 'Häftklammerkassett ETONA 26/8 gul 5/fp' },
    { id: '68be85c3094d08828def92e2', name: 'Häftklammer LYRECO 24/6 5000/fp' },
    { id: '68be85c3094d08828def92e3', name: 'Häftklammer LEITZ P3 26/6 5000/fp' },
    { id: '68be85c3094d08828def92e4', name: 'Klammerborttagare RAPID R3' },
    { id: '68be85c3094d08828def92e5', name: 'Klammerborttagare LYRECO svart' },
    { id: '68be85c3094d08828def92e6', name: 'Häftklammer RAPID 24/8+ 5000/fp' },
    { id: '68be85c3094d08828def92e7', name: 'Häftklammer RAPID 66/8+ 5000/fp' },
    { id: '68be85c4094d08828def946b', name: 'Häftklammer RAPID 10/4 1000/fp' },
    { id: '68be85c4094d08828def946c', name: 'Häftklammer LEITZ P3 26/6 1000/fp' },
    { id: '68be85c4094d08828def946d', name: 'Häftklammer RAPID Standard 23/8 1000/fp' },
    { id: '68be85c4094d08828def946e', name: 'Häftklammerkassett LEITZ K12 26/12 5/fp' },
    { id: '68be85c4094d08828def946f', name: 'Häftklammer RAPID 23/24 strong 1000/fp' },
    { id: '68be85c4094d08828def9470', name: 'Häftklammer RAPID 66/7 5000/fp' },
    { id: '68be85c4094d08828def9471', name: 'Häftklammerkassett RAPID 5080 15000/fp' },
    { id: '68be85c4094d08828def9472', name: 'Häftklammer RAPID 66/6 5000/fp' },
    { id: '68be85c4094d08828def9473', name: 'Häftklammer LEITZ P2 nr10 1000/fp' },
    { id: '68be85c4094d08828def9474', name: 'Häftklammerkassett RAPID 5020-5E 3000/fp' },
    { id: '68be85c4094d08828def9475', name: 'Häftklammerkassett RAPID 5050E 5000/fp' },
    { id: '68be85c4094d08828def9476', name: 'Häftklammer RAPID 21/4 1000/fp' },
    { id: '68be85c4094d08828def9477', name: 'Häftklammerkassett LEITZ K6 26/6 5/fp' },
    { id: '68be85c4094d08828def9478', name: 'Häftklammer RAPID A9/8 s-strong 5000/fp' },
    { id: '68be85c4094d08828def9479', name: 'Häftklammer RAPID Duax 1000/fp' },
    { id: '68be85c4094d08828def947a', name: 'Häftklammerkassett LEITZ K8 5/fp' },
    { id: '68be85c4094d08828def947b', name: 'Häftklammer ACTUAL 26/6 1000/fp' },
    { id: '68be85c4094d08828def947c', name: 'Häftklammer RAPID 24/6 galv 1000/fp' },
    { id: '68be85c4094d08828def947d', name: 'Häftklammer RAPID 26/8+ s-strong 5000/fp' },
    { id: '68be85c4094d08828def947e', name: 'Häftklammer LEITZ P5 25/10 1000/fp' },
    { id: '68be85c4094d08828def947f', name: 'Häftklammer RAPID A9/14 s-strong 5000/fp' },
    { id: '68be85c4094d08828def9480', name: 'Häftklammer REXEL Optima 70HD 2500/fp' },
    { id: '68be85c4094d08828def9481', name: 'Häftklammer RAPID Omnipress 30 1000/fp' },
    { id: '68be85c4094d08828def9482', name: 'Häftklammer LEITZ E1 nr10 2500/fp' },
    { id: '68be85c4094d08828def9483', name: 'Häftklammer LEITZ P3 24/6 vita 1000/fp' },
    { id: '68be85c4094d08828def9484', name: 'Häftklammer LEITZ P3 24/6, 1000/fp' },
    { id: '68be85c4094d08828def9485', name: 'Klammerborttagare' },
    { id: '68be85c4094d08828def9486', name: 'Häftklammer LEITZ P6 23/15XL 1000/fp' },
    { id: '68be85c4094d08828def9487', name: 'Häftklammer RAPID 24/6 galv 5000/fp' },
    { id: '68be85c4094d08828def9488', name: 'Häftklammer RAPID A9/10 s-strong 5000/fp' },
    { id: '68be85c4094d08828def9489', name: 'Klammerborttagare RAPID C2 svart' },
    { id: '68be85c4094d08828def948a', name: 'Häftklammer RAPID A13/6 5000/fp' },
    { id: '68be85c4094d08828def948b', name: 'Häftklammer RAPID A13/8 5000/fp' },
    { id: '68be85c4094d08828def948c', name: 'Häftklammer RAPID 23/10 1000/fp' },
    { id: '68be85c4094d08828def948d', name: 'Häftklammer RAPID A9/12 s-strong 5000/fp' },
    { id: '68be85c4094d08828def948e', name: 'Häftklammer RAPID 26/6 standard 5000/fp' },
    { id: '68be85c4094d08828def948f', name: 'Häftklammer RAPID A13/4 5000/fp' },
    { id: '68be85c4094d08828def9490', name: 'Häftklammer RAPID Omnipress 60 1000/fp' },
    { id: '68be85c4094d08828def9491', name: 'Häftklammer RAPID A13/6 2500/fp' },
    { id: '68be85c4094d08828def9492', name: 'Häftklammer RAPID 26/6 strong 5000/fp' },
  ],

  // mobilskal (62 products)
  'mobilskal': [
    { id: '68be85ad094d08828def4812', name: 'Escape, computerbag/sleeve 13"' },
    { id: '68be85ad094d08828def4815', name: 'Florens, datorfodral 15"' },
    { id: '68be85bf094d08828def82bb', name: 'Thule Gautlet Case for iPhone® 6 Plus/6s Plus. Blue' },
    { id: '68be85c0094d08828def861b', name: 'SBS Skinny Cover för Samsung Galaxy S22+®. Transparent' },
    { id: '68be85c0094d08828def861c', name: 'SBS Skinny Cover för iPhone 12 / 12 Pro®. Transparent' },
    { id: '68be85c0094d08828def861d', name: 'Mobilskal i PU läder (iPhone)' },
    { id: '68be85c0094d08828def861e', name: 'Mobilskal silikon (iPhone)' },
    { id: '68be85c0094d08828def861f', name: 'Mobilskal PVC (Samsung Galaxy)' },
    { id: '68be85c0094d08828def8620', name: 'Mobilskal TPU (iPhone)' },
    { id: '68be85c0094d08828def8621', name: 'Mobilskal med gummerad yta (iPhone) olika modeller' },
    { id: '68be85c0094d08828def8622', name: 'SBS Skinny Cover för iPhone 13®. Transparent' },
    { id: '68be85c0094d08828def8623', name: 'SBS Skinny Cover för Samsung Galaxy A03s®. Transparent' },
    { id: '68be85c0094d08828def8624', name: 'SBS Skinny Cover för Samsung Galaxy S23+®. Transparent' },
    { id: '68be85c0094d08828def86be', name: 'SBS Novelty Instinct cover för iPhone 14 Pro®. Svart' },
    { id: '68be85c0094d08828def86bf', name: 'Escape, computerbag/sleeve 13"' },
    { id: '68be85c0094d08828def86c0', name: 'Thule Gauntlet Cover for iPhone 6. Blue' },
    { id: '68be85c0094d08828def86c1', name: 'Thule Gautlet Case for iPhone® 6 Plus/6s Plus. Blue' },
    { id: '68be85c0094d08828def86c2', name: 'SBS Ultrastarkt fodral för iPhone 16 Pro med D3O-teknik. Transparent' },
    { id: '68be85c0094d08828def86c3', name: 'SBS Skinny Cover för iPhone 14 / 13®. Transparent' },
    { id: '68be85c0094d08828def86c4', name: 'SBS Skinny Cover för iPhone 15 Pro Max®. Transparent' },
    { id: '68be85c0094d08828def86c5', name: 'SBS Vanity Stars Mobilskal för Samsung Galaxy A13 4G®. Blå' },
    { id: '68be85c0094d08828def86c6', name: 'SBS Extreme X3 cover för iPhone 14 Plus®. Transparent' },
    { id: '68be85c0094d08828def86c7', name: 'SBS Ultrastarkt fodral för iPhone 16 med D3O-teknik. Transparent' },
    { id: '68be85c0094d08828def86c8', name: 'SBS Skinny-skydd för iPhone 16 Pro Max' },
    { id: '68be85c0094d08828def8713', name: 'SBS Instinct-skydd för Samsung Galaxy A35. Blå' },
    { id: '68be85cd094d08828defb84e', name: 'SBS Extreme X4-skal för iPhone 14 Plus' },
    { id: '68be85cd094d08828defb84f', name: 'SBS Instinct Mag - MagSafe-kompatibelt fodral för iPhone 15. Svart' },
    { id: '68be85e3094d08828df0167e', name: 'Thule Gauntlet Cover for iPhone 6. Blue' },
    { id: '68be85e3094d08828df0171a', name: 'Thule Gautlet Case for iPhone® 6 Plus/6s Plus. Blue' },
    { id: '68be85e4094d08828df01a3e', name: 'SBS Skinny Cover för Samsung Galaxy S22+®. Transparent' },
    { id: '68be85e4094d08828df01a40', name: 'SBS Skinny Cover för iPhone 12 / 12 Pro®. Transparent' },
    { id: '68be85e4094d08828df01a42', name: 'SBS Skinny Cover för Samsung Galaxy S21 FE®. Transparent' },
    { id: '68be85e4094d08828df01a47', name: 'SBS Skinny Cover för iPhone 13®. Transparent' },
    { id: '68be85e4094d08828df01a48', name: 'SBS Skinny Cover för Samsung Galaxy A03s®. Transparent' },
    { id: '68be85e4094d08828df01a49', name: 'SBS Skinny Cover för Samsung Galaxy S23+®. Transparent' },
    { id: '68be85e4094d08828df01aa1', name: 'SBS Polo One Cover för iPhone 13®. Svart' },
    { id: '68be85e4094d08828df01aa3', name: 'SBS Novelty Instinct cover för iPhone 14 Plus®. Svart' },
    { id: '68be85e4094d08828df01aa5', name: 'SBS Novelty Instinct cover för iPhone 14 Pro®. Svart' },
    { id: '68be85e4094d08828df01b2b', name: 'SBS Novelty MagSafe®-kompatibelt skal för iPhone 14 / 13® med magnetisk laddning. Svart' },
    { id: '68be85e4094d08828df01b2f', name: 'SBS Bumper skal för iPhone 14 Pro Max®. Transparent' },
    { id: '68be85e4094d08828df01b30', name: 'SBS Ultrastarkt fodral för iPhone 16 Pro med D3O-teknik. Transparent' },
    { id: '68be85e4094d08828df01b31', name: 'SBS Novelty MagSafe®-kompatibelt skal för iPhone 14 Plus® med magnetisk laddning. Svart' },
    { id: '68be85e4094d08828df01b32', name: 'SBS Skinny fodral för Samsung Galaxy S24+. Transparent' },
    { id: '68be85e4094d08828df01b33', name: 'SBS Skinny Cover för iPhone 14 / 13®. Transparent' },
    { id: '68be85e4094d08828df01b34', name: 'SBS Skinny Cover för iPhone 15 Pro Max®. Transparent' },
    { id: '68be85e4094d08828df01b35', name: 'SBS Skinny Cover för iPhone 15 Pro®. Transparent' },
    { id: '68be85e4094d08828df01b36', name: 'SBS Bumper skal för iPhone 14 Pro®. Transparent' },
    { id: '68be85e4094d08828df01bc4', name: 'SBS Bumper skal för iPhone 14 Pro®. Transparent' },
    { id: '68be85e4094d08828df01bc5', name: 'SBS Instinct-skydd för iPhone 15. Svart' },
    { id: '68be85e4094d08828df01bc6', name: 'SBS Extreme X3 cover för iPhone 14 Plus®. Transparent' },
    { id: '68be85e4094d08828df01bc8', name: 'SBS Skinny-skydd för iPhone 16 Pro' },
    { id: '68be85e4094d08828df01bc9', name: 'SBS Ultrastarkt fodral för iPhone 16 med D3O-teknik. Transparent' },
    { id: '68be85e4094d08828df01bca', name: 'SBS Skinny-skydd för iPhone 16 Pro Max' },
    { id: '68be85e4094d08828df01bcb', name: 'SBS Extreme X2 Cover för iPhone 16. Transparent' },
    { id: '68be85e4094d08828df01bcc', name: 'SBS Book-liknande fodral med stativstöd och mjuk touch-yta för iPhone 16' },
    { id: '68be85e4094d08828df01bcd', name: 'SBS Extreme X3-skydd för iPhone 15. Transparent' },
    { id: '68be85e5094d08828df01c91', name: 'SBS Instinct-skydd för Samsung Galaxy A14 4G/5G. Blå' },
    { id: '68be85e8094d08828df028fd', name: 'Mobilskal PU-läder (iPhone)' },
    { id: '68be85e9094d08828df02c6e', name: 'Mobilskal i PU läder (iPhone)' },
    { id: '68be85ea094d08828df02dbc', name: 'Mobilskal silikon (iPhone)' },
    { id: '68be85ea094d08828df02dc0', name: 'Mobilskal PVC (Samsung Galaxy)' },
    { id: '68be85ea094d08828df02e3a', name: 'Mobilskal TPU (iPhone)' },
  ],

  // mattband (62 products)
  'mattband': [
    { id: '68be85b0094d08828def50d8', name: 'Resure 5M RABS måttband' },
    { id: '68be85b0094d08828def50dc', name: 'Resure 3M RABS måttband' },
    { id: '68be85b0094d08828def5196', name: 'Måttband (1,5 m) Theo' },
    { id: '68be85b0094d08828def52b5', name: 'ABS måttband Dorothy' },
    { id: '68be85b1094d08828def538d', name: 'Måttband i aluminium Frances' },
    { id: '68be85b8094d08828def6ad5', name: 'ASHLEY. Nyckelring med måttband' },
    { id: '68be85c0094d08828def8758', name: 'GULIVER III. 3 m ABS-måttband' },
    { id: '68be85c0094d08828def875a', name: 'Måttband (1,5 m) Theo' },
    { id: '68be85c0094d08828def875c', name: 'ABS måttband Dorothy' },
    { id: '68be85c1094d08828def87bb', name: 'SizeSure måttband 5M' },
    { id: '68be85c1094d08828def87bd', name: 'Måttband i aluminium Frances' },
    { id: '68be85c1094d08828def87be', name: 'Måttband Elemental I' },
    { id: '68be85c1094d08828def87bf', name: 'Måttband Worker' },
    { id: '68be85c1094d08828def87c0', name: 'Måttband Workman' },
    { id: '68be85c1094d08828def87c1', name: 'Måttband Employee' },
    { id: '68be85c1094d08828def87c2', name: 'Rapid' },
    { id: '68be85c1094d08828def881e', name: 'Resure 5M RABS måttband' },
    { id: '68be85ca094d08828defaa0c', name: 'ABS måttband Donald' },
    { id: '68be85ca094d08828defaa79', name: 'ABS måttband Diane' },
    { id: '68be85cb094d08828defaccd', name: 'Måttband i bambu Callum' },
    { id: '68be85cd094d08828defb807', name: 'Måttband Basic II' },
    { id: '68be85cd094d08828defb808', name: 'Måttband Elemental II' },
    { id: '68be85cd094d08828defb809', name: 'Måttband Basic I' },
    { id: '68be85cd094d08828defb80a', name: 'Måttband "Builder I"' },
    { id: '68be85cd094d08828defb80b', name: 'Måttband Bambu' },
    { id: '68be85cd094d08828defb80c', name: 'Måttband "Builder II"' },
    { id: '68be85cd094d08828defb80d', name: 'Måttband Elemental II' },
    { id: '68be85cd094d08828defb80e', name: 'Måttband Elemental II' },
    { id: '68be85cd094d08828defb810', name: 'Mätband "Flip Flop"' },
    { id: '68be85cd094d08828defb811', name: 'Flinga - Måttband - 3 m' },
    { id: '68be85cd094d08828defb83c', name: 'Measure-It måttband' },
    { id: '68be85cd094d08828defb83d', name: 'Måttband ABS Ahsan' },
    { id: '68be85cd094d08828defb86d', name: 'Sokutai - Måttband i bambu 2 m' },
    { id: '68be85d1094d08828defce5a', name: 'Stanier måttband' },
    { id: '68be85d2094d08828defd66e', name: 'Måttband ABS (5 m) Emmanuel' },
    { id: '68be85d3094d08828defd7f8', name: 'Måttband ABS Zuzanna' },
    { id: '68be85d3094d08828defd8ae', name: 'Måttband ABS (2 m) Arianne' },
    { id: '68be85d3094d08828defd8c4', name: 'Måttband ABS (3 m) Effran' },
    { id: '68be85d3094d08828defd92e', name: 'Måttband, 5 m PE Caroline' },
    { id: '68be85d3094d08828defd931', name: 'Måttband med nyckelring, 2m' },
    { id: '68be85d3094d08828defd9c4', name: 'Måttband ABS (5 m) Maximus' },
    { id: '68be85d3094d08828defda18', name: 'MERIBEL V. 5m måtband' },
    { id: '68be85d3094d08828defda65', name: 'Birka - Måttband - 5 m' },
    { id: '68be85d3094d08828defdb04', name: 'MERIBEL III. 3m måttband' },
    { id: '68be85d3094d08828defdb6e', name: 'Mespro - Rullmåttband 5 m' },
    { id: '68be85d4094d08828defdcee', name: 'Måttband 3 m in PE Cassie' },
    { id: '68be85d4094d08828defdcf6', name: 'Måttband (3 m) ABS Ramos' },
    { id: '68be85d4094d08828defdd32', name: 'COPPI. Nyckelring med måttband' },
    { id: '68be85d4094d08828defde5c', name: 'David - Måttband 3m' },
    { id: '68be85d4094d08828defde65', name: 'Colindales - 2 m måttband' },
    { id: '68be85d4094d08828defe00e', name: 'Vida - Måttband - 5 m' },
    { id: '68be85d4094d08828defe040', name: 'Caruso Skräddarsytt Måttband' },
    { id: '68be85d4094d08828defe0b9', name: 'Gear X 5M måttband med 30M laser' },
    { id: '68be85d4094d08828defe0bb', name: 'Gear X 5M måttband med långsam/snabb returfunktion' },
    { id: '68be85d5094d08828defe48a', name: 'Watford Måttband med tryck' },
    { id: '68be85e6094d08828df022d6', name: 'Rapid' },
    { id: '68be85e7094d08828df0257c', name: 'Bessux' },
    { id: '68be85e8094d08828df026dc', name: 'Tarrox måttband' },
    { id: '68be85e9094d08828df02b59', name: 'SizeSure måttband 5M' },
    { id: '68be85ea094d08828df02de0', name: 'Symmons' },
    { id: '68be85ea094d08828df02e99', name: 'Mia - Måttband 5m' },
    { id: '68be85ea094d08828df02f42', name: 'Mia - Måttband 5m' },
  ],

  // sallskapsspel (60 products)
  'sallskapsspel': [
    { id: '68be85ad094d08828def479f', name: 'Peppermor anpassat minnesspel' },
    { id: '68be85b0094d08828def51f8', name: 'Lombok dominobrickor, miljöskydd' },
    { id: '68be85b0094d08828def520d', name: 'Colormor Memoryspel med färgläggning, miljöskydd' },
    { id: '68be85b2094d08828def56e9', name: 'Ace set med spelkort' },
    { id: '68be85b2094d08828def5768', name: 'Immermor memoryspel, landmärken' },
    { id: '68be85b2094d08828def5769', name: 'Peppermor anpassat minnesspel' },
    { id: '68be85b2094d08828def577d', name: 'Lombok dominobrickor, miljöskydd' },
    { id: '68be85b2094d08828def577e', name: 'Colormor Memoryspel med färgläggning, miljöskydd' },
    { id: '68be85be094d08828def7e81', name: 'Immermor memoryspel, landmärken' },
    { id: '68be85be094d08828def7e82', name: 'Peppermor anpassat minnesspel' },
    { id: '68be85c2094d08828def8ec6', name: 'Minimor Eco Creative anpassat minnesspel' },
    { id: '68be85c9094d08828defa715', name: 'InSideOut Balansspel i trä' },
    { id: '68be85c9094d08828defa755', name: 'Tower Game Deluxe  sällskapsspel' },
    { id: '68be85c9094d08828defa756', name: 'Roll-out Shuffleboard' },
    { id: '68be85c9094d08828defa757', name: 'BeachGames spel' },
    { id: '68be85c9094d08828defa758', name: 'Jeu de boules' },
    { id: '68be85c9094d08828defa759', name: 'WoodGame 5-i-1 spel' },
    { id: '68be85c9094d08828defa75a', name: 'Mikado spel' },
    { id: '68be85c9094d08828defa75c', name: 'Tower Game spel' },
    { id: '68be85c9094d08828defa75d', name: 'SMART 10' },
    { id: '68be85c9094d08828defa75e', name: 'Musmatta med eget tryck' },
    { id: '68be85c9094d08828defa791', name: 'Whorl tic-tac-toe-spel av trä' },
    { id: '68be85ca094d08828defa916', name: 'Utkastspel gjort av trä, Rio' },
    { id: '68be85ca094d08828defaa82', name: 'Luffarschack i trä Waltraud' },
    { id: '68be85ca094d08828defab8b', name: 'Skicklighetsspel i trä Grayson' },
    { id: '68be85ca094d08828defab8e', name: 'Träspel Hank' },
    { id: '68be85ca094d08828defabeb', name: 'Tangram pussel av trä Ulrike' },
    { id: '68be85cb094d08828defadd0', name: 'Galois Creative anpassat räknespel' },
    { id: '68be85cb094d08828defb01e', name: 'Minimor Creative anpassat minnesspel' },
    { id: '68be85cc094d08828defb0ce', name: 'Spel Pedagogiskt av furu Ezekiel' },
    { id: '68be85cc094d08828defb186', name: 'Arcus ludo-spel' },
    { id: '68be85cd094d08828defb4fd', name: 'Forrex spel' },
    { id: '68be85ce094d08828defc2bb', name: 'Domi&cards - Domino- och kort set' },
    { id: '68be85d0094d08828defc9ad', name: 'Peppermor Creative anpassat minnesspel' },
    { id: '68be85d1094d08828defce9a', name: 'Ludospel av trä Yasir' },
    { id: '68be85d1094d08828defcf3a', name: 'Färdighetsspel i trä Gisa' },
    { id: '68be85d1094d08828defcf52', name: 'MIGUEL. Dominospel i trälåda med lock' },
    { id: '68be85d1094d08828defd00d', name: 'Kortlek med logotryck' },
    { id: '68be85d1094d08828defd0ce', name: 'SATURN. Minnes spel' },
    { id: '68be85d1094d08828defd0cf', name: 'MIKA. Mikado spel' },
    { id: '68be85d2094d08828defd3fa', name: 'Topos - Luffarschack i trä' },
    { id: '68be85d3094d08828defd81b', name: 'Sudoku - Sudoku-brädspel i trä' },
    { id: '68be85d3094d08828defd823', name: 'Zuky - Labyrintspel i furuträ' },
    { id: '68be85d3094d08828defd8cd', name: 'CROSSES. Klassisk 10-delars playwood Luffarschack (Tic Tac Toe)' },
    { id: '68be85d3094d08828defd913', name: 'Tangram - Tangram-pussel i trä' },
    { id: '68be85d3094d08828defd92b', name: 'Luffarschack i trä, Alessio' },
    { id: '68be85d3094d08828defdb06', name: 'PLAYTIME. 4 i 1 spelset' },
    { id: '68be85d3094d08828defdb17', name: 'FLIK. Träspel med 54 stycken delar' },
    { id: '68be85d4094d08828defdbf8', name: 'Nysäl - Spelset backgammon/schack' },
    { id: '68be85d4094d08828defdd2f', name: 'DOMIN. Domino spel i trä' },
    { id: '68be85d4094d08828defdde9', name: 'Lara - Darttavla' },
    { id: '68be85d4094d08828defdf04', name: 'Dominospel, Enid' },
    { id: '68be85d4094d08828defdf14', name: 'Mini Mikado - Mikado' },
    { id: '68be85d4094d08828defe03a', name: 'Jumble tornspel i trä' },
    { id: '68be85d4094d08828defe047', name: 'Carmon speluppsättning' },
    { id: '68be85d4094d08828defe104', name: 'Fyra-i-rad spel med tryck' },
    { id: '68be85d4094d08828defe13b', name: 'Hobby - Spel' },
    { id: '68be85de094d08828df00a06', name: 'Immermor memoryspel, landmärken' },
    { id: '68be85e5094d08828df01f13', name: 'Classic - Art of Backgammon' },
    { id: '68be85e9094d08828df02d83', name: 'Ace set med spelkort' },
  ],

  // skarbrador (60 products)
  'skarbrador': [
    { id: '68be85b1094d08828def54ca', name: 'Skärbräda 38x21cm' },
    { id: '68be85c9094d08828defa88e', name: 'Acacut skärbräda av akacia' },
    { id: '68be85c9094d08828defa88f', name: 'Homey"s Wood Fiber Cutting Board Small skärbräda' },
    { id: '68be85c9094d08828defa890', name: 'Homey"s Wood Fiber Cutting Board Medium skärbräda' },
    { id: '68be85c9094d08828defa891', name: 'Wooosh Gustoso skärbräda' },
    { id: '68be85c9094d08828defa892', name: 'Brabantia Tasty+ Set skärbrädor' },
    { id: '68be85c9094d08828defa893', name: 'Skärbräda "Wooden Rindy"' },
    { id: '68be85c9094d08828defa894', name: 'Skärbräda "Bambu Round"' },
    { id: '68be85c9094d08828defa895', name: 'Skärbräda Wooden Baky' },
    { id: '68be85c9094d08828defa896', name: 'Skärbräda "Wooden Piggy"' },
    { id: '68be85c9094d08828defa897', name: 'Skärbräda "Wooden Break"' },
    { id: '68be85c9094d08828defa899', name: 'Skärbräda Bamboo Kit' },
    { id: '68be85c9094d08828defa89a', name: 'Skärbräda' },
    { id: '68be85c9094d08828defa89b', name: 'Skärbräda "Wooden edge"' },
    { id: '68be85c9094d08828defa89c', name: 'Skärbräda Bamboo' },
    { id: '68be85c9094d08828defa8cd', name: 'Skärbräda Bamboo Shape' },
    { id: '68be85c9094d08828defa8ce', name: 'Skärbräda Wodden Square' },
    { id: '68be85c9094d08828defa8cf', name: 'Skärbräda Long Bamboo' },
    { id: '68be85c9094d08828defa8d0', name: 'Skärbräda Bambu' },
    { id: '68be85c9094d08828defa8d1', name: 'Skärbräda "Bamboo Sharp"' },
    { id: '68be85c9094d08828defa8d2', name: 'Skärbräda Wooden Premium' },
    { id: '68be85c9094d08828defa8d3', name: 'Skärbräda Wooden Cirkle' },
    { id: '68be85c9094d08828defa8d4', name: 'Skärbräda' },
    { id: '68be85ca094d08828defa8dc', name: 'Black Board Rubberwood skärbräda' },
    { id: '68be85ca094d08828defa8e1', name: 'Wooosh Tabla serveringsbräda' },
    { id: '68be85ca094d08828defa8fc', name: 'Wooosh Borghi serveringsbräda' },
    { id: '68be85ca094d08828defa8fd', name: 'Skärbräda av furu Daxton' },
    { id: '68be85ca094d08828defa912', name: 'Bocado Board bamboe skärbräda' },
    { id: '68be85ca094d08828defa915', name: 'Bamboo Board skärbräda' },
    { id: '68be85ca094d08828defa9a4', name: 'Originalhome skärbräda' },
    { id: '68be85ca094d08828defa9a5', name: 'BOSKA Serveringsbräda Rund Amigo L' },
    { id: '68be85ca094d08828defabf9', name: 'Skärbräda i acacia Heinz' },
    { id: '68be85cb094d08828defb011', name: 'Acasharp skärbräda av akacia' },
    { id: '68be85cb094d08828defb029', name: 'Branzino skärbräda' },
    { id: '68be85cc094d08828defb178', name: 'Acaserve serveringsbräda av akacia' },
    { id: '68be85d0094d08828defc81b', name: 'Scandi End Grain Cutting  Board (s) 801' },
    { id: '68be85d0094d08828defcaf7', name: 'Skärbräda i bambu Heddy' },
    { id: '68be85d0094d08828defcc67', name: 'Grooves - Skärbräda av akaciaträ' },
    { id: '68be85d0094d08828defccb3', name: 'CAPER. Akacia skärbräda' },
    { id: '68be85d0094d08828defccce', name: 'Skärbräda bambu Vida' },
    { id: '68be85d0094d08828defcdcf', name: 'El Greco Board' },
    { id: '68be85d1094d08828defce10', name: 'Serviro - Skärbräda Acacia' },
    { id: '68be85d1094d08828defceb6', name: 'Moore Board' },
    { id: '68be85d1094d08828defcf25', name: 'Xaban skärbräda' },
    { id: '68be85d1094d08828defd04f', name: 'Cibo - Skärbräda Acacia' },
    { id: '68be85d2094d08828defd4bc', name: 'Lembaga - Skärbräds set i bambu' },
    { id: '68be85d2094d08828defd683', name: 'Bemga Large - Stor skärbräda i bambu' },
    { id: '68be85d2094d08828defd689', name: 'Bemga - Skärbräda i bambu' },
    { id: '68be85d2094d08828defd6e6', name: 'MARJORAM. Skärbräda i bambu' },
    { id: '68be85d3094d08828defd865', name: 'CAPPERO. Set med skärbräda och ostkniv' },
    { id: '68be85d3094d08828defdac1', name: 'Diyu - Serveringsbräda' },
    { id: '68be85d3094d08828defdb4f', name: 'Tino - Skärbräda' },
    { id: '68be85d4094d08828defdbdd', name: 'Serve - Skärbräda 31cm' },
    { id: '68be85d4094d08828defdbfa', name: 'Krokom - Skärbräda' },
    { id: '68be85d4094d08828defdc99', name: 'Hannsu - Skärbräda marmor/bambu' },
    { id: '68be85d4094d08828defdcab', name: 'Bayba Clean - Skärbräda i bambu' },
    { id: '68be85d4094d08828defdd80', name: 'Julienne skärbräda med handtag, av akaciaträ' },
    { id: '68be85d4094d08828defe142', name: 'Deko - Skärbräda' },
    { id: '68be85e0094d08828df00cb1', name: 'Sami Skärbräda' },
    { id: '68be85e6094d08828df02209', name: 'Skärbräda 38x21cm' },
  ],

  // strandvaskor (59 products)
  'strandvaskor': [
    { id: '68be85ad094d08828def463e', name: 'Kaimani - Kasse i non-woven RPET' },
    { id: '68be85ae094d08828def496d', name: 'Maldi Beach - Strandväska i canvas 320 gr/m²' },
    { id: '68be85ae094d08828def4abc', name: 'Belinho RPET torrpåse' },
    { id: '68be85af094d08828def4d60', name: 'SuboShop Playa Zip strandväska med tryck' },
    { id: '68be85af094d08828def4d75', name: 'Laguna - Extra stor strandväska 280gr/m²' },
    { id: '68be85af094d08828def4e43', name: 'Feltsea - Strandväska i RPET-filt' },
    { id: '68be85af094d08828def4e4e', name: 'Non Woven Bag Beach' },
    { id: '68be85b0094d08828def4f42', name: 'Lanikai strandväska' },
    { id: '68be85b0094d08828def518a', name: 'Entalu strandväska' },
    { id: '68be85b8094d08828def6ac5', name: 'Menorca - Strandväska med rephandtag' },
    { id: '68be85b8094d08828def6ac8', name: 'Kleuren Bag - Kasse i bomullscanvas 280gr/m2' },
    { id: '68be85b8094d08828def6b71', name: 'Kaimono - Kasse i non-woven RPET' },
    { id: '68be85b8094d08828def6b72', name: 'Kaimani - Kasse i non-woven RPET' },
    { id: '68be85bf094d08828def8079', name: 'Panama strandväska 20L' },
    { id: '68be85bf094d08828def807a', name: 'Siam strandtygväska av GRS-återvunnen frotté på 13 l' },
    { id: '68be85bf094d08828def807b', name: 'Menorca - Strandväska med rephandtag' },
    { id: '68be85bf094d08828def807c', name: 'Heaven Stripe - Strandväska i bomull 220 gr/m²' },
    { id: '68be85bf094d08828def807d', name: 'Kaimono - Kasse i non-woven RPET' },
    { id: '68be85bf094d08828def807e', name: 'Kaimani - Kasse i non-woven RPET' },
    { id: '68be85bf094d08828def807f', name: 'Maldi Beach - Strandväska i canvas 320 gr/m²' },
    { id: '68be85bf094d08828def8081', name: 'Laguna - Extra stor strandväska 280gr/m²' },
    { id: '68be85bf094d08828def8088', name: 'Seglarsäck SLX 40L' },
    { id: '68be85bf094d08828def808a', name: 'Hopfällbar Picknickorg' },
    { id: '68be85bf094d08828def808c', name: 'Peri - Väska/reflex' },
    { id: '68be85bf094d08828def814b', name: 'Strandväska i polyester (600D) Gaston' },
    { id: '68be85bf094d08828def814c', name: 'VOLGA. Vattentät tarpaulin väska' },
    { id: '68be85bf094d08828def814d', name: 'Shoppingväska i bomull OEKO-TEX® 140g/m² 40x10x35cm' },
    { id: '68be85bf094d08828def814e', name: 'Strandväska Capri' },
    { id: '68be85bf094d08828def814f', name: 'Strandväska Juist' },
    { id: '68be85bf094d08828def8150', name: 'Strandväska Sylt' },
    { id: '68be85bf094d08828def8151', name: 'Strandväska Korsika' },
    { id: '68be85bf094d08828def8152', name: 'Strandväska Menorca' },
    { id: '68be85bf094d08828def8153', name: 'Drybag 5 L vattentät väska' },
    { id: '68be85bf094d08828def8155', name: 'Miramar torrpåse' },
    { id: '68be85bf094d08828def8156', name: 'Paralia strandväska' },
    { id: '68be85bf094d08828def8158', name: 'Lanikai strandväska' },
    { id: '68be85cd094d08828defb932', name: 'Strandväska Marlene' },
    { id: '68be85cd094d08828defb933', name: 'Strandväska Marina Sand' },
    { id: '68be85cd094d08828defb934', name: 'Standpåse S' },
    { id: '68be85cd094d08828defb935', name: 'Strandväska' },
    { id: '68be85cd094d08828defb936', name: 'Vattentålig väska 2,5L IPX6' },
    { id: '68be85cd094d08828defb937', name: 'Strandväska i' },
    { id: '68be85cd094d08828defb938', name: 'Michelle (340 g/m²) strandväska' },
    { id: '68be85cd094d08828defb939', name: 'Drybag Mini vattentät väska' },
    { id: '68be85ce094d08828defc427', name: 'Strandväska EU' },
    { id: '68be85d3094d08828defda7c', name: 'Laholm - Väska - bomull' },
    { id: '68be85d4094d08828defde1e', name: 'SuboShop Playa Strandväska' },
    { id: '68be85d5094d08828defe18e', name: 'Pantai - Strandväska i canvas 280 gr/m²' },
    { id: '68be85e0094d08828df00d25', name: 'Royal GRS RPET Shopper(80 g/m²) väska' },
    { id: '68be85e0094d08828df00fc5', name: 'Royal GRS RPET Shopper(80 g/m²) väska' },
    { id: '68be85e3094d08828df01738', name: 'Hopfällbar Picknickorg' },
    { id: '68be85e4094d08828df01b0a', name: 'Strandväska bomullsduk OEKO-TEX® 280g/m² 42x10x30cm' },
    { id: '68be85e4094d08828df01bd9', name: 'Shoppingväska i bomull OEKO-TEX® 140g/m² 40x10x35cm' },
    { id: '68be85e5094d08828df01f7b', name: 'Shoppingväska i bomull OEKO-TEX® 140g/m² 40x10x35cm' },
    { id: '68be85e6094d08828df02151', name: 'Panama strandväska 20L' },
    { id: '68be85e6094d08828df02387', name: 'Miramar torrpåse' },
    { id: '68be85e8094d08828df02855', name: 'Menorca - Strandväska med rephandtag' },
    { id: '68be85e9094d08828df02c1c', name: 'Kleuren Bag - Kasse i bomullscanvas 280gr/m2' },
    { id: '68be85ea094d08828df02ef2', name: 'Strandväska i laminerad nonwoven (180 gr/m²) Sana' },
  ],

  // slipsar (55 products)
  'slipsar': [
    { id: '68be85b4094d08828def6032', name: 'Slips' },
    { id: '68be85b4094d08828def6033', name: 'Slips' },
    { id: '68be85b4094d08828def6034', name: 'Slips' },
    { id: '68be85b4094d08828def6036', name: 'Slips' },
    { id: '68be85b4094d08828def6037', name: 'Slips' },
    { id: '68be85b4094d08828def6039', name: 'Slips' },
    { id: '68be85b4094d08828def603a', name: 'Slips' },
    { id: '68be85b4094d08828def603b', name: 'Slips' },
    { id: '68be85b4094d08828def603c', name: 'Slips' },
    { id: '68be85b4094d08828def603f', name: 'Slips' },
    { id: '68be85b4094d08828def6040', name: 'Slips' },
    { id: '68be85b4094d08828def6041', name: 'Slips' },
    { id: '68be85b4094d08828def6042', name: 'Slips' },
    { id: '68be85b4094d08828def6043', name: 'Slips' },
    { id: '68be85b4094d08828def6044', name: 'Slips' },
    { id: '68be85b4094d08828def6045', name: 'Slips' },
    { id: '68be85b4094d08828def6046', name: 'Slips' },
    { id: '68be85b4094d08828def6047', name: 'Slips' },
    { id: '68be85b4094d08828def6049', name: 'Slips' },
    { id: '68be85b4094d08828def604a', name: 'Slips' },
    { id: '68be85b4094d08828def604b', name: 'Slips' },
    { id: '68be85b5094d08828def6101', name: 'Colours slips' },
    { id: '68be85b5094d08828def6102', name: 'Stripes slips' },
    { id: '68be85ce094d08828defc2c2', name: 'Årets julslips 2024' },
    { id: '68be85d2094d08828defd226', name: 'Årets julslips 2022' },
    { id: '68be85e5094d08828df01e63', name: 'Slips' },
    { id: '68be85e5094d08828df01e64', name: 'Slips' },
    { id: '68be85e5094d08828df01e65', name: 'Slips' },
    { id: '68be85e5094d08828df01e69', name: 'Slips' },
    { id: '68be85e5094d08828df01e6a', name: 'Slips' },
    { id: '68be85e5094d08828df01e6b', name: 'Slips' },
    { id: '68be85e5094d08828df01e73', name: 'Slips' },
    { id: '68be85e5094d08828df01e76', name: 'Slips' },
    { id: '68be85e5094d08828df01e7a', name: 'Slips' },
    { id: '68be85e5094d08828df01e7e', name: 'Slips' },
    { id: '68be85e5094d08828df01e80', name: 'Slips' },
    { id: '68be85e5094d08828df01e84', name: 'Slips' },
    { id: '68be85e5094d08828df01f40', name: 'Slips' },
    { id: '68be85e5094d08828df01f45', name: 'Slips' },
    { id: '68be85e5094d08828df01f47', name: 'Slips' },
    { id: '68be85e5094d08828df01f48', name: 'Slips' },
    { id: '68be85e5094d08828df01f4c', name: 'Slips' },
    { id: '68be85e5094d08828df01f50', name: 'Slips' },
    { id: '68be85e5094d08828df01f51', name: 'Slips' },
    { id: '68be85e5094d08828df01f54', name: 'Slips' },
    { id: '68be85e5094d08828df01f55', name: 'Slips' },
    { id: '68be85e5094d08828df01f61', name: 'Slips' },
    { id: '68be85e5094d08828df01f64', name: 'Slips' },
    { id: '68be85e5094d08828df01f66', name: 'Slips' },
    { id: '68be85e5094d08828df01f67', name: 'Slips' },
    { id: '68be85e6094d08828df0204f', name: 'Slips' },
    { id: '68be85e6094d08828df02051', name: 'Slips' },
    { id: '68be85e6094d08828df02275', name: 'Colours slips' },
    { id: '68be85e7094d08828df02592', name: 'Stripes slips' },
    { id: '68be85e8094d08828df026cf', name: 'Stripes slips' },
  ],

  // arkivkartonger-och-boxar (55 products)
  'arkivkartonger-och-boxar': [
    { id: '68be85c3094d08828def8faa', name: 'Arkivkartong FELLOWES Bankers' },
    { id: '68be85c3094d08828def8fab', name: 'Förvaringsbox bärbar ALBA trä' },
    { id: '68be85c3094d08828def8fac', name: 'Arkivbox för pärmar PRESSEL 10/fp' },
    { id: '68be85c3094d08828def8fad', name: 'Arkivbox LYRECO FSC 340x250x150mm' },
    { id: '68be85c3094d08828def8fae', name: 'Arkivbox LYRECO 100mm' },
    { id: '68be85c3094d08828def8faf', name: 'Arkivbox LYRECO FSC 340x250x150mm' },
    { id: '68be85c3094d08828def8fb0', name: 'Arkivbox LYRECO FSC 340x250x200mm vit' },
    { id: '68be85c3094d08828def8fb1', name: 'Arkivbox LYRECO FSC 280x350x350mm vit' },
    { id: '68be85c3094d08828def8fb2', name: 'Förvaringskartong FELLOWES pärmar 10/fp' },
    { id: '68be85c3094d08828def8fb3', name: 'Arkivbox LYRECO duo 200mm' },
    { id: '68be85c3094d08828def8fb4', name: 'Arkivkartong A4 ISO16245 80mm vit' },
    { id: '68be85c3094d08828def8fb5', name: 'Arkivkartong A4 ISO16245 55mm vit' },
    { id: '68be85c3094d08828def8fb6', name: 'Arkivbox LYRECO FSC 550x350x250mm 10/fp' },
    { id: '68be85c3094d08828def8fb7', name: 'Boxmapp LYRECO 60mm rygg röd' },
    { id: '68be85c3094d08828def8fb8', name: 'Arkivbox LYRECO FSC 340x250x100mm vit' },
    { id: '68be85c3094d08828def8fb9', name: 'Arkivlåda FELLOWES A4+ 20/fp' },
    { id: '68be85c3094d08828def8fba', name: 'Förvaringsbox BIGSO Logan grå' },
    { id: '68be85c3094d08828def90ac', name: 'Förvaringsbox BIGSO Katia' },
    { id: '68be85c3094d08828def90ad', name: 'Förvaringsbox BIGSO Karin blå' },
    { id: '68be85c3094d08828def90ae', name: 'Arkivbox FELLOWES 333x285x380mm 10/fp' },
    { id: '68be85c3094d08828def90af', name: 'Förvaringsbox BIGSO Katia' },
    { id: '68be85c3094d08828def90b0', name: 'Arkivbox LYRECO FSC 530x350x250mm 10/fp' },
    { id: '68be85c3094d08828def90b1', name: 'Plastlåda STRATA Heavy Duty 24L' },
    { id: '68be85c3094d08828def90b2', name: 'Arkivbox Brun. Sv. standard A4 80mm' },
    { id: '68be85c3094d08828def90b3', name: 'Förvaringsbox BIGSO Katia' },
    { id: '68be85c3094d08828def90b4', name: 'Plastlåda STRATA Heavy Duty 42L' },
    { id: '68be85c3094d08828def90b5', name: 'Förvaringsbox BIGSO Katia' },
    { id: '68be85c3094d08828def90b6', name: 'Plastlåda STRATA Heavy Duty 60L' },
    { id: '68be85c3094d08828def90b7', name: 'Arkivbox Brun. Sv. standard A4 55mm' },
    { id: '68be85c3094d08828def90b8', name: 'Förvaringsbox BIGSO Karin mint' },
    { id: '68be85c3094d08828def90b9', name: 'Förvaringslåda ClicknStore medium' },
    { id: '68be85c3094d08828def90ba', name: 'Förvaringsbox BIGSO Katrin mint' },
    { id: '68be85c3094d08828def90bb', name: 'Förvaringsbox m.lock karton' },
    { id: '68be85c3094d08828def90bc', name: 'Förvaringsbox m.lock kartong linne 2/fp' },
    { id: '68be85c3094d08828def90bd', name: 'Arkivkartong A4 80mm vit 100/fp' },
    { id: '68be85c3094d08828def90be', name: 'Förvaringsbox m.lock kartong sto' },
    { id: '68be85c3094d08828def90bf', name: 'Förvaringsbox LEITZ Infinity FSC L' },
    { id: '68be85c3094d08828def90c0', name: 'Arkivbox Brun. Sv. standard A4 30mm' },
    { id: '68be85c3094d08828def90c1', name: 'Förvaringsbox BIGSO Katia linne' },
    { id: '68be85c3094d08828def90c2', name: 'Arkivkartong A4 55mm vit 100/fp' },
    { id: '68be85c3094d08828def90c3', name: 'Arkivbox A65 235x125x380mm 2-delad brun' },
    { id: '68be85c3094d08828def90c4', name: 'Förvaringsbox m.lock kartong A4 grå' },
    { id: '68be85c3094d08828def90c6', name: 'Förvaringsbox m.lock karton' },
    { id: '68be85c3094d08828def90c7', name: 'Förvaringsbox m.lock kartong A4 mint' },
    { id: '68be85c3094d08828def90c8', name: 'Förvaringslåda ClicknStore stor vit' },
    { id: '68be85c3094d08828def90c9', name: 'Förvaringslåda ClicknStore medium' },
    { id: '68be85c3094d08828def90ca', name: 'Arkivkartong A4 60mm brun' },
    { id: '68be85c3094d08828def90cb', name: 'Arkivkartong A4 120mm brun' },
    { id: '68be85c3094d08828def90cc', name: 'Arkivkartong A4 80mm brun' },
    { id: '68be85c3094d08828def90cd', name: 'Arkivplatta A4 för arkivbox' },
    { id: '68be85c3094d08828def90ce', name: 'Arkivbox Brun. Sv. Stand. Folio 80mm' },
    { id: '68be85c3094d08828def90cf', name: 'Arkivbox A4 60mm ryggbredd brun' },
    { id: '68be85c3094d08828def90d0', name: 'Arkivbox LEITZ Infinity FSC 80mm' },
    { id: '68be85c3094d08828def90d1', name: 'Arkivbox LEITZ Infinity FSC A4' },
    { id: '68be85c3094d08828def90d3', name: 'Arkivbox Brun. Sv. Stand. Folio 55mm' },
  ],

  // ovrigt-hemmet (54 products)
  'ovrigt-hemmet': [
    { id: '68be85b1094d08828def5336', name: 'Mepal Calypso Soptunna' },
    { id: '68be85b2094d08828def54e6', name: 'Prixton Hidra luftfuktare' },
    { id: '68be85b2094d08828def54e7', name: 'Madame - Elegant väsk-hängare' },
    { id: '68be85b2094d08828def5548', name: 'HANDY-BOX förvaringsbox' },
    { id: '68be85b2094d08828def554e', name: 'Het-men-cool kaffemugg med jordgubbsväxtfrön' },
    { id: '68be85b2094d08828def554f', name: 'Het-men-cool kaffemugg med basilika' },
    { id: '68be85b2094d08828def5550', name: 'Het-men-cool kaffemugg med körsbärstomat' },
    { id: '68be85b2094d08828def5551', name: 'Mepal Calypso Soptunna' },
    { id: '68be85b2094d08828def55c6', name: 'InSideOut hopfällbar korg med lock Sogne 40,5 x 33 x 42cm rPET' },
    { id: '68be85b2094d08828def55c7', name: 'InSideOut hopfällbar korg med lock Sogne 38 x 26 x 25cm rPET' },
    { id: '68be85b2094d08828def55c8', name: 'Kockmössa' },
    { id: '68be85bc094d08828def78fa', name: 'Het-men-cool kaffemugg med jordgubbsväxtfrön' },
    { id: '68be85c9094d08828defa87f', name: 'Presentationslåda Trä' },
    { id: '68be85c9094d08828defa880', name: 'Flugavvisande Fläkt' },
    { id: '68be85ca094d08828defaa09', name: 'PP solenergilampa Briony' },
    { id: '68be85ca094d08828defab78', name: 'Fjärilshus i furu Anita' },
    { id: '68be85ca094d08828defab81', name: 'Fuktighetsregulator Ronin' },
    { id: '68be85ca094d08828defab83', name: 'Glasoljespruta (100 ml) Caius' },
    { id: '68be85cb094d08828defb020', name: 'Nubes luftfuktare' },
    { id: '68be85cc094d08828defb188', name: 'Tulop luftfuktare' },
    { id: '68be85cf094d08828defc7bd', name: 'Sunflower Kit - Odlingssats solrosor' },
    { id: '68be85d0094d08828defc927', name: 'Mint Kit - Odlingssats myntafrön' },
    { id: '68be85d0094d08828defcc65', name: 'Basilop - Basilikafrön i kuvert' },
    { id: '68be85d0094d08828defcd1d', name: 'Girasol - Solrosfrön i kuvert' },
    { id: '68be85d1094d08828defce19', name: 'Greenjay - Fågelholk i plywood.' },
    { id: '68be85d1094d08828defce7f', name: 'DUCASSE. Väska för flera användningsområden i jute (260g/m²) och bomull (120g/m²)' },
    { id: '68be85d1094d08828defce8d', name: 'SHANDY. Bambu underlägg' },
    { id: '68be85d2094d08828defd258', name: 'Leyti - Stickor för örtfrön' },
    { id: '68be85d2094d08828defd25e', name: 'Fresa Kit - Odlingssats för jordgubbar' },
    { id: '68be85d2094d08828defd4ae', name: 'Roll - Fröremsa örtfrön 3m' },
    { id: '68be85d2094d08828defd5b9', name: 'Bombi Ii - Fröbomb med ängsblom' },
    { id: '68be85d2094d08828defd727', name: 'Bi - Timglas set' },
    { id: '68be85d3094d08828defd818', name: 'Cress - Odlingssats i äggkartong' },
    { id: '68be85d3094d08828defdb5b', name: 'Becka - Luftfuktare' },
    { id: '68be85d3094d08828defdb80', name: 'Salad - Odlingssats för sallad' },
    { id: '68be85d4094d08828defdbda', name: 'Flowers - Odlingssats för blommor' },
    { id: '68be85d4094d08828defdbe2', name: 'Strawberry - Jordgubbskit i trälåda' },
    { id: '68be85d4094d08828defdbe6', name: 'Seedlope - Blommor mix frön i kuvert' },
    { id: '68be85d4094d08828defdbf6', name: 'Arboga - Luftfuktare' },
    { id: '68be85d4094d08828defdca1', name: 'Mix Seeds - Zinkburk med 3 olika örtfrön' },
    { id: '68be85d4094d08828defdda3', name: 'Plantit Plant Etikett' },
    { id: '68be85d4094d08828defde7a', name: 'Seedlopebee - Blomfrön för bin' },
    { id: '68be85d4094d08828defdf5c', name: 'Flocca kapsel med blomfrö' },
    { id: '68be85d5094d08828defe18b', name: 'Bombi - Odlingssats för fröbomber' },
    { id: '68be85e2094d08828df012ab', name: 'Sugarcane Cup 200 ml drikkebeger' },
    { id: '68be85e4094d08828df01a50', name: 'Het-men-cool kaffemugg med jordgubbsväxtfrön' },
    { id: '68be85e4094d08828df01a51', name: 'Het-men-cool kaffemugg med basilika' },
    { id: '68be85e4094d08828df01b42', name: 'HANDY-BOX förvaringsbox' },
    { id: '68be85e4094d08828df01b45', name: 'HANDY-BOX förvaringsbox' },
    { id: '68be85e6094d08828df02376', name: 'Sandy' },
    { id: '68be85e8094d08828df02678', name: 'Mepal Calypso Soptunna' },
    { id: '68be85e9094d08828df02cf9', name: 'InSideOut hopfällbar korg med lock Sogne 40,5 x 33 x 42cm rPET' },
    { id: '68be85e9094d08828df02d96', name: 'InSideOut hopfällbar korg med lock Sogne 40,5 x 33 x 30cm rPET' },
    { id: '68be85ea094d08828df02f44', name: 'Madame - Elegant väsk-hängare' },
  ],

  // magnets (54 products)
  'magnets': [
    { id: '68be85c7094d08828defa1b6', name: 'Magnetblock 50x75x12mm' },
    { id: '68be85c7094d08828defa1b7', name: 'Magnetark ACTUAL 24x32cm' },
    { id: '68be85c7094d08828defa1b8', name: 'Magnetark ACTUAL 24x32cm' },
    { id: '68be85c7094d08828defa1b9', name: 'Magnetknappar LYRECO 37mm vit 3/fp' },
    { id: '68be85c7094d08828defa1ba', name: 'Magnetknappar DAHLE 13mm 10/fp' },
    { id: '68be85c7094d08828defa1bb', name: 'Magnet 16mm 10/fp' },
    { id: '68be85c7094d08828defa1bd', name: 'Magnet 25mm grön 10/fp' },
    { id: '68be85c7094d08828defa1be', name: 'Magnet WOODEN 25mm 5/fp' },
    { id: '68be85c7094d08828defa1bf', name: 'Magnet 16mm 10/fp' },
    { id: '68be85c7094d08828defa1c0', name: 'Magnetknappar ACTUAL 40mm 4/fp' },
    { id: '68be85c7094d08828defa1c1', name: 'Magnetknappar LYRECO 22mm 10/fp' },
    { id: '68be85c7094d08828defa1c2', name: 'Magnetknappar ACTUAL 40mm 4/fp' },
    { id: '68be85c7094d08828defa1c3', name: 'Magnetknappar ACTUAL 30 mm 5/fp' },
    { id: '68be85c7094d08828defa1c4', name: 'Magnetark ACTUAL 24x32cm' },
    { id: '68be85c7094d08828defa1c5', name: 'Magnetknappar LYRECO 10mm vit 20/fp' },
    { id: '68be85c7094d08828defa1c6', name: 'Magnetknappar DAHLE 13mm 10/fp' },
    { id: '68be85c7094d08828defa1c7', name: 'Magnetknappar ACTUAL 16mm 10/fp' },
    { id: '68be85c7094d08828defa1c8', name: 'Magnetknappar ACTUAL 25 mm 10/fp' },
    { id: '68be85c7094d08828defa1c9', name: 'Magnetknappar ACTUAL 40 mm 4/fp' },
    { id: '68be85c7094d08828defa1ca', name: 'Magnetknappar ACTUAL 25 mm 10/fp' },
    { id: '68be85c7094d08828defa1cb', name: 'Magnetknappar ACTUAL 40 mm 4/fp' },
    { id: '68be85c7094d08828defa1cc', name: 'Magnetark ACTUAL 24x32cm' },
    { id: '68be85c7094d08828defa1ce', name: 'Magnetknappar ACTUAL 30 mm 5/fp' },
    { id: '68be85c7094d08828defa1cf', name: 'Magnetknappar DAHLE 13mm 10/fp' },
    { id: '68be85c7094d08828defa263', name: 'Magnetknappar ACTUAL 40 mm 4/fp' },
    { id: '68be85c7094d08828defa26d', name: 'Magnetknappar ACTUAL 30 mm 5/fp' },
    { id: '68be85c7094d08828defa26e', name: 'Magnetknappar LYRECO 22mm 10/fp' },
    { id: '68be85c7094d08828defa26f', name: 'Magnetknappar ACTUAL 25 mm 10/fp' },
    { id: '68be85c7094d08828defa270', name: 'Magnetknappar ACTUAL 40 mm 4/fp' },
    { id: '68be85c7094d08828defa271', name: 'Magnetknappar LYRECO 22mm sor.färg 10/fp' },
    { id: '68be85c7094d08828defa272', name: 'Magnetknappar LYRECO 27mm 6/fp' },
    { id: '68be85c7094d08828defa273', name: 'Magnetknappar ACTUAL 20mm 6/fp' },
    { id: '68be85c7094d08828defa274', name: 'Magnetknappar DAHLE 13mm 10/fp' },
    { id: '68be85c7094d08828defa27b', name: 'Magnetknappar ACTUAL 25 mm 10/fp' },
    { id: '68be85c7094d08828defa27c', name: 'Magnetark ACTUAL 24x32cm' },
    { id: '68be85c7094d08828defa27d', name: 'Magnetknappar DAHLE 13mm 10/fp' },
    { id: '68be85c7094d08828defa27e', name: 'Magnetknappar LYRECO 27mm sort.färg 6/fp' },
    { id: '68be85c7094d08828defa27f', name: 'Magnetknappar ACTUAL 16mm 10/fp' },
    { id: '68be85c7094d08828defa281', name: 'Magnetknappar ACTUAL 16mm 10/fp' },
    { id: '68be85c7094d08828defa282', name: 'Magnetknappar ACTUAL 20mm 6/fp' },
    { id: '68be85c7094d08828defa283', name: 'Magnetknappar ACTUAL 30 mm 5/fp' },
    { id: '68be85c7094d08828defa284', name: 'Magnetknappar LYRECO 10mm sor.färg 20/fp' },
    { id: '68be85c7094d08828defa285', name: 'Magnetknappar LYRECO 27mm 6/fp' },
    { id: '68be85c7094d08828defa286', name: 'Magnetknappar ACTUAL 16 mm svart 10/fp' },
    { id: '68be85c7094d08828defa287', name: 'Magnetknappar ACTUAL 20mm 6/fp' },
    { id: '68be85c7094d08828defa289', name: 'Magnet NOBO svart 24mm 10/fp' },
    { id: '68be85c7094d08828defa28a', name: 'Magnetknappar PAVO 10x10mm grå 6/fp' },
    { id: '68be85c7094d08828defa28b', name: 'Magnet NOBO svart 32mm 10/fp' },
    { id: '68be85c7094d08828defa28c', name: 'Magnetknappar Crystal 30mm transp. 3/fp' },
    { id: '68be85c7094d08828defa28d', name: 'Magnetknappar ACTUAL 20mm 6/fp' },
    { id: '68be85c7094d08828defa28f', name: 'Magnetknappar ACTUAL 25mm gul 10/fp' },
    { id: '68be85c7094d08828defa290', name: 'Magnetknappar 30mm silver 6/fp' },
    { id: '68be85c7094d08828defa294', name: 'Magnet Super Strong 10x10x10mm 6/fp' },
    { id: '68be85c7094d08828defa298', name: 'Magnetband 19mmx3m' },
  ],

  // dokumentvaskor (50 products)
  'dokumentvaskor': [
    { id: '68be85ae094d08828def49d7', name: 'SuboBag Docu Skräddarsydd Dokumentväska' },
    { id: '68be85ae094d08828def49de', name: 'Refelt Money RPET-väska i filt' },
    { id: '68be85af094d08828def4cef', name: 'Dokumentväska i RPET filt Riley' },
    { id: '68be85af094d08828def4cf5', name: 'Dokumentväska i RPET filt Scarlett' },
    { id: '68be85af094d08828def4cf7', name: 'Dokumentväska i RPET filt' },
    { id: '68be85bf094d08828def7ff9', name: 'Detroit RPET-konferensväska 4L' },
    { id: '68be85bf094d08828def8167', name: 'Anchorage konferensväska 11L' },
    { id: '68be85bf094d08828def8168', name: 'Florida konferensväska 7L' },
    { id: '68be85bf094d08828def8169', name: 'Orlando konferensväska 3L' },
    { id: '68be85bf094d08828def816a', name: 'Santa Fee konferensväska 6L' },
    { id: '68be85bf094d08828def816c', name: 'Torba - Dokumentväska' },
    { id: '68be85bf094d08828def816d', name: 'Konferensväska, i polyester (600D), Elfrieda' },
    { id: '68be85bf094d08828def816e', name: 'DocuTravel dokumentväska' },
    { id: '68be85bf094d08828def8170', name: 'Dokumentväska (70D) i Polyester Giuseppe' },
    { id: '68be85bf094d08828def8171', name: 'MILO. 600D konferensmapp' },
    { id: '68be85bf094d08828def8172', name: 'KAYL. Non-woven konferensmapp (80 g/m²)' },
    { id: '68be85bf094d08828def8173', name: 'Boutique Document Slip' },
    { id: '68be85bf094d08828def8174', name: 'Dokumentväska File' },
    { id: '68be85bf094d08828def8175', name: 'Dokumentväska Bristol' },
    { id: '68be85bf094d08828def8176', name: 'Dokumentväska Pi' },
    { id: '68be85bf094d08828def8177', name: 'Dokumentväska Busy' },
    { id: '68be85bf094d08828def8178', name: 'Dokumentväska Record' },
    { id: '68be85bf094d08828def820f', name: 'Dokkux' },
    { id: '68be85bf094d08828def8210', name: 'Slidox RPET dokumentväska' },
    { id: '68be85bf094d08828def8211', name: 'SuboBag Docu Skräddarsydd Dokumentväska' },
    { id: '68be85c1094d08828def87e5', name: 'Dokumentväska i RPET filt Scarlett' },
    { id: '68be85cd094d08828defb929', name: 'CreaFelt Docu dokumentväska med tryck' },
    { id: '68be85cd094d08828defb92d', name: 'Dokumentväska Workshop' },
    { id: '68be85cd094d08828defb92e', name: 'Dokumentväska Avanti Doc' },
    { id: '68be85cd094d08828defb930', name: 'DocuTravel Pro dokumentväska' },
    { id: '68be85cd094d08828defb931', name: 'Expo - Konferensväska med axelrem' },
    { id: '68be85ce094d08828defc415', name: 'Brenna Pouch - Vattenavvisande dokumentväska' },
    { id: '68be85d2094d08828defd4de', name: 'Case Logic Notebook 13"' },
    { id: '68be85d2094d08828defd60c', name: 'Case Logic Huxton 15,6" laptop attaché. Grafitgrå' },
    { id: '68be85d4094d08828defde95', name: 'Bergby - Dokumentväska' },
    { id: '68be85de094d08828df00a27', name: 'Detroit RPET-konferensväska 4L' },
    { id: '68be85df094d08828df00ab6', name: 'Impact AWARE basic dokumentväska' },
    { id: '68be85e0094d08828df00e5b', name: 'Impact AWARE basic dokumentväska' },
    { id: '68be85e6094d08828df02258', name: 'Dokkux' },
    { id: '68be85e6094d08828df02281', name: 'Anchorage konferensväska 11L' },
    { id: '68be85e6094d08828df02285', name: 'Florida konferensväska 7L' },
    { id: '68be85e6094d08828df02293', name: 'Detroit RPET-konferensväska 4L' },
    { id: '68be85e6094d08828df02297', name: 'Orlando konferensväska 3L' },
    { id: '68be85e6094d08828df022f9', name: 'Santa Fee konferensväska 6L' },
    { id: '68be85e8094d08828df027c5', name: 'Konferensväska, i polyester (600D), Elfrieda' },
    { id: '68be85e8094d08828df02851', name: 'Flapa - Dokumentväska i  polyester' },
    { id: '68be85e8094d08828df028e0', name: 'Dokumentväska, i polyester (600D), Nicola' },
    { id: '68be85e8094d08828df028ee', name: 'Dokumentväska (70D) i Polyester Giuseppe' },
    { id: '68be85e8094d08828df02960', name: 'Torba - Dokumentväska' },
    { id: '68be85e9094d08828df02a20', name: 'Dokumentväska, i polyester (600D), Niam' },
  ],

  // bestick (48 products)
  'bestick': [
    { id: '68be85b0094d08828def5129', name: 'Biteful - Bestickset och fodral i PLA' },
    { id: '68be85b0094d08828def5186', name: 'Camino bestickset' },
    { id: '68be85b1094d08828def53e1', name: 'Biteful - Bestickset och fodral i PLA' },
    { id: '68be85b1094d08828def5490', name: 'Outdoor 6-piece Bestickset' },
    { id: '68be85b1094d08828def5491', name: 'Outdoor 3-piece Bestickset' },
    { id: '68be85b1094d08828def5494', name: 'Ätpinnar i Bambu' },
    { id: '68be85b2094d08828def5520', name: 'Kito Chopsticks' },
    { id: '68be85b2094d08828def5523', name: 'Camino bestickset' },
    { id: '68be85b2094d08828def5524', name: 'New England Bestickset' },
    { id: '68be85b2094d08828def5525', name: 'Elisabeth Bestickset 60 delar' },
    { id: '68be85b2094d08828def572f', name: 'Outdoor 3-piece Bestickset' },
    { id: '68be85be094d08828def7ded', name: 'Outdoor 6-piece Bestickset' },
    { id: '68be85ca094d08828defa8ef', name: 'Norma Bestickset 16 delar' },
    { id: '68be85ca094d08828defa8f0', name: 'Lupo Emil' },
    { id: '68be85ca094d08828defa901', name: 'Tåre Tapasgaffel 4-pack' },
    { id: '68be85ca094d08828defa902', name: 'Brabantia Make & Take Bestickset' },
    { id: '68be85ca094d08828defa903', name: 'Bestickset 4 delar' },
    { id: '68be85ca094d08828defa904', name: 'Bestickset 3 delar' },
    { id: '68be85ca094d08828defa905', name: 'Bestickset "Eco Trip"' },
    { id: '68be85ca094d08828defa906', name: 'Bestick Bambu' },
    { id: '68be85ca094d08828defa939', name: 'Van Gogh 500 Lunchbox' },
    { id: '68be85ca094d08828defa93a', name: 'Skärbräda Acacia Cut' },
    { id: '68be85ca094d08828defaa18', name: 'Mepal Ellipse bestickset' },
    { id: '68be85ca094d08828defaa19', name: 'Black+Blum Bestickset' },
    { id: '68be85d0094d08828defcabd', name: 'Hollyware - Bestickset för julbord' },
    { id: '68be85d0094d08828defcc42', name: 'Vermeer Lunchbox' },
    { id: '68be85d0094d08828defccac', name: 'BOULUD. 3-delat set i akaciaträ' },
    { id: '68be85d0094d08828defcd05', name: 'Warhol Lunchbox' },
    { id: '68be85d0094d08828defcde4', name: 'Van Gogh 1000 Lunchbox' },
    { id: '68be85d1094d08828defd067', name: 'Woller bestickset' },
    { id: '68be85d3094d08828defd864', name: 'SUYA. Trä bestick set' },
    { id: '68be85d3094d08828defd9fd', name: 'SALVY. Set med 2 salladskålar' },
    { id: '68be85d4094d08828defdd1b', name: 'Sullery bestickset' },
    { id: '68be85d4094d08828defdd41', name: 'Mayen Set - Sallasbestickset i bambu' },
    { id: '68be85d4094d08828defdd8e', name: 'Escaro set med salladsskedar' },
    { id: '68be85d4094d08828defde5d', name: 'Mayen - Salladssked i bambu' },
    { id: '68be85d4094d08828defde8a', name: 'Fideli - Bestickset' },
    { id: '68be85d4094d08828defdf27', name: 'Setstraw - Bestick i bambu och sugrör' },
    { id: '68be85d4094d08828defdf39', name: 'Root bestickset i 5 delar av rostfritt stål och bokträ' },
    { id: '68be85d4094d08828defe130', name: 'Mino - Träbestick' },
    { id: '68be85df094d08828df00aa4', name: 'Estrid Bestickset 60 delar' },
    { id: '68be85e0094d08828df00e02', name: 'Elisabeth Bestickset 60 delar' },
    { id: '68be85e0094d08828df00e03', name: 'New England Bestickset' },
    { id: '68be85e0094d08828df00e04', name: 'Victoria Bestickset' },
    { id: '68be85e0094d08828df00e05', name: 'Classic Bestickset' },
    { id: '68be85e2094d08828df012a3', name: 'Kito Chopsticks' },
    { id: '68be85e2094d08828df012a8', name: 'Dessert- / Förrättsbestick 8 delar' },
    { id: '68be85ea094d08828df02e75', name: 'ROBUSTA BESTICK I PAKKATRÄ' },
  ],

  // penn-och-prylstall (48 products)
  'penn-och-prylstall': [
    { id: '68be85c6094d08828def9ebb', name: 'Blankettbox DURABLE Varicolor 4 Safe' },
    { id: '68be85c6094d08828def9ebd', name: 'Skrivbordsförvaring CEP Silva Bambu' },
    { id: '68be85c6094d08828def9ebe', name: 'Pennkopp LYRECO' },
    { id: '68be85c6094d08828def9ebf', name: 'Pennkopp DURABLE VARICOLOR grå' },
    { id: '68be85c6094d08828def9ec0', name: 'Prylställ LYRECO 8-fack blå' },
    { id: '68be85c6094d08828def9ec2', name: 'Pennkopp Terranova orange' },
    { id: '68be85c6094d08828def9ec4', name: 'Prylställ EXACOMPTA BeeBlue 6 fack blå' },
    { id: '68be85c6094d08828def9ec6', name: 'Prylställ CEP Ellypse 4-fack' },
    { id: '68be85c6094d08828def9ec7', name: 'Pennkopp DURABLE ECO' },
    { id: '68be85c6094d08828def9ec8', name: 'Pennkopp DURABLE ECO' },
    { id: '68be85c6094d08828def9ec9', name: 'Prylställ CEP 580 Mineral grå' },
    { id: '68be85c6094d08828def9eca', name: 'Pennkopp DURABLE ECO' },
    { id: '68be85c6094d08828def9ecc', name: 'Förvaringsväska LEITZ ty' },
    { id: '68be85c6094d08828def9ecf', name: 'Prylställ CEP PRO GLOSS' },
    { id: '68be85c6094d08828def9ed0', name: 'Prylställ CEP Riviera 8 fack turkos' },
    { id: '68be85c6094d08828def9ed1', name: 'Prylställ CEP Ellypse 4-fack' },
    { id: '68be85c6094d08828def9fba', name: 'Prylställ DJOIS Eco' },
    { id: '68be85c6094d08828def9fbb', name: 'Pennkopp BIGSO Penny karton' },
    { id: '68be85c6094d08828def9fbc', name: 'Prylställ DJOIS Eco' },
    { id: '68be85c6094d08828def9fbe', name: 'Pennkopp BIGSO Penny karton' },
    { id: '68be85c6094d08828def9fbf', name: 'Prylställ HAN Re-X-LOOP 4 fack' },
    { id: '68be85c6094d08828def9fc0', name: 'Pennkopp LYRECO klar' },
    { id: '68be85c6094d08828def9fc1', name: 'Förvaring med handtag BIGSO Hurry' },
    { id: '68be85c6094d08828def9fc3', name: 'Prylställ CEP PRO GLOSS' },
    { id: '68be85c6094d08828def9fc4', name: 'Prylställ karton' },
    { id: '68be85c6094d08828def9fc5', name: 'Prylställ karton' },
    { id: '68be85c6094d08828def9fc6', name: 'Förvaring med handtag BIGSO Hurry' },
    { id: '68be85c6094d08828def9fc7', name: 'Blockask i nät 100x100mm silver' },
    { id: '68be85c6094d08828def9fc8', name: 'Pennkopp LYRECO' },
    { id: '68be85c6094d08828def9fc9', name: 'Pennkopp nät metall 80x100mm' },
    { id: '68be85c6094d08828def9fca', name: 'Förvaring med handtag BIGSO' },
    { id: '68be85c6094d08828def9fcb', name: 'Prylställ HAN Re-X-LOOP 4 fack' },
    { id: '68be85c6094d08828def9fcc', name: 'Pennkopp BIGSO Penny kartong Mint' },
    { id: '68be85c6094d08828def9fcd', name: 'Prylställ HAN 9 fack' },
    { id: '68be85c6094d08828def9fce', name: 'Pennkopp nät metall 80x100mm' },
    { id: '68be85c6094d08828def9fcf', name: 'Prylställ CEP ICE isblå' },
    { id: '68be85c6094d08828def9fd0', name: 'Skrivbordsförvaring BIGSO Elisa Mint' },
    { id: '68be85c6094d08828def9fd2', name: 'Pennkopp magnetisk Greenspirit svart' },
    { id: '68be85c6094d08828def9fd5', name: 'Pennkopp BIGSO Penny kartong linne' },
    { id: '68be85c6094d08828def9fd6', name: 'Prylställ BIGSO Elisa linne' },
    { id: '68be85c6094d08828def9fd7', name: 'Lådställ CEP Organizer' },
    { id: '68be85c6094d08828def9fd8', name: 'Prylställ HAN 9 fack' },
    { id: '68be85c6094d08828def9fdb', name: 'Kuvertställ nät 3-fack svart' },
    { id: '68be85c6094d08828def9fdc', name: 'Prylställ BIGSO Elisa svart' },
    { id: '68be85c6094d08828def9fdd', name: 'Blockask i nät 95x95mm svart' },
    { id: '68be85c6094d08828def9fde', name: 'Pennkopp CEPPro svart' },
    { id: '68be85c6094d08828def9fe0', name: 'Pennkopp magnetisk Gloss vit' },
    { id: '68be85c6094d08828def9fe1', name: 'Pennkopp metall silver' },
  ],

  // tablet-skal-fodral (47 products)
  'tablet-skal-fodral': [
    { id: '68be85ad094d08828def463b', name: 'Cotin - 15" datafodral i bomull' },
    { id: '68be85ad094d08828def481e', name: 'Case Logic iPad Sleeve. Black' },
    { id: '68be85ad094d08828def481f', name: 'Case Logic Sleeve för iPad/tablet. Svart' },
    { id: '68be85ad094d08828def4820', name: 'Case Logic PC Sleeve. 10". Blue' },
    { id: '68be85ad094d08828def486a', name: 'Case Logic Universal Folio iPad. Black' },
    { id: '68be85ad094d08828def486b', name: 'Case Logic Cover for iPad Mini 2. Grey' },
    { id: '68be85ad094d08828def486c', name: 'Case Logic Tablet Sleeve 7-10". Blue' },
    { id: '68be85bf094d08828def8320', name: 'GRAPHS CROSS. 600D axelväska' },
    { id: '68be85bf094d08828def83a2', name: 'Armond 15.6" laptopsleeve AWARE RPET' },
    { id: '68be85c0094d08828def8626', name: 'Notu fodral för surfplatta' },
    { id: '68be85c0094d08828def8627', name: 'Cotin - 15" datafodral i bomull' },
    { id: '68be85c0094d08828def8628', name: 'Grab Pouch' },
    { id: '68be85c0094d08828def862a', name: 'Ipad Fodral Filt' },
    { id: '68be85c0094d08828def862b', name: 'AVERY. Laptopväska upp till 15""' },
    { id: '68be85c0094d08828def862c', name: 'Apple Leather Laptop Bag 15/16"' },
    { id: '68be85c0094d08828def862d', name: 'Recycled Felt & Apple Leather Laptop Sleeve 14"' },
    { id: '68be85c0094d08828def862e', name: 'Recycled Felt & Apple Leather Laptop Sleeve Plus 16"' },
    { id: '68be85c0094d08828def862f', name: 'Case Logic iPad Sleeve. Black' },
    { id: '68be85c0094d08828def8630', name: 'Case Logic Universal Folio iPad. Black' },
    { id: '68be85c0094d08828def8631', name: 'Case Logic Cover for iPad Mini 2. Grey' },
    { id: '68be85c1094d08828def8899', name: 'Case Logic Sleeve för iPad/tablet. Svart' },
    { id: '68be85cd094d08828defb87a', name: 'James Harvest - Pacifica' },
    { id: '68be85cd094d08828defb89e', name: 'Case Logic Reflect 13 inch Laptop Sleeve laptopfodral' },
    { id: '68be85cd094d08828defb89f', name: 'Case Logic Reflect 14 inch Laptop Sleeve laptopfodral' },
    { id: '68be85cd094d08828defb8a0', name: 'Case Logic Reflect 15,6 inch Laptop Sleeve' },
    { id: '68be85ce094d08828defc42c', name: 'Fodral till läsplatta (Tryck 2 sidor) EU' },
    { id: '68be85cf094d08828defc66e', name: 'Fodral till läsplatta (Tryck 1 sida) EU' },
    { id: '68be85d0094d08828defc9e6', name: 'PLATTE. Vattentät väska för tabletter upp till 9.7 ?i PVC' },
    { id: '68be85d2094d08828defd2b1', name: 'Case Logic Snapview Case för iPad Air®. Svart' },
    { id: '68be85d2094d08828defd32d', name: 'CreaFelt Tablet anpassad tabletthållare' },
    { id: '68be85d2094d08828defd4cc', name: 'Case Logic iPad 3 Sleeve. Purple' },
    { id: '68be85d2094d08828defd4cd', name: 'Case Logic Tablet Sleeve 10". Black' },
    { id: '68be85d2094d08828defd4ce', name: 'Case Logic SureFit Slim Folio Case för 7" Tablet. Blå' },
    { id: '68be85d2094d08828defd4cf', name: 'Case Logic iPad Mini Sleeve. Morel' },
    { id: '68be85d2094d08828defd4d1', name: 'Case Logic iPad Mini Sleeve. Grey' },
    { id: '68be85d2094d08828defd4d2', name: 'Case Logic sleeve för iPad Air eller 10" surfplatta. Svart' },
    { id: '68be85d2094d08828defd4d3', name: 'Case Logic iPad mini 7 "Tablet sleeve med ficka' },
    { id: '68be85d2094d08828defd5eb', name: 'Case Logic 15,6" Laptop Sleeve. Svart' },
    { id: '68be85d2094d08828defd5ec', name: 'Case Logic 13" Laptop Sleeve. Svart' },
    { id: '68be85d2094d08828defd6c4', name: 'Case Logic Invigo 14 tums återvunnet laptopfodral' },
    { id: '68be85d4094d08828defdf49', name: 'Feddox RPET väska för bärbar dator' },
    { id: '68be85e1094d08828df01077', name: 'Armond 15.6" laptopsleeve AWARE RPET' },
    { id: '68be85e8094d08828df0293e', name: 'Apple Leather Laptop Bag 15/16"' },
    { id: '68be85e8094d08828df0293f', name: 'Recycled Felt & Apple Leather Laptop Sleeve 14"' },
    { id: '68be85e8094d08828df02940', name: 'Recycled Felt & Apple Leather Laptop Sleeve Plus 16"' },
    { id: '68be85eb094d08828df02fbe', name: 'Notu fodral för surfplatta' },
    { id: '68be85eb094d08828df02fc2', name: 'Liberto fodral för surfplatta' },
  ],

  // hoodies (47 products)
  'hoodies': [
    { id: '68be85b2094d08828def5829', name: 'Junior Hood' },
    { id: '68be85b2094d08828def582e', name: 'Junior Hood Jacket' },
    { id: '68be85b2094d08828def5830', name: 'Hoodtröja Sport Barn by AWDis' },
    { id: '68be85b2094d08828def5832', name: 'Printer - Pentathlon Junior' },
    { id: '68be85b2094d08828def58b0', name: 'Hoodtröja Sport Barn by AWDis' },
    { id: '68be85b4094d08828def5d6a', name: 'Junior Hood Jacket' },
    { id: '68be85b5094d08828def610c', name: 'Hoodtröja Reflex Herr' },
    { id: '68be85b5094d08828def63d6', name: 'Printer RED - Switch' },
    { id: '68be85b5094d08828def6433', name: 'Junior Hood Jacket' },
    { id: '68be85b6094d08828def647c', name: 'Varsity Hoodie by AWDis' },
    { id: '68be85b6094d08828def647e', name: 'Collegejacka Zoodie by AWDis' },
    { id: '68be85b6094d08828def647f', name: 'Original Hood Jacket' },
    { id: '68be85b6094d08828def6530', name: 'Printer - Overhead' },
    { id: '68be85b6094d08828def6537', name: 'Junior Hood' },
    { id: '68be85b6094d08828def6538', name: 'Baseball Hoodie by AWDis' },
    { id: '68be85b6094d08828def6539', name: 'Varsity Zoodie by AWDis' },
    { id: '68be85b6094d08828def653a', name: 'Printer - Fastpitch Rsx' },
    { id: '68be85b6094d08828def6540', name: 'Midland Full Zip Hood' },
    { id: '68be85b6094d08828def6541', name: 'Street Hoodie by AWDis' },
    { id: '68be85b6094d08828def6544', name: 'Huvjacka Superstar Herr' },
    { id: '68be85b6094d08828def6547', name: 'Hoodtröja Sport Barn by AWDis' },
    { id: '68be85b6094d08828def6548', name: 'Collegejacka Chunky Zoodie by AWDis' },
    { id: '68be85b6094d08828def65a0', name: 'Hoodtröja Reflex Herr' },
    { id: '68be85b6094d08828def65a4', name: 'Electric Hoodie' },
    { id: '68be85b6094d08828def65a6', name: 'SupaSoft Hoodie by AWDis' },
    { id: '68be85b7094d08828def67dd', name: 'Varsity Hoodie by AWDis' },
    { id: '68be85b7094d08828def67e6', name: 'Collegejacka Zoodie by AWDis' },
    { id: '68be85b7094d08828def67e8', name: 'Original Hood Jacket' },
    { id: '68be85b7094d08828def67eb', name: 'Original Hood' },
    { id: '68be85b8094d08828def6873', name: 'Printer - Overhead' },
    { id: '68be85b8094d08828def6921', name: 'Baseball Hoodie by AWDis' },
    { id: '68be85b8094d08828def69bc', name: 'Midland Full Zip Hood' },
    { id: '68be85b8094d08828def69c2', name: 'Street Hoodie by AWDis' },
    { id: '68be85b8094d08828def6a5d', name: 'Huvjacka Superstar Herr' },
    { id: '68be85b8094d08828def6a6d', name: 'Collegejacka Chunky Zoodie by AWDis' },
    { id: '68be85b8094d08828def6b0f', name: 'Printer - Pentathlon' },
    { id: '68be85b8094d08828def6ba6', name: 'Printer - Pentathlon Junior' },
    { id: '68be85ba094d08828def6edd', name: 'SupaSoft Hoodie by AWDis' },
    { id: '68be85d5094d08828defe4ca', name: 'Collegejacka Retro Zoodie by AWDis' },
    { id: '68be85e2094d08828df013b2', name: 'Original Hood Jacket' },
    { id: '68be85e2094d08828df013b3', name: 'Original Hood' },
    { id: '68be85e2094d08828df013bf', name: 'Junior Hood' },
    { id: '68be85e2094d08828df0147f', name: 'Junior Hood Jacket' },
    { id: '68be85e5094d08828df01e42', name: 'Printer - Overhead' },
    { id: '68be85e5094d08828df01e59', name: 'Printer - Fastpitch Rsx' },
    { id: '68be85e5094d08828df01f24', name: 'Printer - Pentathlon' },
    { id: '68be85e5094d08828df01f26', name: 'Printer - Pentathlon Junior' },
  ],

  // picnic (42 products)
  'picnic': [
    { id: '68be85af094d08828def4b7c', name: 'WHITSUNDAY. 600D High Density Återvunnen Polyester Picknick kylväskryggsäck' },
    { id: '68be85af094d08828def4c5e', name: 'Bangkok Cooler' },
    { id: '68be85b2094d08828def56f3', name: 'Tierra set med sugrör och bestick' },
    { id: '68be85b2094d08828def56f4', name: 'Montecool - Kylväska 600D RPET' },
    { id: '68be85b2094d08828def56f7', name: 'Hållare Mugghållare i neopren' },
    { id: '68be85b2094d08828def56f9', name: 'Hållare Burk och flaskhållare i neopren (6 burkar)' },
    { id: '68be85b2094d08828def572d', name: 'Nolan Picnic RPET ryggsäck' },
    { id: '68be85b2094d08828def572e', name: 'Kenna - Picknickkorg/varukorg' },
    { id: '68be85b2094d08828def5730', name: 'Picknickgrill' },
    { id: '68be85b2094d08828def5731', name: 'Picknickryggsäck Outdoor' },
    { id: '68be85b2094d08828def5732', name: 'WHITSUNDAY. 600D High Density Återvunnen Polyester Picknick kylväskryggsäck' },
    { id: '68be85b8094d08828def6b7f', name: 'Carry' },
    { id: '68be85be094d08828def7d70', name: 'Carry' },
    { id: '68be85be094d08828def7d71', name: 'Hållare Mugghållare i neopren' },
    { id: '68be85be094d08828def7de9', name: 'BASKIT. Smidig picknickkorg i 600D 25 L' },
    { id: '68be85be094d08828def7dea', name: 'Kenna - Picknickkorg/varukorg' },
    { id: '68be85be094d08828def7deb', name: 'Donni -  Picknick/varukorg' },
    { id: '68be85be094d08828def7dec', name: 'Keno -Picknickkorg/varukorg' },
    { id: '68be85be094d08828def7dee', name: 'Bangkok Cooler' },
    { id: '68be85be094d08828def7def', name: 'Picknickgrill' },
    { id: '68be85be094d08828def7df0', name: 'Paccola kylväska picknickkorg' },
    { id: '68be85bf094d08828def81fb', name: 'Carry' },
    { id: '68be85c0094d08828def8659', name: 'Paccola kylväska picknickkorg' },
    { id: '68be85c9094d08828defa718', name: 'QualityTime picknickkorg' },
    { id: '68be85d0094d08828defcca0', name: 'Scampa RPET picknickkorg' },
    { id: '68be85d0094d08828defcd58', name: 'Pikken RPET picknickset' },
    { id: '68be85d1094d08828defce96', name: 'Picknick väska, i canvas Jacques' },
    { id: '68be85d1094d08828defd12a', name: 'Cesta - Hopfällbar picknickkorg' },
    { id: '68be85d2094d08828defd315', name: 'Hudson - Picknickväska för 2 personer' },
    { id: '68be85d2094d08828defd6eb', name: 'BLEND. Nylon kylväska' },
    { id: '68be85d2094d08828defd726', name: 'Duin - 4-delars Picknickryggsäck' },
    { id: '68be85d4094d08828defdf53', name: 'Koppi RPET kylväska picknickryggsäck' },
    { id: '68be85d4094d08828defe081', name: 'Mimbre Plus - Flätad picknick korg 4 pers.' },
    { id: '68be85d4094d08828defe138', name: 'Memo - Picknickryggsäck' },
    { id: '68be85e0094d08828df00d23', name: 'Nolan Picnic RPET ryggsäck' },
    { id: '68be85e0094d08828df00ffd', name: 'Tierra set med sugrör och bestick' },
    { id: '68be85e5094d08828df01ef4', name: 'Carry' },
    { id: '68be85e8094d08828df026e1', name: 'Paccola kylväska picknickkorg' },
    { id: '68be85e8094d08828df027c3', name: 'Hållare Mugghållare i neopren' },
    { id: '68be85e8094d08828df027ce', name: 'Hållare Burk och flaskhållare i neopren (6 burkar)' },
    { id: '68be85ea094d08828df02e4a', name: 'Kylväska Picknick i polycanvas (600D) Jolie' },
    { id: '68be85eb094d08828df03122', name: 'Montecool - Kylväska 600D RPET' },
  ],

  // matchstall (42 products)
  'matchstall': [
    { id: '68be85b4094d08828def5f39', name: 'Progress 2.0 Graphic Jersey M' },
    { id: '68be85b4094d08828def5f40', name: 'Progress 2.0 Shorts M' },
    { id: '68be85b4094d08828def5f41', name: 'Progress Reversible Shorts M' },
    { id: '68be85b4094d08828def5f48', name: 'Progress 2.0 Graphic Jersey Jr' },
    { id: '68be85b4094d08828def5f4b', name: 'Progress 2.0 Stripe Jersey M' },
    { id: '68be85b4094d08828def5f4f', name: 'Progress 2.0 Graphic Jersey W' },
    { id: '68be85b4094d08828def5f51', name: 'Progress 2.0 Stripe Jersey Jr' },
    { id: '68be85b4094d08828def5f52', name: 'Progress 2.0 Stripe Jersey W' },
    { id: '68be85b4094d08828def6012', name: 'Teamtröja Basic' },
    { id: '68be85b4094d08828def6017', name: 'Progress Basket Shorts Jr' },
    { id: '68be85b4094d08828def601f', name: 'Progress Indoor 3-Pack Sock' },
    { id: '68be85b5094d08828def60c4', name: 'Adv Nordic Ski Club Suit W' },
    { id: '68be85b5094d08828def60c7', name: 'Adv Nordic Ski Club Tights M' },
    { id: '68be85b5094d08828def60c9', name: 'Adv Nordic Ski Club Suit M' },
    { id: '68be85b5094d08828def60d1', name: 'Craft Långärmad T-shirt Rush Junior' },
    { id: '68be85b5094d08828def619f', name: 'Craft Vindjacka Rush Herr' },
    { id: '68be85b5094d08828def61a7', name: 'Craft Sporttop Rush Dam' },
    { id: '68be85b5094d08828def6264', name: 'Craft Långärmad T-shirt Rush Dam' },
    { id: '68be85b5094d08828def6265', name: 'Ability Skirt W' },
    { id: '68be85b5094d08828def6266', name: 'Craft Vindjacka Rush Dam' },
    { id: '68be85b5094d08828def626d', name: 'Craft Vindjacka Rush Junior' },
    { id: '68be85b5094d08828def627c', name: 'Ability Skirt Jr' },
    { id: '68be85b5094d08828def62ab', name: 'Ability Skirt W' },
    { id: '68be85b5094d08828def636f', name: 'Team Wct Jacket M' },
    { id: '68be85b5094d08828def6372', name: 'Team Wct Jacket Jr' },
    { id: '68be85b5094d08828def6379', name: 'Team Wct Jacket W' },
    { id: '68be85ca094d08828defab89', name: 'Cykel jersey SXC 1 (Dam) EU' },
    { id: '68be85ca094d08828defacb4', name: 'Cykel jersey SXC 3 RIB (Dam) EU' },
    { id: '68be85cb094d08828defacd1', name: 'T-shirt SXT 3 Teardrop (135 g) Dam EU' },
    { id: '68be85cb094d08828defad7a', name: 'Cykel jersey SXC 3 RIB (Herr) EU' },
    { id: '68be85cb094d08828defafba', name: 'Cykel jersey SXC 1 (Herr) EU' },
    { id: '68be85d5094d08828defe4da', name: 'Zaero Vest 3.0 M' },
    { id: '68be85d5094d08828defe524', name: 'Craft Långärmad T-shirt Rush Herr' },
    { id: '68be85e2094d08828df01359', name: 'Progress 2.0 Graphic Jersey M' },
    { id: '68be85e2094d08828df0135f', name: 'Progress 2.0 Shorts M' },
    { id: '68be85e2094d08828df0145e', name: 'Progress Reversible Shorts M' },
    { id: '68be85e2094d08828df01541', name: 'Progress 2.0 Graphic Jersey Jr' },
    { id: '68be85e2094d08828df01553', name: 'Progress 2.0 Stripe Jersey M' },
    { id: '68be85e2094d08828df015e1', name: 'Progress 2.0 Graphic Jersey W' },
    { id: '68be85e2094d08828df015ef', name: 'Progress 2.0 Stripe Jersey Jr' },
    { id: '68be85e3094d08828df0165d', name: 'Progress 2.0 Stripe Jersey W' },
    { id: '68be85e4094d08828df01989', name: 'Progress Basket Shorts Jr' },
  ],

  // tillbehor (41 products)
  'tillbehor': [
    { id: '68be85b4094d08828def5ff5', name: 'Zip-puller SW 5-pack' },
    { id: '68be85b4094d08828def5ff6', name: 'Printer - Zip Puller' },
    { id: '68be85b4094d08828def5ff8', name: 'Printer - Knapp Stor' },
    { id: '68be85b4094d08828def5ff9', name: 'Printer - Knapp Liten' },
    { id: '68be85b4094d08828def5ffc', name: 'Hängslen' },
    { id: '68be85b4094d08828def5ffd', name: 'Printer - Drawstring Stopper' },
    { id: '68be85b4094d08828def5ffe', name: 'Hängslen' },
    { id: '68be85b4094d08828def5fff', name: 'Hängslen' },
    { id: '68be85b4094d08828def6000', name: 'Manchettknappar + Slipshållare' },
    { id: '68be85b4094d08828def6001', name: 'Manschettknappar' },
    { id: '68be85b4094d08828def6002', name: 'Classic Boxer 2-Pack' },
    { id: '68be85b4094d08828def6003', name: 'Hängslen' },
    { id: '68be85b4094d08828def6004', name: 'Hängslen' },
    { id: '68be85b4094d08828def6005', name: 'Hängslen' },
    { id: '68be85b4094d08828def6006', name: 'Hängslen' },
    { id: '68be85b4094d08828def6007', name: 'Cotton Removable Patch' },
    { id: '68be85b4094d08828def6008', name: 'Manchettknappar + Slipshållare' },
    { id: '68be85b4094d08828def6009', name: 'Manchettknappar + Slipshållare' },
    { id: '68be85d3094d08828defd936', name: 'Manschettknappar (Ungern)' },
    { id: '68be85d4094d08828defdc15', name: 'Manschettknappar (Sverige)' },
    { id: '68be85d4094d08828defdce7', name: 'Euro manschettknapp' },
    { id: '68be85d4094d08828defdcfa', name: 'Manschettknappar (Polen)' },
    { id: '68be85e5094d08828df01e3b', name: 'Printer - Zip Puller' },
    { id: '68be85e5094d08828df01e41', name: 'Printer - Knapp Stor' },
    { id: '68be85e5094d08828df01e46', name: 'Printer - Knapp Liten' },
    { id: '68be85e5094d08828df01e4b', name: 'Printer - Drawstring Stopper' },
    { id: '68be85e5094d08828df01e6f', name: 'Hängslen' },
    { id: '68be85e5094d08828df01e7d', name: 'Hängslen' },
    { id: '68be85e5094d08828df01e82', name: 'Hängslen' },
    { id: '68be85e5094d08828df01e83', name: 'Hängslen' },
    { id: '68be85e5094d08828df01f49', name: 'Manchettknappar + Slipshållare' },
    { id: '68be85e5094d08828df01f4a', name: 'Manschettknappar' },
    { id: '68be85e5094d08828df01f4b', name: 'Ärmhållare' },
    { id: '68be85e5094d08828df01f57', name: 'Hängslen' },
    { id: '68be85e5094d08828df01f58', name: 'Hängslen' },
    { id: '68be85e5094d08828df01f59', name: 'Ärmhållare' },
    { id: '68be85e5094d08828df01f5e', name: 'Hängslen' },
    { id: '68be85e5094d08828df01f5f', name: 'Hängslen' },
    { id: '68be85e5094d08828df01f60', name: 'Hängslen' },
    { id: '68be85e6094d08828df02048', name: 'Manchettknappar + Slipshållare' },
    { id: '68be85e6094d08828df0204b', name: 'Manchettknappar + Slipshållare' },
  ],

  // whiteboardtavlor-glas (40 products)
  'whiteboardtavlor-glas': [
    { id: '68be85c8094d08828defa5cc', name: 'Glastavla LEITZ Cosy 80x60cm' },
    { id: '68be85c8094d08828defa5cd', name: 'Glastavla LEITZ Cosy 80x60cm' },
    { id: '68be85c8094d08828defa5ce', name: 'Glastavla NOBO 45" Widescreen' },
    { id: '68be85c8094d08828defa5cf', name: 'Glastavla LEITZ Cosy 80x60cm' },
    { id: '68be85c8094d08828defa5d0', name: 'Glastavla NOBO 85" Widescreen' },
    { id: '68be85c8094d08828defa5d1', name: 'Glastavla NOBO 31" Widescreen' },
    { id: '68be85c8094d08828defa5d2', name: 'Glastavla NOBO 31" Widescreen' },
    { id: '68be85c8094d08828defa5d4', name: 'Glastavla NOBO 45" Widescreen' },
    { id: '68be85c8094d08828defa5d5', name: 'Konferensställ NOBO Tripod melamin' },
    { id: '68be85c8094d08828defa5d6', name: 'Konferensställ NOBO Imp Pro mobil m/arm' },
    { id: '68be85c8094d08828defa5d7', name: 'Glastavla LINTEX Mood 200x100cm Shy' },
    { id: '68be85c8094d08828defa5d8', name: 'Konferensställ NOBO Imp Pro 3 ben m/arm' },
    { id: '68be85c8094d08828defa5d9', name: 'Glastavla LINTEX Mood 125x100cm Pure' },
    { id: '68be85c8094d08828defa5da', name: 'Glastavla LINTEX Mood 125x100cm Lively' },
    { id: '68be85c8094d08828defa5db', name: 'Glastavla LINTEX Mood 200x100cm Soft' },
    { id: '68be85c8094d08828defa5df', name: 'Glastavla LINTEX Mood 150x100cm Lively' },
    { id: '68be85c8094d08828defa5e0', name: 'Glastavla LINTEX Mood 150x100cm Soft' },
    { id: '68be85c8094d08828defa5e1', name: 'Glastavla LINTEX Mood 125x100cm Shy' },
    { id: '68be85c8094d08828defa5e2', name: 'Glastavla LINTEX Mood 200x100cm Lively' },
    { id: '68be85c8094d08828defa5e3', name: 'Glastavla LINTEX Mood 200x100cm Pure' },
    { id: '68be85c8094d08828defa5e4', name: 'Glastavla LINTEX Mood 100x100cm Gentle' },
    { id: '68be85c8094d08828defa5e5', name: 'Glastavla LINTEX Mood 100x100cm Pure' },
    { id: '68be85c8094d08828defa5e6', name: 'Glastavla LINTEX Mood 150x100cm Gentle' },
    { id: '68be85c8094d08828defa5ee', name: 'Magvision Glas 295x210, Optisk vit' },
    { id: '68be85c8094d08828defa5ef', name: 'Magvision Glas 980x630 mm, Optisk vit' },
    { id: '68be85c8094d08828defa5f0', name: 'Magvision Glas 1180x1000 mm, Optisk vit' },
    { id: '68be85c8094d08828defa5f1', name: 'Magvision Glas 1980x1000 mm, Optisk vit' },
    { id: '68be85c8094d08828defa5f2', name: 'Magvision Glas 1480x1000 mm, Optisk vit' },
    { id: '68be85c8094d08828defa5f3', name: 'Glastavla LINTEX Mood 150x100cm Shy' },
    { id: '68be85c8094d08828defa5f4', name: 'Glastavla NOBO 57" vit rundade hörn' },
    { id: '68be85c8094d08828defa5f5', name: 'Glastavla NOBO 85" Widescreen' },
    { id: '68be85c8094d08828defa5fa', name: 'Glastavla LINTEX Mood 150x100cm Pure' },
    { id: '68be85c8094d08828defa5fb', name: 'board BI-OFFICE 22x28cm' },
    { id: '68be85c8094d08828defa5fc', name: 'board BI-OFFICE 22x28cm' },
    { id: '68be85c8094d08828defa5fd', name: 'Glastavla Magnetisk 150x120cm vit' },
    { id: '68be85c8094d08828defa5fe', name: 'Glastavla Magnetisk 90x60cm vit' },
    { id: '68be85c8094d08828defa5ff', name: 'Glastavla Magnetisk 120x90cm vit' },
    { id: '68be85c8094d08828defa600', name: 'Glastavla NOBO 57" Widescreen vit' },
    { id: '68be85c8094d08828defa601', name: 'Glastavla NOBO memotavla m pennfack' },
    { id: '68be85c8094d08828defa608', name: 'Glastavla NOBO memotavla 22x30cm' },
  ],

  // stickade-trojor (39 products)
  'stickade-trojor': [
    { id: '68be85b0094d08828def4f03', name: 'Liffin V-neck pullover' },
    { id: '68be85b0094d08828def4f05', name: 'Liffin V-neck pullover' },
    { id: '68be85b5094d08828def60b8', name: 'Liffin V-neck pullover' },
    { id: '68be85b5094d08828def60b9', name: 'Liffin V-neck pullover' },
    { id: '68be85b5094d08828def63b0', name: 'Merrit rundhalsad pullover dam' },
    { id: '68be85b5094d08828def63b1', name: 'Merrit pullover med rund hals för män' },
    { id: '68be85b5094d08828def63b2', name: 'Stanton v-ringad pullover dam' },
    { id: '68be85b5094d08828def63b4', name: 'SEVEN SEAS The knit | o-neck | dam' },
    { id: '68be85b5094d08828def63b6', name: 'SEVEN SEAS The cardigan' },
    { id: '68be85b5094d08828def63b7', name: 'SEVEN SEAS The cardigan | dam' },
    { id: '68be85b5094d08828def63b8', name: 'SEVEN SEAS The knit | v-neck' },
    { id: '68be85b5094d08828def63b9', name: 'SEVEN SEAS The knit | v-neck | dam' },
    { id: '68be85b6094d08828def64ba', name: 'V-ringad Finstickad Tröja Herr' },
    { id: '68be85b6094d08828def64c9', name: 'V-ringad Finstickad Tröja Dam' },
    { id: '68be85b6094d08828def6574', name: 'Lady Merino Wool V-Neck' },
    { id: '68be85b6094d08828def6582', name: 'Men"s chunky knit jumper' },
    { id: '68be85b6094d08828def6584', name: 'Women Supima® Cardigan' },
    { id: '68be85b6094d08828def65d9', name: 'Men"s Crew Neck Supima® Jumper' },
    { id: '68be85b6094d08828def65da', name: 'Ladie"s Crew Neck Supima® Jumper' },
    { id: '68be85b6094d08828def65db', name: 'Ladies" V-neck Merino Jumper' },
    { id: '68be85b6094d08828def65dc', name: 'Men Supima® Cardigan' },
    { id: '68be85b6094d08828def65dd', name: 'Men"s V-Neck Merino Jumper' },
    { id: '68be85b6094d08828def65e5', name: 'James Harvest - Portland Woman' },
    { id: '68be85b6094d08828def65e8', name: 'Liffin V-neck pullover' },
    { id: '68be85b6094d08828def65e9', name: 'Women"s cotton blend V-neck sweatshirt' },
    { id: '68be85b6094d08828def65ea', name: 'Men"s raw edge merino wool jumper' },
    { id: '68be85b6094d08828def65ec', name: 'Men"s V-Neck Jumper' },
    { id: '68be85d0094d08828defcdc5', name: 'Woburn midlayer pullover' },
    { id: '68be85d5094d08828defe4c9', name: 'James Harvest - Nottingmoon' },
    { id: '68be85d5094d08828defe4de', name: 'Stanton v-ringad pullover för män' },
    { id: '68be85e2094d08828df013d5', name: 'Merino Wool V-Neck' },
    { id: '68be85e2094d08828df01487', name: 'Lady Merino Wool V-Neck' },
    { id: '68be85e4094d08828df019f1', name: 'SEVEN SEAS The knit | o-neck | dam' },
    { id: '68be85e4094d08828df019fd', name: 'SEVEN SEAS The cardigan' },
    { id: '68be85e4094d08828df01a00', name: 'SEVEN SEAS The cardigan | dam' },
    { id: '68be85e4094d08828df01a0f', name: 'SEVEN SEAS The knit | v-neck' },
    { id: '68be85e4094d08828df01bd0', name: 'Men"s chunky knit jumper' },
    { id: '68be85e4094d08828df01be6', name: 'Ladies merino wool jumper' },
    { id: '68be85e5094d08828df01e00', name: 'Men"s raw edge merino wool jumper' },
  ],

  // bordsstall-och-panelsystem (39 products)
  'bordsstall-och-panelsystem': [
    { id: '68be85c3094d08828def91de', name: 'Panel SHERPA A4' },
    { id: '68be85c3094d08828def91df', name: 'Panel SHERPA med stift A4' },
    { id: '68be85c3094d08828def9319', name: 'Panel Actual A4 10/fp' },
    { id: '68be85c3094d08828def931a', name: 'Panel Actual A4 10/fp' },
    { id: '68be85c3094d08828def931b', name: 'Väggställ DJOIS 10 fick A4 sort.färg' },
    { id: '68be85c3094d08828def931e', name: 'Panel SHERPA A4' },
    { id: '68be85c3094d08828def931f', name: 'Panel SHERPA A4' },
    { id: '68be85c3094d08828def9320', name: 'Gaffelpärm PP med ficka A4 60mm' },
    { id: '68be85c3094d08828def9321', name: 'Ringpärm A4 D-ring: 45mm PP ficka' },
    { id: '68be85c3094d08828def9322', name: 'Panel SHERPA A4' },
    { id: '68be85c3094d08828def9323', name: 'Bordsställ DJOIS ink 10 fickor svart' },
    { id: '68be85c3094d08828def9324', name: 'Väggställ DJOIS magnetisk A4 10 panel' },
    { id: '68be85c3094d08828def9325', name: 'Panel SHERPA A4' },
    { id: '68be85c3094d08828def9326', name: 'Panel SHERPA med stift A4' },
    { id: '68be85c3094d08828def9327', name: 'Väggställ magnet DJOIS A4 10 panel' },
    { id: '68be85c3094d08828def9328', name: 'Bordsställ VARIO A4 med 10 rama' },
    { id: '68be85c3094d08828def9329', name: 'Panel DURABLE Sherpa A4 sort. färger' },
    { id: '68be85c3094d08828def932a', name: 'Utbyggnadsmodul SHERPA inkl 10 paneler' },
    { id: '68be85c3094d08828def932b', name: 'Panel DJOIS A4 blå 10/fp' },
    { id: '68be85c3094d08828def932c', name: 'Bordsställ VARIO A4 med 10 rama' },
    { id: '68be85c3094d08828def932d', name: 'Panel SHERPA A4 grafitgrå' },
    { id: '68be85c3094d08828def932f', name: 'Bordsställ VARIO A4 med 30 ramar' },
    { id: '68be85c3094d08828def9330', name: 'Bordsställ ACTUAL A4 10 ramar sort.färg' },
    { id: '68be85c3094d08828def9331', name: 'Bordsställ VARIO A5 med 10 ramar svart' },
    { id: '68be85c3094d08828def9332', name: 'Bordsställ SHERPA 5632 med 10 ramar' },
    { id: '68be85c3094d08828def9333', name: 'Väggställ VARIO Magnet kompl med 5 panel' },
    { id: '68be85c3094d08828def9334', name: 'Bordsställ FUNCTION A4 10 panel' },
    { id: '68be85c3094d08828def9335', name: 'Bordstativ SHERPA 5818 A4 med 10 ramar' },
    { id: '68be85c3094d08828def9336', name: 'Väggställ DJOIS A4 för 10 ramar' },
    { id: '68be85c3094d08828def9337', name: 'Panel DJOIS A4 sort. färger 10/fp' },
    { id: '68be85c3094d08828def9338', name: 'Bords/Väggställ A4 Vario med 10 ramar' },
    { id: '68be85c3094d08828def9339', name: 'Väggställ FUNCTION A4 plats för 10 panel' },
    { id: '68be85c3094d08828def933a', name: 'Väggställ VARIO A4 med 10 ramar' },
    { id: '68be85c3094d08828def933b', name: 'Flipover A4 EXACOMPTA svart' },
    { id: '68be85c3094d08828def933c', name: 'Väggställ SHERPA Style' },
    { id: '68be85c3094d08828def933d', name: 'Bordsställ SHERPA Style' },
    { id: '68be85c3094d08828def933e', name: 'Bordsställ SHERPA Soho med 5 ramar svart' },
    { id: '68be85c3094d08828def933f', name: 'Bordsställ VARIO A4 med 20 ramar' },
    { id: '68be85c3094d08828def9340', name: 'Bordsställ VARIO A4 10 ramar sort.fär' },
  ],

  // headphones (38 products)
  'headphones': [
    { id: '68be85af094d08828def4eeb', name: 'Chadwik Earbuds' },
    { id: '68be85af094d08828def4eee', name: 'Pascal Earbuds' },
    { id: '68be85b2094d08828def5640', name: 'Braavos 2 True Wireless öronsnäckor med automatisk parkoppling' },
    { id: '68be85b2094d08828def5641', name: 'Liberty trådlösa öronsnäckor i laddningsfodral' },
    { id: '68be85b2094d08828def5644', name: 'Prixton TWS157 öronsnäckor' },
    { id: '68be85b2094d08828def5645', name: 'Prixton TWS158 ENC- och ANC-öronsnäckor' },
    { id: '68be85b2094d08828def5646', name: 'Prixton TWS159  ENC- och ANC-öronsnäckor' },
    { id: '68be85b2094d08828def5647', name: 'Prixton TWS155 Bluetooth®-öronsnäckor' },
    { id: '68be85b2094d08828def56ea', name: 'TAT1209 | Philips TWS In-Earbuds' },
    { id: '68be85b2094d08828def56eb', name: 'TWS Earbuds bamboo' },
    { id: '68be85b2094d08828def5703', name: '3TW1600 | Fresh "n Rebel True Wireless sportöronsnäckor' },
    { id: '68be85b2094d08828def5709', name: 'Pascal Earbuds' },
    { id: '68be85b2094d08828def574c', name: '3TW2200 I Fresh "n Rebel Twins Blaze - True Wireless earbuds with ENC' },
    { id: '68be85c9094d08828defa724', name: 'NUvision smarta solglasögon' },
    { id: '68be85c9094d08828defa726', name: 'NUvision smarta solglasögon' },
    { id: '68be85c9094d08828defa72b', name: 'Grundig TWS Earphones 230 mAh' },
    { id: '68be85c9094d08828defa72c', name: 'Grundig TWS Earbuds 200 mAh' },
    { id: '68be85c9094d08828defa7ce', name: 'Olaf RCS TWS Wireless Earbuds öronsnäckor' },
    { id: '68be85c9094d08828defa7d0', name: 'Sensi TWS Trådlösa Öronsnäckor i laddningsetui' },
    { id: '68be85c9094d08828defa7fb', name: 'Prixton TWS160S sport Bluetooth® 5.0 earbuds' },
    { id: '68be85c9094d08828defa7fc', name: 'TWS gaming öronsnäckor med ENC' },
    { id: '68be85c9094d08828defa7fe', name: 'RGB gaming headset' },
    { id: '68be85cf094d08828defc7ab', name: 'Orebam - TWS-headset i bambufodral' },
    { id: '68be85d3094d08828defd969', name: 'Nacka - In-ear' },
    { id: '68be85d4094d08828defdc82', name: 'Jays t-Seven Black' },
    { id: '68be85d4094d08828defdc84', name: 'Blaupunkt Metal BT Headset' },
    { id: '68be85d4094d08828defe004', name: 'Gnista - In-ear' },
    { id: '68be85de094d08828df00a5d', name: 'Liberty trådlösa öronsnäckor i laddningsfodral' },
    { id: '68be85e3094d08828df01707', name: 'Earbuds in ear från Swayers' },
    { id: '68be85e5094d08828df01f73', name: 'TAT1209 | Philips TWS In-Earbuds' },
    { id: '68be85e5094d08828df01f78', name: 'TWS Earbuds bamboo' },
    { id: '68be85e6094d08828df020bd', name: 'T00258 | Jays T-Five bluetooth öronsnäckor' },
    { id: '68be85e6094d08828df021c5', name: '3TW3200 I Fresh "n Rebel Twins Ace-TWS earbuds with Hybrid ANC' },
    { id: '68be85e6094d08828df02249', name: '3TW3200 I Fresh "n Rebel Twins Ace-TWS earbuds with Hybrid ANC' },
    { id: '68be85e8094d08828df027ba', name: '3TW1600 | Fresh "n Rebel True Wireless sportöronsnäckor' },
    { id: '68be85e9094d08828df029cd', name: 'Braavos 2 True Wireless öronsnäckor med automatisk parkoppling' },
    { id: '68be85e9094d08828df02d82', name: 'Essos 2.0 True Wireless automatiskt parkopplande öronsnäckor med fodral' },
    { id: '68be85eb094d08828df02fa2', name: '3TW2200 I Fresh "n Rebel Twins Blaze - True Wireless earbuds with ENC' },
  ],

  // gloves (37 products)
  'gloves': [
    { id: '68be85ad094d08828def4880', name: 'Handnit - Stickade handskar i RPET' },
    { id: '68be85ae094d08828def49ce', name: 'TouchScreen Smart Gloves' },
    { id: '68be85ae094d08828def49cf', name: 'Recycled Fleece Gloves' },
    { id: '68be85ae094d08828def49d1', name: 'Fingerless Gloves' },
    { id: '68be85ae094d08828def49d2', name: 'Cosy Ribbed Cuff Gloves' },
    { id: '68be85ae094d08828def49d3', name: 'Colour Pop Hand Warmers' },
    { id: '68be85ae094d08828def49df', name: 'Pashen set med mössa och handskar' },
    { id: '68be85af094d08828def4ebc', name: 'Retouch RPET-handskar för pekskärm' },
    { id: '68be85b1094d08828def54bb', name: 'Pekskärmhandskar i rPET Nira' },
    { id: '68be85b2094d08828def57a9', name: 'Takai - Rpet handskar mobiltouch' },
    { id: '68be85b2094d08828def57ab', name: 'Vantar' },
    { id: '68be85b2094d08828def57ac', name: 'Recycled Fleece Gloves' },
    { id: '68be85b2094d08828def57ad', name: 'Fingerless Gloves' },
    { id: '68be85b2094d08828def57b7', name: 'Colour Pop Hand Warmers' },
    { id: '68be85b2094d08828def57b8', name: 'Handskar' },
    { id: '68be85b2094d08828def57bb', name: 'Essence Hybrid Glove' },
    { id: '68be85b2094d08828def57bc', name: 'Explore Padded Glove' },
    { id: '68be85b2094d08828def57bd', name: 'Essence Wool Light Glove' },
    { id: '68be85b2094d08828def57be', name: 'Pekskärmhandskar i rPET Nira' },
    { id: '68be85b2094d08828def57bf', name: 'Horgol handskar' },
    { id: '68be85b2094d08828def57c0', name: 'Retouch RPET-handskar för pekskärm' },
    { id: '68be85b4094d08828def6069', name: 'TouchScreen Smart Gloves' },
    { id: '68be85d4094d08828defe14b', name: 'Glovii uppvärmda universella handskar XS. Grå' },
    { id: '68be85d4094d08828defe14c', name: 'Glovii uppvärmda motorcykelhandskar L. Svart' },
    { id: '68be85d4094d08828defe14d', name: 'Glovii uppvärmda universella handskar XS. Röd' },
    { id: '68be85d4094d08828defe14f', name: 'Glovii uppvärmda universella handskar M. Grå' },
    { id: '68be85d4094d08828defe150', name: 'Glovii uppvärmd handske XL. Svart' },
    { id: '68be85d4094d08828defe157', name: 'Glovii uppvärmda universella handskar M. Svart' },
    { id: '68be85d4094d08828defe15b', name: 'Glovii uppvärmda arbetshandskar XL. Svart' },
    { id: '68be85d4094d08828defe15e', name: 'Glovii batteri för uppvärmda handskar och mössa' },
    { id: '68be85d6094d08828defe6c1', name: 'Essence Multi Grip Glove' },
    { id: '68be85d6094d08828defe6c2', name: 'Essence Glove' },
    { id: '68be85e3094d08828df01774', name: 'Recycled Fleece Gloves' },
    { id: '68be85e4094d08828df01879', name: 'Touch Gloves' },
    { id: '68be85e5094d08828df01f42', name: 'Vantar' },
    { id: '68be85e6094d08828df02052', name: 'Handskar' },
    { id: '68be85e7094d08828df02583', name: 'Horgol handskar' },
  ],

  // underdelar-barnklader (37 products)
  'underdelar-barnklader': [
    { id: '68be85ae094d08828def499c', name: 'THC SPRINT KIDS. Träningsbyxor för barn' },
    { id: '68be85af094d08828def4e5c', name: 'Jr Mellion stretch trousers' },
    { id: '68be85af094d08828def4e63', name: 'Jr Links  rain trousers' },
    { id: '68be85af094d08828def4e64', name: 'Jr Mellion stretch shorts' },
    { id: '68be85af094d08828def4e65', name: 'Jr Cleek stretch trousers' },
    { id: '68be85af094d08828def4e66', name: 'Jr Mellion stretch skort' },
    { id: '68be85b2094d08828def57d1', name: 'Juve sportset för barn' },
    { id: '68be85b2094d08828def5806', name: 'New Astun byxor för barn' },
    { id: '68be85b2094d08828def5807', name: 'Adelpho byxor för barn' },
    { id: '68be85b2094d08828def5808', name: 'Neapolis byxor för barn' },
    { id: '68be85b2094d08828def580d', name: 'Baby Rompasuit' },
    { id: '68be85b2094d08828def5810', name: 'Basic Active Pants Junior' },
    { id: '68be85b2094d08828def5811', name: 'Kid"s TriDri® performance leggings' },
    { id: '68be85b2094d08828def5812', name: 'Baby Leggings' },
    { id: '68be85b2094d08828def5813', name: 'Kids Cuffed Jogpants' },
    { id: '68be85b2094d08828def5814', name: 'Evolve 2.0 Pants Jr' },
    { id: '68be85b2094d08828def5815', name: 'Rush 2.0 Training Pants Jr' },
    { id: '68be85b2094d08828def5816', name: 'Rush 2.0 Tights Jr' },
    { id: '68be85b2094d08828def5818', name: 'Jr Mellion stretch skort' },
    { id: '68be85b2094d08828def58af', name: 'Baby Rompasuit' },
    { id: '68be85b4094d08828def5fa1', name: 'Jr Mellion stretch trousers' },
    { id: '68be85b5094d08828def60d7', name: 'Evolve 2.0 Pants Jr' },
    { id: '68be85b5094d08828def61a9', name: 'Rush 2.0 Tights Jr' },
    { id: '68be85ba094d08828def714c', name: 'Jr Links  rain trousers' },
    { id: '68be85ba094d08828def714e', name: 'Jr Cleek stretch trousers' },
    { id: '68be85ba094d08828def714f', name: 'Jr Mellion stretch shorts' },
    { id: '68be85d1094d08828defd014', name: 'THC SPRINT KIDS WH. Träningsbyxor för barn' },
    { id: '68be85d6094d08828defe6bc', name: 'Rush 2.0 Training Fz Pants Jr' },
    { id: '68be85d6094d08828defe6bd', name: 'Hängselbyxor Baby Denim' },
    { id: '68be85e3094d08828df01759', name: 'Baby Rompasuit' },
    { id: '68be85e4094d08828df018c8', name: 'Baby Leggings' },
    { id: '68be85e4094d08828df01b91', name: 'Juve sportset för barn' },
    { id: '68be85e4094d08828df01b9d', name: 'Player sportshorts för barn' },
    { id: '68be85e5094d08828df01c20', name: 'New Astun byxor för barn' },
    { id: '68be85e5094d08828df01c2d', name: 'Adelpho byxor för barn' },
    { id: '68be85e5094d08828df01c34', name: 'Neapolis byxor för barn' },
    { id: '68be85e5094d08828df01c35', name: 'Argos byxor för barn' },
  ],

  // broschyr-och-tidningssstall (36 products)
  'broschyr-och-tidningssstall': [
    { id: '68be85c3094d08828def921a', name: 'Tidskriftssamlare CEP RIVIERA vit 5/fp' },
    { id: '68be85c3094d08828def921b', name: 'Tidskriftssamlare FELLOWES kartong 10/fp' },
    { id: '68be85c3094d08828def921c', name: 'Tidskriftssamlare EXACOMPTA A4 70mm' },
    { id: '68be85c3094d08828def9224', name: 'Tidskriftssamlare ClicknStore A4' },
    { id: '68be85c3094d08828def9225', name: 'Hylla ALBA 5 hyllplan 200x120x35cm krom' },
    { id: '68be85c3094d08828def9226', name: 'Tidskriftssaml Skandi A4 sort.f. 4/fp' },
    { id: '68be85c3094d08828def9227', name: 'Tidskriftssamlare EXACOMPTA A4 70mm' },
    { id: '68be85c3094d08828def9229', name: 'Tidskriftssamlare ClicknStore A4' },
    { id: '68be85c3094d08828def922a', name: 'Tidskriftssamlare ARCHIVO 2000 A4' },
    { id: '68be85c3094d08828def9233', name: 'Brevkorg ARCHIVO 2000 A4' },
    { id: '68be85c3094d08828def9234', name: 'Tidskriftssamlare ARCHIVO 2000 A4' },
    { id: '68be85c3094d08828def9235', name: 'Tidskriftssamlar BeeBlue A4 sort.f. 4/fp' },
    { id: '68be85c3094d08828def9236', name: 'Broschyrställ A4 vägg' },
    { id: '68be85c3094d08828def9237', name: 'Tidskriftssamlare ARCHIVO 2000 A4' },
    { id: '68be85c3094d08828def9238', name: 'Tidskriftssamlare ARCHIVO 2000 A4' },
    { id: '68be85c3094d08828def9239', name: 'Tidskriftssamlare ARCHIVO 2000 A4 transp' },
    { id: '68be85c3094d08828def9240', name: 'Broschyrställ EXACOMPTA A5 1-fack' },
    { id: '68be85c3094d08828def9241', name: 'Torkställ på hjul' },
    { id: '68be85c3094d08828def9242', name: 'Broschyrställ A4 stående 15-fack svart' },
    { id: '68be85c3094d08828def9243', name: 'Broschyrställ EXACOMPTA A4 3-fack' },
    { id: '68be85c3094d08828def9244', name: 'Tidskriftssamlare EXACOMPTA A4 70mm' },
    { id: '68be85c3094d08828def9245', name: 'Broschyrställ A4 stående 11-fack svart' },
    { id: '68be85c3094d08828def9246', name: 'Tidskriftssamlare CEP Ellypse klar' },
    { id: '68be85c3094d08828def9247', name: 'Tidskriftssamlare Collecta A4' },
    { id: '68be85c3094d08828def9249', name: 'Broschyrställ A5 stående 13-fack silver' },
    { id: '68be85c3094d08828def924a', name: 'Tidskriftssamlare ELBA A4' },
    { id: '68be85c3094d08828def924b', name: 'Broschyrställ vägg 3 fack A4 Krom' },
    { id: '68be85c3094d08828def924c', name: 'Tidskriftssaml. kart m läder A4 grå 2/fp' },
    { id: '68be85c3094d08828def924d', name: 'Tidskriftssamlare Collecta A4' },
    { id: '68be85c3094d08828def924e', name: 'Tidskriftssamlare Collecta A4' },
    { id: '68be85c3094d08828def924f', name: 'Tidskriftssamlare BIGSO kartong A4' },
    { id: '68be85c3094d08828def9250', name: 'Tidskriftssamlare ELBA A4' },
    { id: '68be85c3094d08828def9251', name: 'Broschyrställ CEPExpo' },
    { id: '68be85c3094d08828def9252', name: 'Tidskriftssaml.kart m läder A4 mint 2/fp' },
    { id: '68be85c3094d08828def9255', name: 'Tidskriftssaml. kart m läder A4 lin' },
    { id: '68be85c3094d08828def9256', name: 'Tidskriftssaml. kart m läder A4 ros 2/fp' },
  ],

  // multi-tools (35 products)
  'multi-tools': [
    { id: '68be85c0094d08828def8731', name: 'Victorinox Huntsman fickkniv' },
    { id: '68be85c0094d08828def8733', name: 'Victorinox Classic SD fickkniv' },
    { id: '68be85c1094d08828def8808', name: 'MaxiStar gåvoset' },
    { id: '68be85c1094d08828def8809', name: 'OPTIMA nödkniv multi' },
    { id: '68be85c1094d08828def8878', name: 'Optima Maxi Set' },
    { id: '68be85c1094d08828def887a', name: 'OPTIMA multikniv med karbinhake' },
    { id: '68be85c1094d08828def887d', name: 'Dozen' },
    { id: '68be85c1094d08828def88e1', name: 'Baikal fickkniv' },
    { id: '68be85ca094d08828defaae9', name: 'ABS måttband Jeff' },
    { id: '68be85cd094d08828defb503', name: 'Cobby multifunktionell ficklampa' },
    { id: '68be85cd094d08828defb7cf', name: 'Nipox fickkniv' },
    { id: '68be85cd094d08828defb7d7', name: 'Bamboo Blade Fickkniv' },
    { id: '68be85cd094d08828defb812', name: 'Beechwood Fickkniv' },
    { id: '68be85cd094d08828defb842', name: 'Ricardo by Richartz Fällkniv' },
    { id: '68be85d0094d08828defc930', name: 'Cinta - Multifunktionellt måttband' },
    { id: '68be85d0094d08828defcaf4', name: 'Kniv Schwarzwolf BAKO, Multifunktionell' },
    { id: '68be85d0094d08828defcd8f', name: 'Fickkniv i bambu Phoebe' },
    { id: '68be85d1094d08828defce11', name: 'Knifeplus - Brytkniv' },
    { id: '68be85d2094d08828defd1f2', name: 'Xander bestick fickkniv' },
    { id: '68be85d2094d08828defd22c', name: 'Victorinox fickkniv' },
    { id: '68be85d2094d08828defd365', name: 'Kniv Schwarzwolf Jaguar' },
    { id: '68be85d2094d08828defd42b', name: 'Fällkniv Schwarzwolf Ray' },
    { id: '68be85d2094d08828defd44b', name: 'Fällkniv Schwarzwolf Styx' },
    { id: '68be85d2094d08828defd5af', name: 'Fuegor - Tändstål' },
    { id: '68be85d2094d08828defd68e', name: 'Monson - Fällkniv' },
    { id: '68be85d4094d08828defdccf', name: 'Kil - Servitörskniv' },
    { id: '68be85d4094d08828defdd51', name: 'Mcgregor - Multifunktionell fickkniv' },
    { id: '68be85d4094d08828defde5b', name: 'Lucy Lux - Fickkniv i bambu' },
    { id: '68be85d4094d08828defe03f', name: 'Hiddins multifunktionell fickkniv' },
    { id: '68be85d4094d08828defe0bc', name: 'Gear X multifunktionell kniv' },
    { id: '68be85de094d08828df0070c', name: 'Victorinox Spartan fickkniv' },
    { id: '68be85de094d08828df0070d', name: 'Victorinox Huntsman fickkniv' },
    { id: '68be85de094d08828df0070e', name: 'Victorinox Swisscard Classic' },
    { id: '68be85de094d08828df0070f', name: 'Victorinox Classic SD fickkniv' },
    { id: '68be85e8094d08828df026d7', name: 'Dozen' },
  ],

  // shorts (34 products)
  'shorts': [
    { id: '68be85b2094d08828def580c', name: 'Cool Shorts Barn' },
    { id: '68be85b3094d08828def5946', name: 'WP19 - Skirt Agnes' },
    { id: '68be85b3094d08828def5947', name: 'FS33 - Stretch Shorts' },
    { id: '68be85b3094d08828def5955', name: 'Wiggo Shorts' },
    { id: '68be85b3094d08828def5956', name: 'Wega Shorts w' },
    { id: '68be85b3094d08828def5957', name: 'Cora Shorts w' },
    { id: '68be85b3094d08828def5958', name: 'Carter Shorts' },
    { id: '68be85b3094d08828def5981', name: 'Wega Shorts w' },
    { id: '68be85b3094d08828def5982', name: 'Texstar Duty Stretch Shorts' },
    { id: '68be85b3094d08828def5983', name: 'Herrshorts Classic Fit' },
    { id: '68be85b3094d08828def5984', name: 'Women"s chino shorts' },
    { id: '68be85b3094d08828def5986', name: 'Cool Shorts' },
    { id: '68be85b3094d08828def5989', name: 'Campus Shorts by AWDis' },
    { id: '68be85b4094d08828def5e7b', name: 'Cool Shorts Barn' },
    { id: '68be85b4094d08828def5e7d', name: 'Women"s retro shorts' },
    { id: '68be85b4094d08828def5e7f', name: 'Bad Shorts Herr' },
    { id: '68be85b4094d08828def6048', name: 'Bad Shorts Herr' },
    { id: '68be85b4094d08828def604d', name: 'Cool Shorts' },
    { id: '68be85b4094d08828def6057', name: 'Women"s retro shorts' },
    { id: '68be85d5094d08828defe544', name: 'Joggingshorts Dam' },
    { id: '68be85d5094d08828defe546', name: 'Tränings Shorts Herr' },
    { id: '68be85d6094d08828defe575', name: 'Women"s Cool Training Shorts' },
    { id: '68be85de094d08828df00956', name: 'WP19 - Skirt Agnes' },
    { id: '68be85de094d08828df00957', name: 'Texstar Duty Stretch Shorts' },
    { id: '68be85de094d08828df00958', name: 'FS33 - Stretch Shorts' },
    { id: '68be85e2094d08828df01292', name: 'Neutral - Tiger Cotton Sweatshorts' },
    { id: '68be85e2094d08828df01297', name: 'Neutral - Unisex Performance Shorts' },
    { id: '68be85e2094d08828df01352', name: 'WP19 - Skirt Agnes' },
    { id: '68be85e4094d08828df018e2', name: 'Wiggo Shorts' },
    { id: '68be85e4094d08828df018e3', name: 'Wega Shorts w' },
    { id: '68be85e4094d08828df018e4', name: 'Cora Shorts w' },
    { id: '68be85e4094d08828df018e5', name: 'Carter Shorts' },
    { id: '68be85e7094d08828df0247e', name: 'Neutral - Tiger Cotton Sweatshorts' },
    { id: '68be85e7094d08828df02480', name: 'Neutral - Unisex Performance Shorts' },
  ],

  // tidskriftssamlare (33 products)
  'tidskriftssamlare': [
    { id: '68be85c4094d08828def95c6', name: 'Tidskriftssamlare CEP 4/FP' },
    { id: '68be85c4094d08828def95c7', name: 'Tidskriftssamlare LYRECO blå' },
    { id: '68be85c4094d08828def95c9', name: 'Tidskriftssamlare DURABLE ECO A4' },
    { id: '68be85c4094d08828def95ca', name: 'Tidskriftssamlare DURABLE ECO A4' },
    { id: '68be85c4094d08828def95cb', name: 'Tidskriftssamlare DURABLE ECO A4' },
    { id: '68be85c4094d08828def95cc', name: 'Tidskriftssamlare HAN A4' },
    { id: '68be85c4094d08828def95cd', name: 'Tidskriftssamlare LYRECO A4 klar' },
    { id: '68be85c4094d08828def95ce', name: 'Tidskriftssamlare LYRECO A4 svart' },
    { id: '68be85c4094d08828def95cf', name: 'Tidskriftssamlare HAN A4' },
    { id: '68be85c4094d08828def95d1', name: 'Tidskriftssamlare DJOIS A4 Eco svart' },
    { id: '68be85c4094d08828def95d2', name: 'Tidskriftssamlare HAN A4 recycle' },
    { id: '68be85c4094d08828def95d3', name: 'Tidskriftssamlare HAN A4' },
    { id: '68be85c4094d08828def95d4', name: 'Tidskriftssamlare Collecta A4' },
    { id: '68be85c4094d08828def95d5', name: 'Tidskriftssamlare HAN A4' },
    { id: '68be85c4094d08828def95d6', name: 'Tidskriftssamlare HAN A4 recycle' },
    { id: '68be85c4094d08828def95d7', name: 'Tidskriftssamlare LEITZ Plus A4' },
    { id: '68be85c4094d08828def95d8', name: 'Tidskriftssamlare HAN A4' },
    { id: '68be85c4094d08828def95d9', name: 'Tidskriftssamlare ClicknStore A4' },
    { id: '68be85c4094d08828def95da', name: 'Tidskriftssamlare LEITZ Plus A4' },
    { id: '68be85c4094d08828def95db', name: 'Tidskriftssamlare ekonomi A4' },
    { id: '68be85c4094d08828def95dc', name: 'Tidskriftssamlare ClicknStore A4' },
    { id: '68be85c4094d08828def95dd', name: 'Tidskriftssamlare HAN A4 recycle' },
    { id: '68be85c4094d08828def95de', name: 'Tidskriftssamlare ekonomi A4' },
    { id: '68be85c4094d08828def95df', name: 'Tidskriftssamlare Trend A4 transparent' },
    { id: '68be85c4094d08828def95e0', name: 'Tidskriftssamlare nät A4' },
    { id: '68be85c4094d08828def95e1', name: 'Tidskriftssamlare EXACOMPTA A4 70mm sva' },
    { id: '68be85c4094d08828def95e2', name: 'Tidskriftssamlare BIGSO kartong A4' },
    { id: '68be85c4094d08828def95e3', name: 'Tidskriftssamlare nät A4' },
    { id: '68be85c4094d08828def95e4', name: 'Tidskriftssamlare EXACOMPT recy A4 svart' },
    { id: '68be85c4094d08828def95e5', name: 'Tidskriftssamlare kart m läder A4 svart' },
    { id: '68be85c4094d08828def95e6', name: 'Tidskriftssamlare ELBA A5 svart' },
    { id: '68be85c4094d08828def95e7', name: 'Tidskriftssamlare LEITZ Plus A4 klar' },
    { id: '68be85c4094d08828def95e8', name: 'Tidskriftssamlare A4 kartong vit' },
  ],

  // skalar (32 products)
  'skalar': [
    { id: '68be85af094d08828def4c5f', name: 'Michelangelo Bowl' },
    { id: '68be85af094d08828def4c61', name: 'Okeeffe Bowl' },
    { id: '68be85b1094d08828def53a9', name: 'Amuse Tylla Bowl 1 L' },
    { id: '68be85b1094d08828def53aa', name: 'CirculBowl with Lid 1200 ml' },
    { id: '68be85b1094d08828def53ab', name: 'CirculBowl with Lid 800 ml' },
    { id: '68be85b1094d08828def53ad', name: 'Colorit skål Ø 14 cm' },
    { id: '68be85b1094d08828def53ae', name: 'Emma skål Ø 13.5 cm 2 Stk' },
    { id: '68be85b1094d08828def53d1', name: 'Brabantia Make & Take Yoghurtkopp' },
    { id: '68be85b1094d08828def53d9', name: 'Michelangelo Bowl' },
    { id: '68be85b1094d08828def53da', name: 'Okeeffe Bowl' },
    { id: '68be85b1094d08828def53ff', name: 'Ljungby Glas | 4 Skålar & sötsaker' },
    { id: '68be85b1094d08828def54a1', name: 'Brabantia Make & Take Yoghurtkopp' },
    { id: '68be85ca094d08828defa9c9', name: 'Glasskål "Fresh Lunch"' },
    { id: '68be85ca094d08828defa9ca', name: 'Orrefors Legend city ränder skål 110mm' },
    { id: '68be85ca094d08828defaa21', name: 'Wooosh Pincho Serveringsbräda' },
    { id: '68be85ca094d08828defaa71', name: 'Tapas Trio Valencia' },
    { id: '68be85ca094d08828defaa97', name: 'Salladsskål "Eat Healthy"' },
    { id: '68be85ca094d08828defaa98', name: 'Picknick Juni skål, 4-pack (6) Vit' },
    { id: '68be85d0094d08828defcb2f', name: 'The Giftpack Esporão & Bordallo' },
    { id: '68be85d0094d08828defcdc2', name: 'SAGE. Rund salladsskål med akaciaträ' },
    { id: '68be85d1094d08828defce3d', name: 'Mixskål M 3,5 L -cream' },
    { id: '68be85d1094d08828defce44', name: 'Mixskål M 3,5 L - Röd' },
    { id: '68be85d3094d08828defdb08', name: 'PEPPER. Kvadratisk salladsskål i bambu' },
    { id: '68be85de094d08828df00a42', name: 'Kähler | Bonbonniere' },
    { id: '68be85df094d08828df00b16', name: 'Kähler | Bonbonniere' },
    { id: '68be85df094d08828df00b19', name: 'Ljungby Glas | 3 Skålar & sötsaker' },
    { id: '68be85df094d08828df00b1a', name: 'Ljungby Glas | 2 Skålar & sötsaker' },
    { id: '68be85e0094d08828df00cec', name: 'Ljungby Glas | 4 Skålar & sötsaker' },
    { id: '68be85e0094d08828df00ced', name: 'Ljungby Glas | 3 Skålar & sötsaker' },
    { id: '68be85e0094d08828df00cef', name: 'Ljungby Glas | 2 Skålar & sötsaker' },
    { id: '68be85e4094d08828df01864', name: 'Emma skål Ø 13.5 cm 2 Stk' },
    { id: '68be85e9094d08828df02ba0', name: 'Colorit skål Ø 14 cm' },
  ],

  // ovrigt-halsa (32 products)
  'ovrigt-halsa': [
    { id: '68be85af094d08828def4e33', name: 'SuboBag Shoe Skopåse med tryck' },
    { id: '68be85bd094d08828def7ae2', name: 'Solskyddsfaktor 30 10ml' },
    { id: '68be85bd094d08828def7ae5', name: 'ROBERTS. Tablettlåda med 4 avdelare' },
    { id: '68be85be094d08828def7c29', name: 'Toothie tandborstset' },
    { id: '68be85cb094d08828defad87', name: 'Massagepistol av ABS Axel' },
    { id: '68be85cc094d08828defb0d8', name: 'Nödfilt/Värmefilt' },
    { id: '68be85cd094d08828defba61', name: 'Times' },
    { id: '68be85ce094d08828defc2c8', name: 'Putsduk 245 g' },
    { id: '68be85ce094d08828defc2c9', name: 'Putsduk 170 g' },
    { id: '68be85ce094d08828defc431', name: 'Turtle Care Militär (250 ml)' },
    { id: '68be85ce094d08828defc54e', name: 'Turtle Care Marin (250 ml)' },
    { id: '68be85cf094d08828defc670', name: 'Turtle Care Camping (250 ml)' },
    { id: '68be85cf094d08828defc67b', name: 'Turtle Care Piercing (250 ml)' },
    { id: '68be85d1094d08828defce02', name: 'Baby - 6-delars babyvårdset' },
    { id: '68be85d3094d08828defd7d5', name: 'Massagekudde' },
    { id: '68be85d3094d08828defd7d7', name: 'Fotbad Foldable' },
    { id: '68be85d3094d08828defd9ae', name: 'Assa - Handhållen massagespindel i trä' },
    { id: '68be85d4094d08828defdc64', name: 'NERO. Tablettlåda med 2 avdelare' },
    { id: '68be85d4094d08828defdd2d', name: 'BACTOUT. UV-steriliseringsfodral trådlös laddare Snabb 10W' },
    { id: '68be85d4094d08828defdf5d', name: 'Sukha Massagebollar av kork' },
    { id: '68be85d4094d08828defe0f0', name: 'GazeGuard glasögon mot blått ljus' },
    { id: '68be85d5094d08828defe1a5', name: 'Vandringsstavar' },
    { id: '68be85d5094d08828defe1a8', name: 'Skräpplockare' },
    { id: '68be85d5094d08828defe1a9', name: 'Läsglasögon Anemone' },
    { id: '68be85d5094d08828defe1aa', name: 'MASSAGE PISTOL FRÅN STRANDBY' },
    { id: '68be85d5094d08828defe1ab', name: 'Läsglasögon Anemone' },
    { id: '68be85d5094d08828defe1c2', name: 'Läsglasögon Anemone' },
    { id: '68be85d5094d08828defe1c4', name: 'Prixton MGF80 Synergy massagepistol' },
    { id: '68be85d5094d08828defe1c5', name: 'Prixton MGF100 massagepistol' },
    { id: '68be85df094d08828df00bc4', name: 'SuboBag Shoe Skopåse med tryck' },
    { id: '68be85e2094d08828df01498', name: 'Solskyddsfaktor 30 10ml' },
    { id: '68be85e8094d08828df026de', name: 'Toothie tandborstset' },
  ],

  // funktions-t-shirt (32 products)
  'funktions-t-shirt': [
    { id: '68be85b2094d08828def5841', name: 'Junior Cool Dry' },
    { id: '68be85b4094d08828def5fce', name: 'Cool T' },
    { id: '68be85b4094d08828def5fcf', name: 'Contrast Cool T' },
    { id: '68be85b4094d08828def5fd2', name: 'Long Sleeve Cool T' },
    { id: '68be85b4094d08828def5fd3', name: 'Active-T, herr' },
    { id: '68be85b4094d08828def5fd4', name: 'Active-T, dam' },
    { id: '68be85b4094d08828def5fd5', name: 'Ladies Cool Dry T-Shirt' },
    { id: '68be85b4094d08828def5fd8', name: 'Sports T-shirt, dam' },
    { id: '68be85b4094d08828def6077', name: 'Active-T, herr' },
    { id: '68be85b4094d08828def607c', name: 'Active-T, dam' },
    { id: '68be85b4094d08828def6083', name: 'Junior Cool Dry' },
    { id: '68be85b5094d08828def6108', name: 'Original Superlight Cool-T' },
    { id: '68be85b5094d08828def6113', name: 'Sports T-shirt, dam' },
    { id: '68be85b7094d08828def66ed', name: 'Long Sleeve Cool T' },
    { id: '68be85b7094d08828def6740', name: 'Cool T' },
    { id: '68be85b7094d08828def6741', name: 'Contrast Cool T' },
    { id: '68be85b7094d08828def6742', name: 'Long Sleeve Cool T' },
    { id: '68be85b7094d08828def6743', name: 'Active-T, herr' },
    { id: '68be85b7094d08828def6744', name: 'Active-T, dam' },
    { id: '68be85b7094d08828def6745', name: 'Sports T-shirt, dam' },
    { id: '68be85b7094d08828def6766', name: 'Active-T, dam' },
    { id: '68be85b7094d08828def6778', name: 'Cool T' },
    { id: '68be85b7094d08828def6823', name: 'Ladies Cool Dry T-Shirt' },
    { id: '68be85b7094d08828def6826', name: 'Sports T-shirt, dam' },
    { id: '68be85b7094d08828def6827', name: 'Lady Superlight Cool-T' },
    { id: '68be85b7094d08828def682a', name: 'Active-T, herr' },
    { id: '68be85b7094d08828def6833', name: 'Original Cool Dry T-Shirt' },
    { id: '68be85e2094d08828df013bd', name: 'Original Cool Dry T-Shirt' },
    { id: '68be85e2094d08828df01481', name: 'Junior Cool Dry' },
    { id: '68be85e2094d08828df01482', name: 'Ladies Cool Dry T-Shirt' },
    { id: '68be85e2094d08828df01484', name: 'Original Superlight Cool-T' },
    { id: '68be85e2094d08828df01489', name: 'Lady Superlight Cool-T' },
  ],

  // traningslinnen (32 products)
  'traningslinnen': [
    { id: '68be85b2094d08828def5864', name: 'Kids Cool Vest' },
    { id: '68be85b3094d08828def58ec', name: 'Funktionslinne Cool Herr' },
    { id: '68be85b3094d08828def58ed', name: 'Funktionslinne Cool Dam' },
    { id: '68be85b3094d08828def58ef', name: 'Women"s TriDri® performance strap back vest' },
    { id: '68be85b3094d08828def58f0', name: 'Women"s Cool Smooth Workout Vest' },
    { id: '68be85b3094d08828def58f2', name: 'Ladies  TriDri ® Yoga Knot Vest' },
    { id: '68be85b3094d08828def58f3', name: 'Women"s TriDri® Double Strap Back Ves' },
    { id: '68be85b3094d08828def58f5', name: 'Women"s TriDri® panelled fitness vest' },
    { id: '68be85b3094d08828def58f6', name: 'Women"s TriDri® "Lazer cut" Vest' },
    { id: '68be85b3094d08828def58f7', name: 'Craft Linne Rush Junior' },
    { id: '68be85b3094d08828def58f8', name: 'Funktionslinne Performance Herr' },
    { id: '68be85b3094d08828def58f9', name: 'Women"s TriDri® "Lazer cut" Spaghetti Strap Vest' },
    { id: '68be85b3094d08828def58fa', name: 'Funktionslinne Performance Dam' },
    { id: '68be85b4094d08828def5fbf', name: 'Funktionslinne Cool Herr' },
    { id: '68be85b4094d08828def5fc0', name: 'Funktionslinne Cool Dam' },
    { id: '68be85b4094d08828def5fc1', name: 'Kids Cool Vest' },
    { id: '68be85b4094d08828def5fc2', name: 'Women"s TriDri® performance strap back vest' },
    { id: '68be85b4094d08828def5fc3', name: 'Women"s Cool Smooth Workout Vest' },
    { id: '68be85b4094d08828def5fc4', name: 'Women"s TriDri® Double Strap Back Ves' },
    { id: '68be85b4094d08828def5fc5', name: 'Women"s TriDri® "Lazer cut" Vest' },
    { id: '68be85b4094d08828def5fc6', name: 'Funktionslinne Performance Herr' },
    { id: '68be85b4094d08828def5fc7', name: 'Women"s TriDri® "Lazer cut" Spaghetti Strap Vest' },
    { id: '68be85b4094d08828def5fc8', name: 'Funktionslinne Performance Dam' },
    { id: '68be85b4094d08828def6072', name: 'Funktionslinne Cool Herr' },
    { id: '68be85b4094d08828def6084', name: 'Women"s TriDri® performance strap back vest' },
    { id: '68be85b5094d08828def6110', name: 'Women"s TriDri® Double Strap Back Ves' },
    { id: '68be85b5094d08828def6116', name: 'Women"s TriDri® panelled fitness vest' },
    { id: '68be85b5094d08828def6122', name: 'Women"s TriDri® "Lazer cut" Vest' },
    { id: '68be85b6094d08828def64dd', name: 'Funktionslinne Performance Herr' },
    { id: '68be85d3094d08828defd89e', name: 'Craft Linne Rush Herr' },
    { id: '68be85d6094d08828defe5c3', name: 'Funktionslinne Cool Contrast Dam' },
    { id: '68be85d6094d08828defe5c4', name: 'Ladies  TriDri ® Yoga Vest' },
  ],

  // ringparmar (32 products)
  'ringparmar': [
    { id: '68be85c5094d08828def9803', name: 'Ringpärm A4 ring: 16mm PP ficka' },
    { id: '68be85c5094d08828def9804', name: 'Ringpärm LYRECO A4 PP 2ring(EU) 25mm vit' },
    { id: '68be85c5094d08828def980c', name: 'Ringpärm A4 D-ring: 45mm PP ficka' },
    { id: '68be85c5094d08828def980e', name: 'Ringpärm A4 ring: 29mm PP ficka' },
    { id: '68be85c5094d08828def980f', name: 'Ringpärm ELBA A3 40mm liggande' },
    { id: '68be85c5094d08828def9810', name: 'Ringpärm A4 ring: 29mm PP ficka' },
    { id: '68be85c5094d08828def9811', name: 'Ringpärm A4 29mm konstläderpapp' },
    { id: '68be85c5094d08828def9812', name: 'Ringpärm A4 ring: 16mm PP ficka' },
    { id: '68be85c5094d08828def981d', name: 'Ringpärm A4 29mm konstläderpapp' },
    { id: '68be85c5094d08828def981e', name: 'Ringpärm A4 ring: 16mm PP ficka' },
    { id: '68be85c5094d08828def981f', name: 'Ringpärm A4 ring: 29m PP ficka svart' },
    { id: '68be85c5094d08828def9820', name: 'Gaffelpärm KEBAergo A4 80mm Svart/Svart' },
    { id: '68be85c5094d08828def9821', name: 'Ringpärm A4 29mm konstläderpapp' },
    { id: '68be85c5094d08828def9824', name: 'Gaffelpärm KEBAergo LA3 55mm svart/svart' },
    { id: '68be85c5094d08828def9825', name: 'Ringpärm A4 29mm konstläderpapp' },
    { id: '68be85c5094d08828def9826', name: 'Ringpärm A4 16mm böjbar plast' },
    { id: '68be85c5094d08828def9827', name: 'Ringpärm A4 23mm papp' },
    { id: '68be85c5094d08828def9828', name: 'Gaffelpärm KEBAergo LA3 40mm svart/svart' },
    { id: '68be85c5094d08828def9829', name: 'Ringpärm A4 16mm böjbar plast' },
    { id: '68be85c5094d08828def982a', name: 'Gaffelpärm KEBAergo A4+ folieficka svart' },
    { id: '68be85c5094d08828def982d', name: 'Ringpärm A4 23mm papp' },
    { id: '68be85c5094d08828def982e', name: 'Ringpärm-D KEBA grafitgrå' },
    { id: '68be85c5094d08828def982f', name: 'Ringpärm A4 35/20mm 4 D-ring EU vit' },
    { id: '68be85c5094d08828def9830', name: 'Ringpärm A4 ring: 29mm PP ficka' },
    { id: '68be85c5094d08828def9831', name: 'Ringpärm A4 Style 16mm svart' },
    { id: '68be85c5094d08828def9832', name: 'Ringpärm A4 19mm plast transparent' },
    { id: '68be85c5094d08828def9834', name: 'Ringpärm A3L 16mm PP transparent' },
    { id: '68be85c5094d08828def9835', name: 'Ringpärm A4 16mm böjbar plast transp.' },
    { id: '68be85c5094d08828def9836', name: 'Ringpärm A4 med ficka 16mm PP transp.' },
    { id: '68be85c5094d08828def9837', name: 'Ringpärm A5 ficka rygg och framsida vit' },
    { id: '68be85c5094d08828def9838', name: 'Ringpärm A4 29mm konstläderpapp natur' },
    { id: '68be85c5094d08828def9839', name: 'Ringpärm A4 57mm PP ficka vit' },
  ],

  // kartongknivar (31 products)
  'kartongknivar': [
    { id: '68be85b0094d08828def4ff0', name: 'Mugg i rostfritt stål med dubbla väggar (300 ml) Renate' },
    { id: '68be85c0094d08828def86fb', name: 'Highcut - Kartongkniv' },
    { id: '68be85c0094d08828def86fd', name: 'Labana - Brytbladskniv' },
    { id: '68be85c0094d08828def86fe', name: 'Thike - Brytbladskniv' },
    { id: '68be85c0094d08828def8700', name: 'Brytbladskniv Khia' },
    { id: '68be85c0094d08828def8701', name: 'Brytkniv Fjäder' },
    { id: '68be85c0094d08828def8702', name: 'Jumbo hobbykniv' },
    { id: '68be85c0094d08828def8703', name: 'Kena - Brytbladskniv' },
    { id: '68be85c0094d08828def8704', name: 'PAYTON. Precisionskniv med låsmekanism' },
    { id: '68be85c0094d08828def8705', name: 'Mugg i rostfritt stål med dubbla väggar (300 ml) Renate' },
    { id: '68be85c0094d08828def8788', name: 'Bianco' },
    { id: '68be85c0094d08828def8789', name: 'RapiCut papperskniv' },
    { id: '68be85cb094d08828defafae', name: 'Metallkniv Jeffrey' },
    { id: '68be85cd094d08828defb825', name: 'Avsnäppningsblad i Aluminium' },
    { id: '68be85cd094d08828defb857', name: 'Fickkniv Mini' },
    { id: '68be85cd094d08828defb858', name: 'Brytkniv XXL' },
    { id: '68be85cd094d08828defb859', name: 'Linear brytkniv' },
    { id: '68be85d0094d08828defc9ab', name: 'Boocut skärare' },
    { id: '68be85d1094d08828defd1bc', name: 'Hobbykniv, Elia' },
    { id: '68be85d2094d08828defd4af', name: 'Tracta - Bladkniv i aluminium' },
    { id: '68be85d3094d08828defda90', name: 'Nuga - Brytbladskniv' },
    { id: '68be85d4094d08828defdc02', name: 'Paddy - Brytbladskniv' },
    { id: '68be85d4094d08828defdc9a', name: 'Bowie - Brytkniv' },
    { id: '68be85d4094d08828defddec', name: 'Moheda - Brytbladskniv' },
    { id: '68be85e2094d08828df01609', name: 'Brytkniv Fjäder' },
    { id: '68be85e6094d08828df022d3', name: 'Loktox papperskniv' },
    { id: '68be85e6094d08828df022ee', name: 'Bianco' },
    { id: '68be85e7094d08828df02417', name: 'RapiCut papperskniv' },
    { id: '68be85e9094d08828df02a7a', name: 'Thike - Brytbladskniv' },
    { id: '68be85e9094d08828df02b10', name: 'Highcut - Kartongkniv' },
    { id: '68be85e9094d08828df02bb7', name: 'Kena - Brytbladskniv' },
  ],

  // spa (31 products)
  'spa': [
    { id: '68be85ca094d08828defac33', name: 'Wellmark 250 ml body wash' },
    { id: '68be85ca094d08828defac35', name: 'Wellmark Soft Hands 250 ml handkräm med pump' },
    { id: '68be85cb094d08828defaeb9', name: 'Badset i bomull Jean' },
    { id: '68be85cd094d08828defba45', name: 'Foaming Shower Gel' },
    { id: '68be85cd094d08828defba46', name: 'Foaming Shower Gel' },
    { id: '68be85cd094d08828defba47', name: 'Foaming Shower Gel' },
    { id: '68be85cd094d08828defba48', name: 'Hand Wash' },
    { id: '68be85cd094d08828defba49', name: 'Refill - Hand Wash' },
    { id: '68be85cd094d08828defba4c', name: 'Hand Wash' },
    { id: '68be85cd094d08828defba66', name: 'Hand Wash' },
    { id: '68be85cd094d08828defba67', name: 'Refill - Hand & Body Lotion' },
    { id: '68be85cd094d08828defba69', name: 'Hand Wash' },
    { id: '68be85cc094d08828defba6a', name: 'Refill - Hand & Body Lotion' },
    { id: '68be85cc094d08828defba6b', name: 'Refill - Hand Wash' },
    { id: '68be85cc094d08828defba6d', name: 'Refill - Hand & Body Lotion' },
    { id: '68be85cc094d08828defba72', name: 'Hand Wash' },
    { id: '68be85cc094d08828defba74', name: 'Hand Wash' },
    { id: '68be85cc094d08828defba75', name: 'Hand Wash' },
    { id: '68be85cc094d08828defba76', name: 'Foaming Shower Gel' },
    { id: '68be85cc094d08828defba77', name: 'Refill - Hand Wash' },
    { id: '68be85cc094d08828defba78', name: 'Foaming Shower Gel' },
    { id: '68be85cc094d08828defba79', name: 'Foaming Shower Gel' },
    { id: '68be85cd094d08828defbfb2', name: 'CreaFelt Slip specialtillverkade RPET-tofflor' },
    { id: '68be85d2094d08828defd40a', name: 'Leonard bambukam' },
    { id: '68be85d2094d08828defd551', name: 'ENOS. Bambukam' },
    { id: '68be85d2094d08828defd77e', name: 'CONROY. SPA-kit' },
    { id: '68be85d2094d08828defd7a5', name: 'Strokes sminkborstset' },
    { id: '68be85d3094d08828defd7c0', name: 'Carita kam' },
    { id: '68be85d4094d08828defdf46', name: 'Harmoni badtillbehörsset med 3 delar' },
    { id: '68be85d5094d08828defe1bb', name: 'Wellmark Just Relax 500 ml badsalt  rosdoft' },
    { id: '68be85d5094d08828defe1bc', name: 'Wellmark Just Relax 3-delad presentförpackning med badsalt, 200 ml' },
  ],

  // fitness-trackers (30 products)
  'fitness-trackers': [
    { id: '68be85ae094d08828def496c', name: 'Irto - Smart trådlös hälsoklocka' },
    { id: '68be85ae094d08828def496f', name: 'Arta - Smart trådlös hälsoklocka' },
    { id: '68be85be094d08828def7c7b', name: 'Arta - Smart trådlös hälsoklocka' },
    { id: '68be85be094d08828def7c7c', name: 'SBS armband för Apple Watch®. 42/44/45 mm. Silver' },
    { id: '68be85be094d08828def7c7d', name: 'SBS armband för Apple Watch®. 38/40/41 mm. Mörkgrå' },
    { id: '68be85be094d08828def7c7e', name: 'Träningsarmband' },
    { id: '68be85be094d08828def7c7f', name: 'PURO sportarmband för Apple Watch 38/40/41 mm' },
    { id: '68be85be094d08828def7c80', name: 'PURO sportarmband för Apple Watch 42/44/45/49 mm' },
    { id: '68be85be094d08828def7c81', name: 'PURO MILANESE Ersättningsarmband för Apple Watch' },
    { id: '68be85be094d08828def7c83', name: 'Neura smart klocka' },
    { id: '68be85cd094d08828defba3a', name: 'Sinox Lifestyle SQUARE Smartwatch. Svart' },
    { id: '68be85cd094d08828defba3b', name: 'Sinox Lifestyle XTRM S smartwatch. Svart' },
    { id: '68be85cd094d08828defba3c', name: 'Sinox Lifestyle SPORT smartwatch. Svart' },
    { id: '68be85cd094d08828defba3d', name: 'Sinox Lifestyle XTRM smartwatch. Svart' },
    { id: '68be85cd094d08828defba40', name: 'Prixton Alexa SWB29 smartklocka' },
    { id: '68be85cd094d08828defba41', name: 'Prixton SWB26T smartklocka' },
    { id: '68be85cd094d08828defba42', name: 'Prixton AT410 smartband' },
    { id: '68be85cd094d08828defbfb5', name: 'Outback smart klocka' },
    { id: '68be85ce094d08828defc42e', name: 'Smartwatch av PET Xavier' },
    { id: '68be85ce094d08828defc550', name: 'Smartwatch av PC Asher' },
    { id: '68be85d0094d08828defc9a1', name: 'Cortland smart klocka' },
    { id: '68be85d4094d08828defdcb1', name: 'IMPERA II. Smart klocka med silikonband' },
    { id: '68be85d4094d08828defddd0', name: 'Armphone + - 6,5"" Mobilficka för arm' },
    { id: '68be85e4094d08828df01aa6', name: 'SBS armband för Apple Watch®. 42/44/45 mm. Silver' },
    { id: '68be85e4094d08828df01b2a', name: 'SBS armband för Apple Watch®. 38/40/41 mm. Mörkgrå' },
    { id: '68be85e5094d08828df01d2e', name: 'PURO sportarmband för Apple Watch 38/40/41 mm' },
    { id: '68be85e5094d08828df01d2f', name: 'PURO sportarmband för Apple Watch 42/44/45/49 mm' },
    { id: '68be85e5094d08828df01d33', name: 'PURO MILANESE Ersättningsarmband för Apple Watch' },
    { id: '68be85e5094d08828df01d34', name: 'PURO MILANESE Ersättningsarmband för Apple Watch' },
    { id: '68be85ea094d08828df02e7c', name: 'Neura smart klocka' },
  ],

  // fleecetrojor (30 products)
  'fleecetrojor': [
    { id: '68be85af094d08828def4d96', name: 'Sunningdale halfzip' },
    { id: '68be85af094d08828def4d97', name: 'Sunningdale fullzip' },
    { id: '68be85af094d08828def4d99', name: 'Dunbar halfzip fleece' },
    { id: '68be85af094d08828def4e6d', name: 'Cradoc halfzip fleece' },
    { id: '68be85af094d08828def4ef5', name: 'Cradoc halfzip fleece' },
    { id: '68be85b4094d08828def5eff', name: 'Sunningdale halfzip' },
    { id: '68be85b4094d08828def5fb5', name: 'Cradoc halfzip fleece' },
    { id: '68be85b5094d08828def60af', name: 'Cradoc halfzip fleece' },
    { id: '68be85b5094d08828def63bf', name: 'Bellagio unisex fleeceväst' },
    { id: '68be85b5094d08828def63cb', name: 'Trace Powerfleece w' },
    { id: '68be85b5094d08828def63cc', name: 'Trevon Powerfleece' },
    { id: '68be85b5094d08828def63cd', name: '7832 Knitted Jacket' },
    { id: '68be85b5094d08828def63ce', name: 'Ondra Fleece' },
    { id: '68be85b5094d08828def63d2', name: 'THC VIENNA. Unisex fleece' },
    { id: '68be85b5094d08828def63d8', name: 'Sunningdale halfzip' },
    { id: '68be85b5094d08828def63d9', name: 'Sunningdale fullzip' },
    { id: '68be85b6094d08828def64cb', name: 'Printer RED - Frontflip Lady' },
    { id: '68be85b6094d08828def64cc', name: 'Himalaya Full Zip Pocket  Fleece Men' },
    { id: '68be85b6094d08828def64cd', name: 'Himalaya Full Zip Pocket Fleece Women' },
    { id: '68be85b6094d08828def64ce', name: 'Cradoc halfzip fleece' },
    { id: '68be85b6094d08828def64cf', name: 'Join Pile Fleece Fz Hood W' },
    { id: '68be85b6094d08828def64d0', name: 'Join Pile Fleece Hz M' },
    { id: '68be85b6094d08828def64d1', name: 'Join Pile Fleece Hz W' },
    { id: '68be85b6094d08828def64d2', name: 'Therma fleecejacka' },
    { id: '68be85ba094d08828def70ea', name: 'Dunbar halfzip fleece' },
    { id: '68be85d5094d08828defe4dd', name: '7731 Fleece' },
    { id: '68be85e2094d08828df01515', name: 'Himalaya Full Zip Pocket  Fleece Men' },
    { id: '68be85e2094d08828df01519', name: 'Himalaya Full Zip Pocket Fleece Women' },
    { id: '68be85e4094d08828df01acf', name: 'Bellagio unisex fleeceväst' },
    { id: '68be85e6094d08828df021fa', name: 'Therma fleecejacka' },
  ],

  // informationsstall (30 products)
  'informationsstall': [
    { id: '68be85c3094d08828def8fbb', name: 'Instick DURABLE 75x40mm 240/fp' },
    { id: '68be85c3094d08828def8fbe', name: 'Bordsskylt papper 220x70mm 50/fp' },
    { id: '68be85c3094d08828def8fc1', name: 'Akrylficka till Vendor HL Display A5' },
    { id: '68be85c3094d08828def8fc2', name: 'Blankettfack LYRECO 3-fack ljugrå' },
    { id: '68be85c3094d08828def8fc4', name: 'Blankettfack CEP Silva A4 5-fack vit' },
    { id: '68be85c3094d08828def8fc5', name: 'Blankettfack CEP 6-fack grå' },
    { id: '68be85c3094d08828def8fc6', name: 'Golvskylt DURABLE info sign stand A4' },
    { id: '68be85c3094d08828def8fc7', name: 'Blankettbox Idealbox Plus 7-fack grå' },
    { id: '68be85c3094d08828def8fc8', name: 'Blankettfack 3 fack' },
    { id: '68be85c3094d08828def8fc9', name: 'Golvskylt DURABLE info stand basic A4' },
    { id: '68be85c3094d08828def8fca', name: 'Broschyrställ 1/3 A4' },
    { id: '68be85c3094d08828def8fcb', name: 'Bordsskylt DURABLE 105x297mm 25/fp' },
    { id: '68be85c3094d08828def9288', name: 'Broschyrställ EXACOMPTA 6 fack transp' },
    { id: '68be85c3094d08828def928b', name: 'Hållare bordsskylt transp 40x150mm' },
    { id: '68be85c3094d08828def928c', name: 'Broschyrställ EXACOMPTA A5 3-fack' },
    { id: '68be85c3094d08828def928d', name: 'Broschyrställ DEFLECTO vägg 4fack A5' },
    { id: '68be85c3094d08828def928f', name: 'Glasskåp NOBO extra tunt magnetisk 4xA4' },
    { id: '68be85c3094d08828def9291', name: 'Frontplast 50x70cm, 0,5mm' },
    { id: '68be85c3094d08828def9294', name: 'Skylthållare vägg A4 stående' },
    { id: '68be85c3094d08828def9296', name: 'Blackboardtavla 50x70cm' },
    { id: '68be85c3094d08828def929b', name: 'Frontplast 70x100cm' },
    { id: '68be85c3094d08828def929d', name: 'Broschyrställ EXACOMPTA 1/3 A4 1-fack' },
    { id: '68be85c3094d08828def929f', name: 'Bordsskylt DURABLE 61x210mm vit 100/fp' },
    { id: '68be85c3094d08828def92a1', name: 'T-hållare till Akrylficka A5' },
    { id: '68be85c3094d08828def92a2', name: 'Bordsskylt DURABLE 150x61mm 25/fp' },
    { id: '68be85c3094d08828def92a4', name: 'Skylthållare rund fot, transp. 10/fp' },
    { id: '68be85c3094d08828def92a6', name: 'Instick DURABLE 90x54mm 200/fp' },
    { id: '68be85c3094d08828def92a7', name: 'Bordsskylt DURABLE 210x61mm 25/fp' },
    { id: '68be85c3094d08828def92a8', name: 'Blankettfack 5-fack transparent' },
    { id: '68be85c3094d08828def92a9', name: 'Blankettfack FlexiPlus A4S 2 fack svart' },
  ],

  // demoparmar-och-demobocker (30 products)
  'demoparmar-och-demobocker': [
    { id: '68be85c4094d08828def9642', name: 'Demobok EXACOMPTA rec 20 ficko' },
    { id: '68be85c4094d08828def9643', name: 'Demobok EXACOMPTA rec 50 ficko' },
    { id: '68be85c4094d08828def9644', name: 'Demobok EXACOMPTA rec 40 ficko' },
    { id: '68be85c4094d08828def9645', name: 'Demobok EXACOMPTA rec 40 ficko' },
    { id: '68be85c4094d08828def9646', name: 'Demobok EXACOMPTA rec 30 ficko' },
    { id: '68be85c4094d08828def9647', name: 'Demobok EXACOMPTA rec 50 ficko' },
    { id: '68be85c4094d08828def9648', name: 'Demobok EXACOMPTA rec 30 ficko' },
    { id: '68be85c4094d08828def9649', name: 'Demobok EXACOMPTA rec 20 ficko' },
    { id: '68be85c4094d08828def964a', name: 'Demobok EXACOMPTA TEKSTO A4 40 f so FP/4' },
    { id: '68be85c4094d08828def964b', name: 'Demobok EXACOMPTA 80 fickor sort.f. 5/fp' },
    { id: '68be85c4094d08828def964c', name: 'Demobok fickor EXACOMPTA A4 10/fp' },
    { id: '68be85c4094d08828def964d', name: 'Demobok EXACOMPTA Bee 40fickor s.f. 4/fp' },
    { id: '68be85c4094d08828def964e', name: 'Demobok EXACOMPTA 40 fickor sort.f. 5/fp' },
    { id: '68be85c4094d08828def964f', name: 'Demobok LEITZ WOW PP 20 ficko' },
    { id: '68be85c4094d08828def9650', name: 'Demobok EXACOMPTA 40 ficko' },
    { id: '68be85c4094d08828def9651', name: 'Demobok EXACOMPTA 30 fick sort.färg 5/fp' },
    { id: '68be85c4094d08828def9652', name: 'Demobok EXACOMPTA 20 ficko' },
    { id: '68be85c4094d08828def9653', name: 'Demobok EXACOMPTA 40 ficko' },
    { id: '68be85c4094d08828def9654', name: 'Demobok EXACOMPTA 20 ficko' },
    { id: '68be85c4094d08828def9655', name: 'Demobok LEITZ WOW PP 20 ficko' },
    { id: '68be85c4094d08828def9656', name: 'Demobok LEITZ WOW PP 40 fickor grön' },
    { id: '68be85c4094d08828def9657', name: 'Demobok EXACOMPTA 60 fickor svart' },
    { id: '68be85c4094d08828def9658', name: 'Demobok LEITZ Style PP 20F titanblå' },
    { id: '68be85c4094d08828def9659', name: 'Demobok EXACOMPTA A4 blå 20 fickor' },
    { id: '68be85c4094d08828def965a', name: 'Demobok LEITZ Style PP 20F polarvit' },
    { id: '68be85c4094d08828def965b', name: 'Demobok EXACOMPTA 80 fickor svart' },
    { id: '68be85c4094d08828def965c', name: 'Demobok LEITZ Style PP 20F celadongrön' },
    { id: '68be85c4094d08828def965d', name: 'Demobok EXACOMPTA A4 20 fickor transp' },
    { id: '68be85c4094d08828def965e', name: 'Demobok LEITZ Style PP 20F sidensvart' },
    { id: '68be85c4094d08828def965f', name: 'Demobok LEITZ recycle PP 20 fickor svart' },
  ],

  // vaggramar (29 products)
  'vaggramar': [
    { id: '68be85c6094d08828defa019', name: 'Väggram aluminiumprofil 70x100cm vit' },
    { id: '68be85c6094d08828defa01a', name: 'Väggram A3 aluminiumprofil 32mm' },
    { id: '68be85c6094d08828defa01b', name: 'Väggram A3 aluminiumprofil 32mm' },
    { id: '68be85c6094d08828defa01c', name: 'Väggram A3 guld 25mm' },
    { id: '68be85c6094d08828defa01d', name: 'Väggram A4 15mm' },
    { id: '68be85c6094d08828defa01e', name: 'Väggram A4 25mm guld' },
    { id: '68be85c6094d08828defa01f', name: 'Väggram A4 15mm' },
    { id: '68be85c6094d08828defa020', name: 'Väggram A4 aluminiumprofil 32 mm' },
    { id: '68be85c6094d08828defa021', name: 'Väggram 50x70cm alu.profil 32mm svart' },
    { id: '68be85c6094d08828defa022', name: 'Väggram aluminiumprofil 50x70cm' },
    { id: '68be85c6094d08828defa023', name: 'Väggram 50x70cm silver polerad 25mm' },
    { id: '68be85c6094d08828defa024', name: 'Väggram A3 aluminiumprofil 25mm svart' },
    { id: '68be85c6094d08828defa025', name: 'Väggram A4 aluminiumprofil 32 mm' },
    { id: '68be85c6094d08828defa026', name: 'Väggram aluminiumprofil 70x100cm' },
    { id: '68be85c6094d08828defa027', name: 'Väggram 70x100cm alu.profil 45mm svart' },
    { id: '68be85c6094d08828defa028', name: 'Väggram A4 aluminiumprofil 25mm svart' },
    { id: '68be85c6094d08828defa029', name: 'Affischram 841x1189 mm A0' },
    { id: '68be85c6094d08828defa02b', name: 'Väggram A3 aluminiumprofil 32mm' },
    { id: '68be85c6094d08828defa02c', name: 'Affischram 594x841 mm A1' },
    { id: '68be85c6094d08828defa02d', name: 'Ram A4 aluminium/plexiglas' },
    { id: '68be85c6094d08828defa02e', name: 'Affischram 420x594 mm A2' },
    { id: '68be85c6094d08828defa032', name: 'Väggram A5 svart 15mm' },
    { id: '68be85c6094d08828defa033', name: 'Ram A4 aluminium/plexiglas' },
    { id: '68be85c6094d08828defa035', name: 'Affischram NOBO reflexfri A3' },
    { id: '68be85c6094d08828defa036', name: 'Affischram NOBO reflexfri A4' },
    { id: '68be85c6094d08828defa037', name: 'Ram 21x29,7cm guld' },
    { id: '68be85c6094d08828defa038', name: 'Ram 21x29,7cm svart' },
    { id: '68be85c6094d08828defa039', name: 'Väggram A4 aluminiumprofil 25mm' },
    { id: '68be85c6094d08828defa03a', name: 'Väggram A3 aluminiumprofil 25mm' },
  ],

  // kollegieblock (28 products)
  'kollegieblock': [
    { id: '68be85c3094d08828def907e', name: 'Kollegieblock SOL A4 70g 70 blad olinj.' },
    { id: '68be85c3094d08828def907f', name: 'Kollegieblock SOL A5 70g 70bl linjerat' },
    { id: '68be85c3094d08828def9080', name: 'Kollegieblock SOL A5 70g 70 bl rutat' },
    { id: '68be85c3094d08828def9081', name: 'Kollegieblock SOL A4 70g 70 blad linj.' },
    { id: '68be85c3094d08828def9082', name: 'Kollegieblock SOL A4 70g 70 blad rutat' },
    { id: '68be85c3094d08828def9083', name: 'Kollegieblock Oxford Int.A4+ rut' },
    { id: '68be85c3094d08828def9084', name: 'Kollegieblock Oxford Int.A4+ rut. ljblå' },
    { id: '68be85c3094d08828def9085', name: 'Kollegieblock Oxford oce A4 linj. svart' },
    { id: '68be85c3094d08828def9086', name: 'Kollegieblock Oxford oce A5 rut. Svart' },
    { id: '68be85c3094d08828def9087', name: 'Kollegieblock Oxford Int.A4+ linj' },
    { id: '68be85c3094d08828def9088', name: 'Kollegieblock Oxford Int.A4+ linj' },
    { id: '68be85c3094d08828def9089', name: 'Kollegieblock Oxford Int.A4+ rut' },
    { id: '68be85c3094d08828def908a', name: 'Kollegieblock Oxford oce A4 rut. svart' },
    { id: '68be85c3094d08828def908b', name: 'Kollegieblock Oxford Int.A4+ linj. ljblå' },
    { id: '68be85c3094d08828def908c', name: 'Kollegieblock Oxford Int.A4+ rut' },
    { id: '68be85c3094d08828def908d', name: 'Kollegieblock Oxford oce A5 linj. svart' },
    { id: '68be85c3094d08828def908e', name: 'Kollegieblock Oxford Touareg A4 rutat' },
    { id: '68be85c3094d08828def908f', name: 'Kollegieblock Oxford Int.A4+ linj' },
    { id: '68be85c3094d08828def9090', name: 'Kollegieblock OXFORD Touareg A5 linjerat' },
    { id: '68be85c3094d08828def9091', name: 'Kollegieblock Oxford Touareg A4 linjerat' },
    { id: '68be85c3094d08828def9092', name: 'Kollegieblock Oxford Int.A4+ linj' },
    { id: '68be85c3094d08828def9093', name: 'Kollegieblock Oxford Int.A4+ rut' },
    { id: '68be85c3094d08828def9094', name: 'Kollegieblock Oxford Touareg A5 rutat' },
    { id: '68be85c3094d08828def9095', name: 'Kollegieblock FW A5 60g 70bl linj' },
    { id: '68be85c3094d08828def9096', name: 'Kollegieblock A4 60g 70bl rut TF' },
    { id: '68be85c3094d08828def9097', name: 'Kollegieblock A4 90g 70bl rut TF' },
    { id: '68be85c3094d08828def9098', name: 'Kollegieblock A4 90g 70bl linj TF' },
    { id: '68be85c3094d08828def9099', name: 'Kollegieblock A4 90g 70bl olinj TF' },
  ],

  // kokshanddukar (27 products)
  'kokshanddukar': [
    { id: '68be85b1094d08828def5400', name: 'Alora kökshandduk av 200 g/m² återvunnen bomull' },
    { id: '68be85b1094d08828def5404', name: 'Kökshandduk Solid Återvunnen' },
    { id: '68be85b1094d08828def5405', name: 'Kökshanddukar 2-pack' },
    { id: '68be85b1094d08828def5406', name: 'Kökshandduk Hagaberg Återvunnen' },
    { id: '68be85b1094d08828def5407', name: 'Ella hamam 50x70cm, 2-pack (8)' },
    { id: '68be85b1094d08828def5408', name: 'Kökshandduk 50x70 cm' },
    { id: '68be85b1094d08828def5409', name: 'Kökshandduk 2-pack' },
    { id: '68be85b1094d08828def540a', name: 'Kökshandduk' },
    { id: '68be85b1094d08828def540b', name: 'Kökshandduk Enkel' },
    { id: '68be85ca094d08828defa9c3', name: 'Christmastree Kökshandduk' },
    { id: '68be85ca094d08828defa9c5', name: 'Edith kökshandduk, 2-pack' },
    { id: '68be85ca094d08828defa9c6', name: 'Kökshanddukar 2-pack' },
    { id: '68be85ca094d08828defa9c8', name: 'VINGA Cromer våfflad kökshandduk, 2 st' },
    { id: '68be85cd094d08828defbe30', name: 'Dishie kökshandduk med sublimering' },
    { id: '68be85e2094d08828df01582', name: 'Kökshandduk 50x70 cm' },
    { id: '68be85e2094d08828df01584', name: 'Kökshandduk 30x50 cm' },
    { id: '68be85e2094d08828df015f0', name: 'Kökshandduk Solid Återvunnen' },
    { id: '68be85e2094d08828df015f1', name: 'Kökshandduk Rutig Återvunnen' },
    { id: '68be85e3094d08828df0166a', name: 'Kökshandduk Rand Återvunnen' },
    { id: '68be85e3094d08828df01766', name: 'Kökshanddukar 2-pack' },
    { id: '68be85e3094d08828df01773', name: 'Organic Cotton Tea Towel' },
    { id: '68be85e4094d08828df019ec', name: 'Kökshandduk Hagaberg Återvunnen' },
    { id: '68be85e4094d08828df01b75', name: 'Filippa Kökshandduk' },
    { id: '68be85e5094d08828df01efa', name: 'Kökshanddukar 2-pack' },
    { id: '68be85e9094d08828df02aa6', name: 'Kökshandduk 2-pack' },
    { id: '68be85e9094d08828df02aa7', name: 'Kökshandduk Enkel' },
    { id: '68be85eb094d08828df030d0', name: 'Alora kökshandduk av 200 g/m² återvunnen bomull' },
  ],

  // ficknasdukar (27 products)
  'ficknasdukar': [
    { id: '68be85b3094d08828def591b', name: 'Ficknäsduk' },
    { id: '68be85b3094d08828def591c', name: 'Ficknäsduk' },
    { id: '68be85b3094d08828def591d', name: 'Ficknäsduk' },
    { id: '68be85b3094d08828def591e', name: 'Ficknäsduk' },
    { id: '68be85b3094d08828def591f', name: 'Ficknäsduk' },
    { id: '68be85b3094d08828def5920', name: 'Ficknäsduk' },
    { id: '68be85b3094d08828def5921', name: 'Ficknäsduk' },
    { id: '68be85b3094d08828def5922', name: 'Ficknäsduk' },
    { id: '68be85b3094d08828def5923', name: 'Ficknäsduk' },
    { id: '68be85b3094d08828def5924', name: 'Ficknäsduk' },
    { id: '68be85b3094d08828def5925', name: 'Ficknäsduk' },
    { id: '68be85b3094d08828def5926', name: 'Ficknäsduk' },
    { id: '68be85d6094d08828defe597', name: 'Näsdukar 10-pack med eget tryck' },
    { id: '68be85e5094d08828df01e61', name: 'Ficknäsduk' },
    { id: '68be85e5094d08828df01e66', name: 'Ficknäsduk' },
    { id: '68be85e5094d08828df01e68', name: 'Ficknäsduk' },
    { id: '68be85e5094d08828df01e6d', name: 'Ficknäsduk' },
    { id: '68be85e5094d08828df01e71', name: 'Ficknäsduk' },
    { id: '68be85e5094d08828df01e79', name: 'Ficknäsduk' },
    { id: '68be85e5094d08828df01e7b', name: 'Ficknäsduk' },
    { id: '68be85e5094d08828df01f43', name: 'Ficknäsduk' },
    { id: '68be85e5094d08828df01f4e', name: 'Ficknäsduk' },
    { id: '68be85e5094d08828df01f56', name: 'Ficknäsduk' },
    { id: '68be85e5094d08828df01f5b', name: 'Ficknäsduk' },
    { id: '68be85e5094d08828df01f65', name: 'Ficknäsduk' },
    { id: '68be85e6094d08828df02045', name: 'Ficknäsduk' },
    { id: '68be85e6094d08828df02050', name: 'Ficknäsduk' },
  ],

  // flugor (27 products)
  'flugor': [
    { id: '68be85b4094d08828def6062', name: 'Fluga' },
    { id: '68be85b4094d08828def6063', name: 'Fluga' },
    { id: '68be85b4094d08828def6064', name: 'Fluga' },
    { id: '68be85b4094d08828def6065', name: 'Fluga' },
    { id: '68be85b4094d08828def6066', name: 'Fluga' },
    { id: '68be85b4094d08828def6067', name: 'Fluga' },
    { id: '68be85d3094d08828defd8bb', name: 'Bow tie (ljusgrå)' },
    { id: '68be85d3094d08828defd9c8', name: 'Fluga (marinblå)' },
    { id: '68be85d3094d08828defd9cd', name: 'Fluga (mörkgrå)' },
    { id: '68be85d3094d08828defd9d7', name: 'Fluga (ljuslila)' },
    { id: '68be85d3094d08828defdad2', name: 'Fluga (blå och mörkblå)' },
    { id: '68be85d4094d08828defdc0f', name: 'Fluga (royalblå)' },
    { id: '68be85d4094d08828defdc16', name: 'Fluga (blå och grå)' },
    { id: '68be85d4094d08828defdce6', name: 'Fluga (grårandig)' },
    { id: '68be85d4094d08828defdcf1', name: 'Fluga (stålblå)' },
    { id: '68be85d4094d08828defdf10', name: 'Fluga (röd och svart)' },
    { id: '68be85d4094d08828defdf9f', name: 'Fluga (lila)' },
    { id: '68be85d4094d08828defe0fe', name: 'Fluga (blå och gul)' },
    { id: '68be85d4094d08828defe109', name: 'Fluga (röd)' },
    { id: '68be85e5094d08828df01e62', name: 'Fluga' },
    { id: '68be85e5094d08828df01e70', name: 'Fluga' },
    { id: '68be85e5094d08828df01e72', name: 'Fluga' },
    { id: '68be85e5094d08828df01e78', name: 'Fluga' },
    { id: '68be85e5094d08828df01e7f', name: 'Fluga' },
    { id: '68be85e5094d08828df01e88', name: 'Fluga' },
    { id: '68be85e5094d08828df01f4d', name: 'Fluga' },
    { id: '68be85e6094d08828df0204e', name: 'Fluga' },
  ],

  // pins-badges (27 products)
  'pins-badges': [
    { id: '68be85b5094d08828def6127', name: 'Pins med egen logo' },
    { id: '68be85b5094d08828def6128', name: 'Pins i mjukemalj' },
    { id: '68be85b5094d08828def6129', name: 'Pins gjutna' },
    { id: '68be85b5094d08828def612b', name: 'Pins offsettryckta' },
    { id: '68be85b5094d08828def612d', name: 'Pins med metallrelief' },
    { id: '68be85b5094d08828def612e', name: 'Pins Collection Mjukemalj' },
    { id: '68be85b5094d08828def61f6', name: 'BooBadge Bambu-bricka' },
    { id: '68be85b5094d08828def61f8', name: 'WooBadge magnetbricka med tryck' },
    { id: '68be85b8094d08828def68d2', name: 'Pins i hårdemalj' },
    { id: '68be85b8094d08828def68d3', name: 'Pins Fotoetsat' },
    { id: '68be85b8094d08828def69ab', name: 'BooBadge Bambu-bricka' },
    { id: '68be85cd094d08828defbe28', name: 'SquareBadge Maxi nål knapp badge' },
    { id: '68be85cd094d08828defbfbe', name: 'PinBadge RPET Maxi nål knapp badge' },
    { id: '68be85cf094d08828defc639', name: 'PinBadge RPET Mini nål knapp badge' },
    { id: '68be85d3094d08828defda1f', name: 'EpoBadge Midi Skräddarsydd Badge' },
    { id: '68be85d3094d08828defdb21', name: 'EpoBadge Maxi Skräddarsydd Badge' },
    { id: '68be85d5094d08828defe507', name: 'Lark metallbricka' },
    { id: '68be85d5094d08828defe518', name: 'Pin - Pinknapp' },
    { id: '68be85e2094d08828df013a3', name: 'Pins med egen logo' },
    { id: '68be85e6094d08828df02380', name: 'BooBadge Bambu-bricka' },
    { id: '68be85e8094d08828df027d9', name: 'Pins Fotoetsat' },
    { id: '68be85e8094d08828df027db', name: 'Pins i hårdemalj' },
    { id: '68be85e8094d08828df027df', name: 'Pins i mjukemalj' },
    { id: '68be85e8094d08828df028ea', name: 'Pins gjutna' },
    { id: '68be85e8094d08828df028fa', name: 'Pins offsettryckta' },
    { id: '68be85e9094d08828df02a28', name: 'Pins med metallrelief' },
    { id: '68be85e9094d08828df02b6d', name: 'Pins screentryckta' },
  ],

  // resekuddar (26 products)
  'resekuddar': [
    { id: '68be85af094d08828def4c0e', name: 'Heddow - Snabb uppblåsbar resekudde' },
    { id: '68be85af094d08828def4ed2', name: 'Hedrest - Resekudde i skumplast' },
    { id: '68be85b1094d08828def53fa', name: 'Resekudde Polytester Leontine' },
    { id: '68be85bd094d08828def7a4b', name: 'Travelplus - Ställ w/kudde,öga masker,plugga' },
    { id: '68be85be094d08828def7e9c', name: 'Travelconfort - Reskudde' },
    { id: '68be85be094d08828def7ea4', name: 'Heddow - Snabb uppblåsbar resekudde' },
    { id: '68be85be094d08828def7ea5', name: 'Hedrest - Resekudde i skumplast' },
    { id: '68be85be094d08828def7ea6', name: 'Melo - Nackkudde' },
    { id: '68be85be094d08828def7ea7', name: 'Resekudde, i mocka Fletcher' },
    { id: '68be85be094d08828def7ea8', name: 'STRADA. Uppblåsbar nackkudde' },
    { id: '68be85be094d08828def7ea9', name: 'Resekudde' },
    { id: '68be85be094d08828def7eaa', name: 'Resekudde Turn over' },
    { id: '68be85be094d08828def7eab', name: 'Resekudde Polytester Leontine' },
    { id: '68be85be094d08828def7eac', name: 'Inflight Kudde' },
    { id: '68be85cc094d08828defb0cd', name: 'Resekudde med memoryskum Martina' },
    { id: '68be85cd094d08828defb9a3', name: 'Nackkudde Uppblåsbar Velour Stanley' },
    { id: '68be85cd094d08828defbe85', name: 'Rese-/nackkudde i velour (fullfärgstryck) EU' },
    { id: '68be85d0094d08828defcd94', name: 'Resekudde självuppblåsande Schwarzwolf REST' },
    { id: '68be85d1094d08828defd0f8', name: 'Rese-/nackkudde i Mikrofiber (fullfärgstryck) EU' },
    { id: '68be85d2094d08828defd5b7', name: 'Dreams - Resekudde i 210D RPET' },
    { id: '68be85d3094d08828defd81a', name: 'Bantal - Resekudde i RPET' },
    { id: '68be85e6094d08828df022ce', name: 'Inflight Kudde' },
    { id: '68be85e9094d08828df02a30', name: 'Resekudde, i mocka Fletcher' },
    { id: '68be85e9094d08828df02a87', name: 'Melo - Nackkudde' },
    { id: '68be85e9094d08828df02d73', name: 'Travelplus - Ställ w/kudde,öga masker,plugga' },
    { id: '68be85ea094d08828df02e0a', name: 'Travelconfort - Reskudde' },
  ],

  // salt-pepparkvarnar (26 products)
  'salt-pepparkvarnar': [
    { id: '68be85b1094d08828def547c', name: 'Kampanj! Vi bjuder på inslagning! Gurken salt- och pepparkvarn stor' },
    { id: '68be85b1094d08828def547e', name: 'Gurken salt- och pepparkvarn medium' },
    { id: '68be85b1094d08828def547f', name: 'Axia Salt- och pepparkvarn' },
    { id: '68be85b1094d08828def5480', name: 'Karou Peppar- & Saltkvarn 40 cm' },
    { id: '68be85b1094d08828def5481', name: 'Karou Peppar / Saltkvarn 26cm' },
    { id: '68be85b1094d08828def5483', name: 'Karou Peppar / Saltkvarn 15 cm' },
    { id: '68be85ca094d08828defa947', name: 'Macina Pepper or Salt peppar- eller saltkvarn' },
    { id: '68be85ca094d08828defa948', name: 'Brabantia Profile Salt och Peppar Krossar' },
    { id: '68be85ca094d08828defa949', name: 'Wooosh Aiko Pepper & Salt salt och peppar shakers' },
    { id: '68be85ca094d08828defa9ba', name: 'Louna Pepper & Salt Classic salt- och pepparkvarn' },
    { id: '68be85ca094d08828defa9bd', name: 'Nature salt/peppar korkkula, 2-pack (6) Klar/brun' },
    { id: '68be85ca094d08828defa9be', name: 'Nature salt/peppar ekkork, 2-pack (6) Klar/brun' },
    { id: '68be85ca094d08828defa9bf', name: 'Nature serveringsset med ekkork, 2-pack (6) Klar' },
    { id: '68be85ca094d08828defab7e', name: 'Kryddkvarn av bambu Verena' },
    { id: '68be85d0094d08828defc9a5', name: 'Malabar salt- och pepparkvarn' },
    { id: '68be85d0094d08828defcb30', name: 'Saltkar - Cream' },
    { id: '68be85d0094d08828defcb3c', name: 'Saltkar - Röd' },
    { id: '68be85d0094d08828defcb41', name: 'Saltkar - Svart' },
    { id: '68be85d0094d08828defcb43', name: 'Molinillo - Salt Kvarn' },
    { id: '68be85d0094d08828defcb73', name: 'Semman salt- och pepparkvarn' },
    { id: '68be85d2094d08828defd718', name: 'Tucco - Pepparkvarn i akaciaträ' },
    { id: '68be85d4094d08828defdd14', name: 'Kerala salt- och pepparbestick' },
    { id: '68be85df094d08828df00aa8', name: 'Karou Peppar- & Saltkvarn 40 cm' },
    { id: '68be85e0094d08828df00cb4', name: 'Karou Peppar / Saltkvarn 26cm' },
    { id: '68be85e0094d08828df00cb7', name: 'Karou Peppar / Saltkvarn 15 cm' },
    { id: '68be85e2094d08828df012a0', name: 'Axia Salt- och pepparkvarn' },
  ],

  // rundhalsade-trojor (26 products)
  'rundhalsade-trojor': [
    { id: '68be85b2094d08828def582c', name: 'Junior Sweat' },
    { id: '68be85b2094d08828def5831', name: 'Printer - Marathon Junior' },
    { id: '68be85b5094d08828def63e4', name: 'Sweatshirt by AWDis' },
    { id: '68be85b5094d08828def63ea', name: 'Printer - Softball Rsx' },
    { id: '68be85b5094d08828def63ef', name: 'Junior Sweat' },
    { id: '68be85b5094d08828def63f0', name: 'Klassisk collegetröja, herr' },
    { id: '68be85b5094d08828def63f7', name: 'Collegetröja Prescott' },
    { id: '68be85b5094d08828def63f8', name: 'Collegetröja Prescott Barn' },
    { id: '68be85b5094d08828def63f9', name: 'Printer - Marathon' },
    { id: '68be85b5094d08828def6430', name: 'Junior Sweat' },
    { id: '68be85b7094d08828def6785', name: 'Baseball Sweatshirt by AWDis' },
    { id: '68be85b7094d08828def6786', name: 'Collegetröja Superstar Herr' },
    { id: '68be85b7094d08828def67dc', name: 'Sweatshirt by AWDis' },
    { id: '68be85b8094d08828def6876', name: 'Printer - Softball Rsx' },
    { id: '68be85b8094d08828def69ad', name: 'Junior Sweat' },
    { id: '68be85b8094d08828def69af', name: 'Klassisk collegetröja, herr' },
    { id: '68be85b8094d08828def69b0', name: 'Midland Crew' },
    { id: '68be85b8094d08828def6a6e', name: 'Collegetröja Prescott Barn' },
    { id: '68be85b8094d08828def6b07', name: 'Venezia Sweatshirt' },
    { id: '68be85b8094d08828def6b15', name: 'Printer - Marathon Junior' },
    { id: '68be85ba094d08828def6ef1', name: 'Baseball Sweatshirt by AWDis' },
    { id: '68be85ba094d08828def6ef3', name: 'Collegetröja Superstar Herr' },
    { id: '68be85e2094d08828df013cd', name: 'Junior Sweat' },
    { id: '68be85e5094d08828df01e47', name: 'Printer - Softball Rsx' },
    { id: '68be85e5094d08828df01f23', name: 'Printer - Marathon' },
    { id: '68be85e5094d08828df01f25', name: 'Printer - Marathon Junior' },
  ],

  // linjal (26 products)
  'linjal': [
    { id: '68be85c4094d08828def94a5', name: 'Linjal MAPED 30cm' },
    { id: '68be85c4094d08828def94a6', name: 'Linjal LYRECO 30cm' },
    { id: '68be85c4094d08828def94a7', name: 'Linjal LYRECO 40cm' },
    { id: '68be85c4094d08828def94a8', name: 'Linjal LYRECO 20cm' },
    { id: '68be85c4094d08828def94a9', name: 'Linjal LYRECO med 2 mått 30cm glasklar' },
    { id: '68be85c4094d08828def94aa', name: 'Linjal LYRECO aluminium 30cm' },
    { id: '68be85c4094d08828def94ac', name: 'Skallinjal MAPED skalor 1:20-1:125 30cm' },
    { id: '68be85c4094d08828def94ad', name: 'Tumstock LINEX trä 2m' },
    { id: '68be85c4094d08828def94ae', name: 'Linjal tvärgraderad 30cm' },
    { id: '68be85c4094d08828def94af', name: 'Skallinjal MAPED skalor 1:100-1:500 30cm' },
    { id: '68be85c4094d08828def94b0', name: 'Linjal LINEX stål 30cm' },
    { id: '68be85c4094d08828def94b1', name: 'Linjal dubbel m handtag 30cm' },
    { id: '68be85c4094d08828def94b2', name: 'Linjal LINEX A1530M plast 30cm' },
    { id: '68be85c4094d08828def94b3', name: 'Skallinjal STAEDTLER skalor 1:2,5-100' },
    { id: '68be85c4094d08828def94b4', name: 'Skallinjal 15cm 1:100:200:300:400:500' },
    { id: '68be85c4094d08828def94b5', name: 'Aluminiumlinjal LINEX 50cm' },
    { id: '68be85c4094d08828def94b6', name: 'Linjal 30cm dm/cm/mm-grader plast 10/fp' },
    { id: '68be85c4094d08828def94b7', name: 'Linjal LINEX 20cm' },
    { id: '68be85c4094d08828def94b8', name: 'Skallinjal STAEDTLER skalor 1:20-100' },
    { id: '68be85c4094d08828def94b9', name: 'Linjal 30 cm cm/mm-gradering plast 10/fp' },
    { id: '68be85c4094d08828def94ba', name: 'Linjal tvärgraderad 20cm' },
    { id: '68be85c4094d08828def94bb', name: 'Linjal 20 cm cm/mm-gradering plast 10/fp' },
    { id: '68be85c4094d08828def94bc', name: 'Linjal i trä 30 cm' },
    { id: '68be85c4094d08828def94bd', name: 'Linjal tvärgraderad 50cm' },
    { id: '68be85c4094d08828def94be', name: 'Linjal STAEDTLER aluminium 30 cm' },
    { id: '68be85c4094d08828def94bf', name: 'Linjal LINEX 30cm' },
  ],

  // laptopfodral (25 products)
  'laptopfodral': [
    { id: '68be85ad094d08828def472c', name: 'Case Logic Reflect 15,6" Laptop Sleeve. Svart' },
    { id: '68be85ad094d08828def472d', name: 'Case Logic Reflect 14" Laptop Sleeve. Svart' },
    { id: '68be85ad094d08828def472e', name: 'Case Logic Reflect 13,3" Laptop Sleeve. Svart' },
    { id: '68be85ad094d08828def472f', name: 'Case Logic Reflect 13" MacBook Pro® Sleeve. Svart' },
    { id: '68be85bf094d08828def816b', name: 'Laptop Fodral Filt' },
    { id: '68be85bf094d08828def81da', name: 'Laptop sleeve 15 PVC-fri' },
    { id: '68be85bf094d08828def81de', name: 'Väska Laptop väska i neopren' },
    { id: '68be85bf094d08828def81df', name: 'Laptop Fodral Filt' },
    { id: '68be85bf094d08828def81e0', name: 'Case Logic Reflect 13,3" Laptop Sleeve. Svart' },
    { id: '68be85bf094d08828def81e1', name: 'Laptopfodral Essential 13 tum' },
    { id: '68be85bf094d08828def81e2', name: 'Case Logic Reflect 13" MacBook Pro® Sleeve. Svart' },
    { id: '68be85c0094d08828def85d8', name: 'Väska Laptop väska i neopren' },
    { id: '68be85c0094d08828def85d9', name: 'Laptop Fodral Filt' },
    { id: '68be85c0094d08828def868a', name: 'Case Logic Reflect 15,6" Laptop Sleeve. Svart' },
    { id: '68be85c0094d08828def868c', name: 'Case Logic Reflect 14" Laptop Sleeve. Svart' },
    { id: '68be85c0094d08828def868e', name: 'Laptopfodral Essential 13 tum' },
    { id: '68be85d2094d08828defd59d', name: 'Väska för ca 13,3" laptop' },
    { id: '68be85d2094d08828defd5ff', name: 'Case Logic 17,3" Laptop Sleeve. Svart' },
    { id: '68be85d2094d08828defd600', name: 'Case Logic Deco 14" Laptop Sleeve. Svart' },
    { id: '68be85d2094d08828defd601', name: 'Case Logic 10" Chromebook™ / 11,6" Ultrabook™ Sleeve. Svart' },
    { id: '68be85d2094d08828defd602', name: 'Case Logic 15-16" Laptop Sleeve. Svart' },
    { id: '68be85d2094d08828defd6b6', name: 'Case Logic 14" Laptop Sleeve. Svart' },
    { id: '68be85d2094d08828defd6be', name: 'Case Logic 13" Laptop Sleeve. Svart' },
    { id: '68be85de094d08828df00a5c', name: 'Laptop sleeve 15 PVC-fri' },
    { id: '68be85e8094d08828df02695', name: 'Väska Laptop väska i neopren' },
  ],

  // stekpannor-kastruller (24 products)
  'stekpannor-kastruller': [
    { id: '68be85b1094d08828def53d2', name: 'Granny Kastrull' },
    { id: '68be85b1094d08828def540c', name: 'Gretl Gjutjärnsgryta' },
    { id: '68be85b1094d08828def540f', name: 'Nordic Profi fry pan 28 cm' },
    { id: '68be85ca094d08828defaa2c', name: 'Grillpanna med trähandtag från Jernverket' },
    { id: '68be85ca094d08828defaa2d', name: 'Snygg gryta med lock i gjutjärn från Jernverket' },
    { id: '68be85ca094d08828defaa32', name: 'Grillpanna från Jernverket' },
    { id: '68be85ca094d08828defaa9b', name: 'Grillpanna från Jernverket' },
    { id: '68be85ca094d08828defab17', name: 'Lergryta Rustico 6 Pers' },
    { id: '68be85cf094d08828defc6b3', name: 'Grillpanna Fyrkantig 27 Cm Classic Collection' },
    { id: '68be85cf094d08828defc80f', name: 'Lergryta Rustico 4 Pers' },
    { id: '68be85cf094d08828defc811', name: 'Lergryta Classic Maxi 8 Pers' },
    { id: '68be85cf094d08828defc812', name: 'Wokpanna 32cm - Chef Collection' },
    { id: '68be85cf094d08828defc815', name: 'Crêpes/pannkakspanna 27 Cm Classic Collection' },
    { id: '68be85d0094d08828defc81c', name: 'Lergryta Classic 2 Pers' },
    { id: '68be85d0094d08828defc9c1', name: 'Lergryta Classic 4 Pers' },
    { id: '68be85d0094d08828defcc8a', name: 'Tagine 4 L - Tout Mörkgrå' },
    { id: '68be85d1094d08828defce57', name: 'Tagine 2 L - Tout Mörkgrå' },
    { id: '68be85d3094d08828defd968', name: 'Lajka - Gryta' },
    { id: '68be85de094d08828df00a10', name: 'Gretl Gjutjärnsgryta' },
    { id: '68be85e2094d08828df0158c', name: 'Nordic Profi fry pan 28 cm' },
    { id: '68be85ea094d08828df02e6d', name: 'Grillpanna från Jernverket' },
    { id: '68be85ea094d08828df02e6e', name: 'Grillpanna från Jernverket' },
    { id: '68be85ea094d08828df02e71', name: 'Snygg gryta med lock i gjutjärn från Jernverket' },
    { id: '68be85ea094d08828df02e73', name: 'Grillpanna med trähandtag från Jernverket' },
  ],

  // smittskydd (23 products)
  'smittskydd': [
    { id: '68be85b2094d08828def5780', name: 'Clip-On Sunscreen SPF 30' },
    { id: '68be85b8094d08828def6ad4', name: 'Dörröppnare i aluminium Jada' },
    { id: '68be85b8094d08828def6ad7', name: 'HANDY SAFE. Multifunktionell nyckelring' },
    { id: '68be85bd094d08828def7b4d', name: 'Fusion Face Mask' },
    { id: '68be85bd094d08828def7b4e', name: '3 Layer Fabric Face Mask' },
    { id: '68be85bd094d08828def7b4f', name: 'Commuter Face Mask (Sublimated Print)' },
    { id: '68be85bd094d08828def7b50', name: 'Washable 2-ply face covering (pack of 5)' },
    { id: '68be85bd094d08828def7b55', name: 'Performance Tvättbara Munskydd 5-pack' },
    { id: '68be85bd094d08828def7b56', name: 'Adult Tvättbart Munskydd, 5-pack' },
    { id: '68be85bd094d08828def7b58', name: 'HANDY SAFE. Multifunktionell nyckelring' },
    { id: '68be85bd094d08828def7b63', name: 'Fusion Face Mask' },
    { id: '68be85bd094d08828def7b64', name: '3 Layer Fabric Face Mask' },
    { id: '68be85bd094d08828def7b65', name: 'Commuter Face Mask (Sublimated Print)' },
    { id: '68be85bd094d08828def7b67', name: 'Washable 2-ply face covering (pack of 5)' },
    { id: '68be85bd094d08828def7b68', name: 'Performance Tvättbara Munskydd 5-pack' },
    { id: '68be85bd094d08828def7b69', name: 'Adult Tvättbart Munskydd, 5-pack' },
    { id: '68be85be094d08828def7c19', name: 'Clip-On Sunscreen SPF 30' },
    { id: '68be85c3094d08828def90f6', name: 'SunKraft SPF 30' },
    { id: '68be85ce094d08828defc548', name: 'Turtle Care Utrustning (250 ml)' },
    { id: '68be85d2094d08828defd229', name: 'Dörröppnare, i metall, Alivia' },
    { id: '68be85d3094d08828defd9d6', name: 'Dörröppnare i koppar Finnegan' },
    { id: '68be85d5094d08828defe1b7', name: 'Tvättbart Munskydd' },
    { id: '68be85ea094d08828df02db8', name: 'Dörröppnare i aluminium Jada' },
  ],

  // damtrojor (23 products)
  'damtrojor': [
    { id: '68be85b4094d08828def5d5d', name: 'Printer - Speedway Lady' },
    { id: '68be85b4094d08828def5d78', name: 'Printer - Speedway Lady' },
    { id: '68be85b5094d08828def6111', name: 'Hoodtröja Reflex Dam' },
    { id: '68be85b5094d08828def63d7', name: 'Printer RED - Switch Lady' },
    { id: '68be85b5094d08828def645b', name: 'Printer - Overhead Lady' },
    { id: '68be85b6094d08828def6487', name: 'Printer - Overhead Lady' },
    { id: '68be85b6094d08828def64ff', name: 'Cropped Hoodie Dam by AWDis' },
    { id: '68be85b6094d08828def6500', name: 'Printer - Fastpitch Lady' },
    { id: '68be85b6094d08828def6504', name: 'Hoodie Dress Dam by AWDis' },
    { id: '68be85b6094d08828def6505', name: 'Granada hood woman' },
    { id: '68be85b6094d08828def6507', name: 'Hoodtröja Reflex Dam' },
    { id: '68be85b6094d08828def6508', name: 'Långärmad Stretch T-shirt Dam' },
    { id: '68be85b6094d08828def6509', name: 'Printer RED - Switch Lady' },
    { id: '68be85b6094d08828def650e', name: 'Huvjacka Superstar Dam' },
    { id: '68be85b6094d08828def6543', name: 'Cropped Hoodie Dam by AWDis' },
    { id: '68be85b6094d08828def65a2', name: 'Hoodtröja Reflex Dam' },
    { id: '68be85b6094d08828def65a9', name: 'Huvjacka Superstar Dam' },
    { id: '68be85b7094d08828def66f4', name: 'Långärmad Stretch T-shirt Dam' },
    { id: '68be85b8094d08828def6a5f', name: 'Printer - Fastpitch Lady' },
    { id: '68be85ba094d08828def6eea', name: 'Huvjacka Superstar Dam' },
    { id: '68be85e5094d08828df01e3f', name: 'Printer - Overhead Lady' },
    { id: '68be85e5094d08828df01e5a', name: 'Printer - Speedway Lady' },
    { id: '68be85e5094d08828df01f1a', name: 'Printer - Fastpitch Lady' },
  ],

  // piketrojor-funktion (23 products)
  'piketrojor-funktion': [
    { id: '68be85b4094d08828def5fad', name: 'Cool Dry Sport Pique' },
    { id: '68be85b4094d08828def5faf', name: 'Cool Polo' },
    { id: '68be85b4094d08828def5fb1', name: 'Men"s poly/cotton blend polo' },
    { id: '68be85b4094d08828def5fb2', name: 'Cool Dry Sport Pique Lady' },
    { id: '68be85b4094d08828def5fb4', name: 'Women"s poly/cotton blend polo' },
    { id: '68be85b4094d08828def5fb7', name: 'Women"s Cool Polo' },
    { id: '68be85b4094d08828def5fb8', name: 'Madrid pique man' },
    { id: '68be85b4094d08828def5fb9', name: 'Madrid pique woman' },
    { id: '68be85b4094d08828def5fba', name: 'Sevilla pique man' },
    { id: '68be85b4094d08828def5fbb', name: 'Imola Piké' },
    { id: '68be85b5094d08828def62ec', name: 'Cool Dry Sport Pique' },
    { id: '68be85b5094d08828def62ee', name: 'Cool Polo' },
    { id: '68be85b5094d08828def62f0', name: 'Men"s poly/cotton blend polo' },
    { id: '68be85b5094d08828def62f2', name: 'Women"s poly/cotton blend polo' },
    { id: '68be85b5094d08828def62f3', name: 'Women"s Cool Polo' },
    { id: '68be85b5094d08828def62f4', name: 'Madrid pique man' },
    { id: '68be85b5094d08828def630d', name: 'Women"s poly/cotton blend polo' },
    { id: '68be85b5094d08828def630f', name: 'Cool Dry Sport Pique Lady' },
    { id: '68be85b5094d08828def6318', name: 'Women"s Cool Polo' },
    { id: '68be85b5094d08828def634e', name: 'Men"s poly/cotton blend polo' },
    { id: '68be85b5094d08828def644c', name: 'Sevilla pique man' },
    { id: '68be85e2094d08828df013b1', name: 'Cool Dry Sport Pique' },
    { id: '68be85e2094d08828df013b8', name: 'Cool Dry Sport Pique Lady' },
  ],

  // blanketter (23 products)
  'blanketter': [
    { id: '68be85c3094d08828def9061', name: 'Lottring Fair Play 1-200' },
    { id: '68be85c3094d08828def9062', name: 'Lottring Fair Play 1-100' },
    { id: '68be85c3094d08828def9068', name: 'Karbonpapper BNT A4 svart 10/fp' },
    { id: '68be85dd094d08828df00528', name: 'Standardblankett talong vit 2500/fp' },
    { id: '68be85dd094d08828df0052a', name: 'Blankett bokföringsorder A5L 50 blad' },
    { id: '68be85dd094d08828df0052b', name: 'Blankett bokföringsorder A5L 50 blad' },
    { id: '68be85dd094d08828df0052c', name: 'Blankett bokföringsorder A4 50 blad' },
    { id: '68be85dd094d08828df0052d', name: 'Standardblankett talong blåton 2500/fp' },
    { id: '68be85dd094d08828df0052e', name: 'Blankett körjournal A5L 2x50 blad' },
    { id: '68be85dd094d08828df00531', name: 'Blankett räkning m. kopia A5 50 blad' },
    { id: '68be85dd094d08828df00534', name: 'Presentkort 100 kort + 100 kuvert' },
    { id: '68be85dd094d08828df00536', name: 'Blankett avlöningskvitto A5 50 bl mkopia' },
    { id: '68be85dd094d08828df00539', name: 'Blankett rekvisition A5 m.1 kopia 2x50bl' },
    { id: '68be85dd094d08828df0053a', name: 'Blankett bokföringsorder A4 50 blad' },
    { id: '68be85dd094d08828df0053b', name: 'Blankett räkning med kopia A5 50 blad' },
    { id: '68be85dd094d08828df0053c', name: 'Grundbok/Kolumndagbok A4L' },
    { id: '68be85dd094d08828df0053d', name: 'Blankett faktura A4 2x50 blad' },
    { id: '68be85dd094d08828df0053f', name: 'Blankett faktura 2/3 A4 2x50 blad' },
    { id: '68be85dd094d08828df00541', name: 'Körjournal A5' },
    { id: '68be85dd094d08828df00543', name: 'Blankett räkning utan kopia A5 50 blad' },
    { id: '68be85dd094d08828df00545', name: 'Standardblankett talong Bankgiro 250/fp' },
    { id: '68be85dd094d08828df00547', name: 'Blankett paragonnotor 10-200' },
    { id: '68be85dd094d08828df00548', name: 'Standardblankett talong Plusgiro 250/fp' },
  ],

  // skrivunderlagg (23 products)
  'skrivunderlagg': [
    { id: '68be85c4094d08828def940b', name: 'Skrivunderlägg EXACOMPTA TEKSTO' },
    { id: '68be85c4094d08828def940c', name: 'Skrivunderlägg CEP Sliva vit/bok' },
    { id: '68be85c4094d08828def940d', name: 'Skrivunderlägg LYRECO 25ark 59x42cm' },
    { id: '68be85c4094d08828def940e', name: 'Skrivunderlägg EXACOMPTA TEKSTO' },
    { id: '68be85c4094d08828def940f', name: 'Kalenderrefill till skrivunderl. LYRECO' },
    { id: '68be85c4094d08828def9410', name: 'Golvstativ ACTIVESTAND vit' },
    { id: '68be85c4094d08828def9411', name: 'Skrivunderlägg DURABLE PP 65x50cm' },
    { id: '68be85c4094d08828def9412', name: 'Skrivunderlägg DURABLE PP 65x50cm' },
    { id: '68be85c4094d08828def9413', name: 'Skrivunderlägg med ficka 53x40cm' },
    { id: '68be85c4094d08828def9414', name: 'Skrivunderlägg med ficka 53x40cm' },
    { id: '68be85c4094d08828def9415', name: 'Skrivunderlägg DURABLE kal PP 65x50 sva' },
    { id: '68be85c4094d08828def9416', name: 'Skrivunderlägg BIGSO Annie 59x39cm' },
    { id: '68be85c4094d08828def9417', name: 'Skrivunderlägg BIGSO Annie 59x39cm' },
    { id: '68be85c4094d08828def9418', name: 'Skrivunderlägg EXACOMPTA 58,5x38,5cm bru' },
    { id: '68be85c4094d08828def9419', name: 'Skrivunderlägg Världsk. PP 58,5x38,5cm' },
    { id: '68be85c4094d08828def941a', name: 'Skrivunderlägg med ficka 53x40cm' },
    { id: '68be85c4094d08828def941b', name: 'Skrivunderlägg DURABLE PP 65x50cm transp' },
    { id: '68be85c4094d08828def941c', name: 'Skrivunderlägg BIGSO Annie 59x39cm' },
    { id: '68be85c4094d08828def941d', name: 'Skrivbordsunderlägg BIGSO Annie Mint' },
    { id: '68be85c4094d08828def941e', name: 'Skrivunderlägg DURABLE 65x52cm svart' },
    { id: '68be85c4094d08828def941f', name: 'Skrivunderlägg DURABLE 65x50cm transp' },
    { id: '68be85c4094d08828def9420', name: 'Skrivunderlägg BURDE 60x43cm svart' },
    { id: '68be85c4094d08828def9428', name: 'Skrivunderlägg m. hel ficka 49x65cm sva' },
  ],

  // korthallare-yoyo (23 products)
  'korthallare-yoyo': [
    { id: '68be85c6094d08828def9cd5', name: 'Jojo CARDKEEP med nyckelrin' },
    { id: '68be85c6094d08828def9cd6', name: 'Jojo CARDKEEP med plaststrip' },
    { id: '68be85c6094d08828def9cd7', name: 'Miniyoyo CARDKEEP med nyckelrin' },
    { id: '68be85c6094d08828def9cd8', name: 'Miniyoyo CARDKEEP med nyckelrin' },
    { id: '68be85c6094d08828def9cd9', name: 'Jojo CARDKEEP med nyckelrin' },
    { id: '68be85c6094d08828def9cda', name: 'Jojo CARDKEEP med plaststrip' },
    { id: '68be85c6094d08828def9cdb', name: 'Miniyoyo CARDKEEP med nyckelrin' },
    { id: '68be85c6094d08828def9cdc', name: 'Jojo DURABLE STYLE m.hake' },
    { id: '68be85c6094d08828def9cdd', name: 'Jojo DURABLE STYLE m.hake' },
    { id: '68be85c6094d08828def9cde', name: 'Jojo DURABLE STYLE m.hake' },
    { id: '68be85c6094d08828def9cdf', name: 'Korthållare DURABLE yoyo m.knap10/fp' },
    { id: '68be85c6094d08828def9ce0', name: 'Korthållare DURABLE yoyo m.knap10/fp' },
    { id: '68be85c6094d08828def9ce3', name: 'Korthållare Cardkeep Yoyo 2' },
    { id: '68be85c6094d08828def9ce5', name: 'Korthållare DURABLE jojo 90x54mm 10/fp' },
    { id: '68be85c6094d08828def9ce6', name: 'Korthållare DURABLE yoyo svart knap10/fp' },
    { id: '68be85c6094d08828def9ce7', name: 'Korthållare DURABLE jojo 10/fp' },
    { id: '68be85c6094d08828def9ce8', name: 'Korthållare med Yoyo höger' },
    { id: '68be85c6094d08828def9ce9', name: 'Korthållare Yoyo Reko 220 clip transp.' },
    { id: '68be85c6094d08828def9cea', name: 'Korthållare CardKeep Excellent med Yoyo' },
    { id: '68be85c6094d08828def9ceb', name: 'Jojo DURABLE EXTRA STARK svart' },
    { id: '68be85c6094d08828def9cec', name: 'Nyckelring Yoyo 43 metall' },
    { id: '68be85c6094d08828def9ced', name: 'Korthållare DURABLE jojo med hake' },
    { id: '68be85c6094d08828def9cee', name: 'Korthållare Yoyo Reko 220 med stoppknapp' },
  ],

  // grillen (22 products)
  'grillen': [
    { id: '68be85ae094d08828def4a72', name: 'POKE. Grillset' },
    { id: '68be85b2094d08828def56ee', name: 'BBQ-Kit grillsett' },
    { id: '68be85b2094d08828def5754', name: 'POKE. Grillset' },
    { id: '68be85be094d08828def7d75', name: 'BBQ-Kit grillsett' },
    { id: '68be85c9094d08828defa710', name: 'Yakiboo Grillset' },
    { id: '68be85c9094d08828defa712', name: 'Portable Charcoal BBQ grill' },
    { id: '68be85c9094d08828defa713', name: 'PICKNICKGRILL' },
    { id: '68be85c9094d08828defa720', name: 'BBQ Grillstartare' },
    { id: '68be85c9094d08828defa721', name: 'Verano BBQ-set grillsett' },
    { id: '68be85c9094d08828defa722', name: 'Asado BBQ-Set grillsett' },
    { id: '68be85c9094d08828defa723', name: 'Grillset i aluminium väska, Jennifer' },
    { id: '68be85d0094d08828defc94a', name: 'Grillset i bambu Melina' },
    { id: '68be85d0094d08828defcc64', name: 'Smokey - Grillset i ek' },
    { id: '68be85d2094d08828defd1e6', name: 'Chimey - Bärbar grill' },
    { id: '68be85d3094d08828defd85b', name: 'KABSA. Grillset levereras i ett bambufodral' },
    { id: '68be85d4094d08828defdd0e', name: 'Kamado Grillset' },
    { id: '68be85d4094d08828defdd45', name: 'Bbq To Go - Bärbar kolgrill med stativ' },
    { id: '68be85d4094d08828defde5e', name: 'Donau Bally - Grillset' },
    { id: '68be85d4094d08828defde80', name: 'Summer - Grillbestick' },
    { id: '68be85d4094d08828defdf1f', name: 'Shakes - 3 st grillredskap i fodral' },
    { id: '68be85d4094d08828defdf2e', name: 'Donau East - BBQ set' },
    { id: '68be85d4094d08828defe011', name: 'Grill - Grillset' },
  ],

  // korthallare-standard (22 products)
  'korthallare-standard': [
    { id: '68be85c6094d08828def9cb9', name: 'Nyckelband rPET m. karbinhake 46cm 10/fp' },
    { id: '68be85c6094d08828def9cbc', name: 'Nyckelband rPET karbinhake beige 10/fp' },
    { id: '68be85c6094d08828def9cbf', name: 'Korthållare DURABLE reXycle® 10/fp' },
    { id: '68be85c6094d08828def9cc0', name: 'Korthållare DURABLE reXycle®2 kort 10/fp' },
    { id: '68be85c6094d08828def9cc1', name: 'Korthållare CardKeep Multi 1-5 kort blå' },
    { id: '68be85c6094d08828def9cc2', name: 'Korthållare Reko 5 vertikal kortutskjut' },
    { id: '68be85c6094d08828def9cc3', name: 'Korthållare CardKeep Reko 20' },
    { id: '68be85c6094d08828def9cc5', name: 'Korthållare Reko 5 transparent stående' },
    { id: '68be85c6094d08828def9cc6', name: 'Korthållare CardKeep Secure liggande' },
    { id: '68be85c6094d08828def9cc7', name: 'Korthållare Reko 5 transparent liggande' },
    { id: '68be85c6094d08828def9cc8', name: 'Korthållare CardKeep Secure stående' },
    { id: '68be85c6094d08828def9cc9', name: 'Korthållare 2 kort Reko 76 liggande' },
    { id: '68be85c6094d08828def9cca', name: 'Korthållare CARDKEEP Multi Duo' },
    { id: '68be85c6094d08828def9ccb', name: 'Korthållare DURABLE akryl dubbels.10/fp' },
    { id: '68be85c6094d08828def9ccc', name: 'Plastficka korthållare CarKeep stå 25/fp' },
    { id: '68be85c6094d08828def9ccd', name: 'Kreditkortsfodral DURABLE SECURE' },
    { id: '68be85c6094d08828def9ccf', name: 'Plastficka korthållare CarKeep lig 25/fp' },
    { id: '68be85c6094d08828def9cd0', name: 'Korthållare Ecologic' },
    { id: '68be85c6094d08828def9cd1', name: 'Korthållare CardKeep Trio' },
    { id: '68be85c6094d08828def9cd2', name: 'Korthållare CardKeep Excellent svart' },
    { id: '68be85c6094d08828def9cd3', name: 'Korthållare CardKeep Reko 20' },
    { id: '68be85c6094d08828def9cd4', name: 'Korthållare Reko 12' },
  ],

  // mobilvaskor (21 products)
  'mobilvaskor': [
    { id: '68be85ad094d08828def4786', name: 'Mobibolsa - Crossbody-väska för smartphone' },
    { id: '68be85ad094d08828def486d', name: 'Case Logic Cover Galaxy Tab4. Acai' },
    { id: '68be85ad094d08828def486f', name: 'Case Logic Roterande Galaxy Tab4. 10,1". Grafit metallisk' },
    { id: '68be85ae094d08828def4942', name: 'Splash vattentätt mobilskal' },
    { id: '68be85c0094d08828def859b', name: 'Mobibolsa - Crossbody-väska för smartphone' },
    { id: '68be85c0094d08828def859c', name: 'Phone Pouch' },
    { id: '68be85c0094d08828def859e', name: 'Case Logic Cover Galaxy Tab4. Acai' },
    { id: '68be85c0094d08828def8607', name: 'Phone Pouch XL' },
    { id: '68be85c0094d08828def8608', name: 'Wapro vattentätt mobilskal' },
    { id: '68be85c0094d08828def8609', name: 'Coprox vattentätt mobilskal' },
    { id: '68be85c0094d08828def860a', name: 'Splash vattentätt mobilskal' },
    { id: '68be85cd094d08828defb8c1', name: 'Laddningsfodral i filt Hanging Tough' },
    { id: '68be85cd094d08828defb8c2', name: 'Travel Wallet' },
    { id: '68be85d2094d08828defd398', name: 'Case Logic SureFit 2.0 Folio för 7-8" Tablet. Svart' },
    { id: '68be85d2094d08828defd39a', name: 'Case Logic SureFit Slim Folio Case för 8" Tablet. Blå' },
    { id: '68be85d2094d08828defd39b', name: 'Case Logic SureFit Classic Folio Case för 7" Tablet. Svart' },
    { id: '68be85d2094d08828defd4c8', name: 'Case Logic Rotating Folio för iPad Air 2®. Phlox' },
    { id: '68be85e6094d08828df0225c', name: 'Wapro vattentätt mobilskal' },
    { id: '68be85e6094d08828df022df', name: 'Coprox vattentätt mobilskal' },
    { id: '68be85ea094d08828df02eeb', name: 'Väska Vattentät i polyester (210T) Pia' },
    { id: '68be85eb094d08828df0316d', name: 'Ross telefonväska av återvunnen GRS' },
  ],

  // vaggklockor (21 products)
  'vaggklockor': [
    { id: '68be85be094d08828def7f82', name: 'Horma - Väggklocka' },
    { id: '68be85be094d08828def7f83', name: 'Relo - Väggklocka' },
    { id: '68be85c0094d08828def872f', name: 'Khoma - Väggklocka' },
    { id: '68be85cd094d08828defb964', name: 'Väggklocka Saturn' },
    { id: '68be85cd094d08828defb965', name: 'Väggklocka Hemera' },
    { id: '68be85cd094d08828defb967', name: 'Väggklocka Sun' },
    { id: '68be85cd094d08828defb968', name: 'Väggklocka Uranius' },
    { id: '68be85cd094d08828defb969', name: 'Väggklocka Roundabout' },
    { id: '68be85cd094d08828defb96a', name: 'Rilo - Väggklocka' },
    { id: '68be85cd094d08828defb96b', name: 'Wand - Väggklocka' },
    { id: '68be85cd094d08828defb96c', name: 'Odi - Väggklocka' },
    { id: '68be85cd094d08828defb96d', name: 'Väggklocka plast Kenya' },
    { id: '68be85cd094d08828defb96e', name: 'Väggklocka, ABS, Ali' },
    { id: '68be85d3094d08828defd8eb', name: 'Tokei väggklocka i bambu' },
    { id: '68be85d3094d08828defda2c', name: 'BeTime Wood B Väggklocka' },
    { id: '68be85d3094d08828defdac4', name: 'Esfere - Rund väggklocka av bambu' },
    { id: '68be85d3094d08828defdb23', name: 'BeTime Wood D Väggklocka' },
    { id: '68be85d4094d08828defdf65', name: 'Skoghall - Väggklocka' },
    { id: '68be85e9094d08828df02a86', name: 'Horma - Väggklocka' },
    { id: '68be85e9094d08828df02a8f', name: 'Khoma - Väggklocka' },
    { id: '68be85e9094d08828df02a96', name: 'Relo - Väggklocka' },
  ],

  // papperskorgar (21 products)
  'papperskorgar': [
    { id: '68be85c4094d08828def94d4', name: 'Papperskorg LYRECO 14L' },
    { id: '68be85c4094d08828def94d5', name: 'Papperskorg ARCHIVO 2000 18' },
    { id: '68be85c4094d08828def94d6', name: 'Papperskorg DURABLE economy 13L m.grå' },
    { id: '68be85c4094d08828def94d7', name: 'Papperskorg DURABLE ECO rund 16L grå' },
    { id: '68be85c4094d08828def94d8', name: 'Papperskorg well 380x350x740mm vit' },
    { id: '68be85c4094d08828def94d9', name: 'Papperskorg ARCHIVO 2000 18' },
    { id: '68be85c4094d08828def94da', name: 'Papperskorg ARCHIVO 2000 18' },
    { id: '68be85c4094d08828def94dc', name: 'Papperskorg ARCHIVO 2000 18' },
    { id: '68be85c4094d08828def94dd', name: 'Papperskorg EXACOMPTA recycled 15L svart' },
    { id: '68be85c4094d08828def94de', name: 'Papperskorg ALBA 20L silver' },
    { id: '68be85c4094d08828def94df', name: 'Papperskorg DURABLE Trend 16L svart' },
    { id: '68be85c4094d08828def94e0', name: 'Plattformsvagn 1000x600mm' },
    { id: '68be85c4094d08828def94e1', name: 'Papperskorg trådmetall 18L' },
    { id: '68be85c4094d08828def94e2', name: 'Papperskorg DJOIS 15L svart Eco' },
    { id: '68be85c4094d08828def94e3', name: 'Papperskorg rund 22L' },
    { id: '68be85c4094d08828def94e4', name: 'Papperskorg rund 22L' },
    { id: '68be85c4094d08828def94e5', name: 'Papperskorg CEP Ellypse 15L svart' },
    { id: '68be85c4094d08828def94e6', name: 'Papperskorg trådmetall 18L' },
    { id: '68be85c4094d08828def94e7', name: 'Paraplyställ/Papperskorg DURABLE svart' },
    { id: '68be85c4094d08828def94e8', name: 'Papperskorg DURABIN rund 40L svart' },
    { id: '68be85c4094d08828def94ea', name: 'Papperskorg extra insats DURABLE svart' },
  ],

  // gaffelparmar-i-plast (21 products)
  'gaffelparmar-i-plast': [
    { id: '68be85c4094d08828def95b7', name: 'Gaffelpärm PP med ficka A4 40mm' },
    { id: '68be85c4094d08828def95b8', name: 'Pärm LYRECO ECO A4 EU.hål PP 80mm' },
    { id: '68be85c4094d08828def96d7', name: 'Gaffelpärm PP med ficka A4 40mm' },
    { id: '68be85c4094d08828def96d8', name: 'Gaffelpärm PP med ficka A4 60mm' },
    { id: '68be85c4094d08828def96d9', name: 'Pärm LYRECO ECO A4 EU.hål PP 80mm' },
    { id: '68be85c4094d08828def96da', name: 'Pärm LYRECO ECO A4 EU.hål PP 50mm svart' },
    { id: '68be85c4094d08828def96e1', name: 'Gaffelpärm KEBAErgo A4 55mm /neutral' },
    { id: '68be85c4094d08828def96e5', name: 'Gaffelpärm FSC A4 60mm' },
    { id: '68be85c4094d08828def96e9', name: 'Gaffelpärm KEBAErgo A4 55mm /neutral' },
    { id: '68be85c4094d08828def96ea', name: 'Gaffelpärm KEBAErgo A4 55mm /neutral' },
    { id: '68be85c4094d08828def96ee', name: 'Gaffelpärm FSC A4 60mm' },
    { id: '68be85c4094d08828def96f1', name: 'Gaffelpärm KEBAErgo A4 55mm /neutral' },
    { id: '68be85c4094d08828def96f2', name: 'Gaffelpärm KEBAErgo A4 55mm /neutral' },
    { id: '68be85c4094d08828def96f3', name: 'Gaffelpärm KEBAErgo A4 40mm /neutral' },
    { id: '68be85c4094d08828def96f5', name: 'Gaffelpärm FSC A4 60mm bordeaux' },
    { id: '68be85c4094d08828def96f6', name: 'Gaffelpärm KEBAErgo A4 40mm /neutral' },
    { id: '68be85c4094d08828def96f9', name: 'Gaffelpärm KEBAergo A4 55mm Orange/Neutr' },
    { id: '68be85c4094d08828def96fa', name: 'Gaffelpärm KEBAErgo A4 55mm korall/neutr' },
    { id: '68be85c4094d08828def96fc', name: 'Gaffelpärm KEBAErgo A4 55mm grafitgrå' },
    { id: '68be85c4094d08828def96fd', name: 'Gaffelpärm KEBAErgo A4 40mm svart/svart' },
    { id: '68be85c4094d08828def96fe', name: 'Gaffelpärm KEBAErgo A4 55mm svart/svart' },
  ],

  // ytterklader-barnklader (20 products)
  'ytterklader-barnklader': [
    { id: '68be85ad094d08828def484b', name: 'THC ZAGREB KIDS. Barnjacka' },
    { id: '68be85ad094d08828def48a1', name: 'THC DUBLINERS KIDS. Vindjacka (unisex)' },
    { id: '68be85ad094d08828def48a9', name: 'THC AMSTERDAM KIDS. Barnjacka' },
    { id: '68be85af094d08828def4da3', name: 'Jr Links  rainjacket' },
    { id: '68be85af094d08828def4da8', name: 'Jr Lytham softshell jacket' },
    { id: '68be85af094d08828def4e5f', name: 'Jr Ganton wind jacket' },
    { id: '68be85b2094d08828def57ea', name: 'Tallin isolerad jacka för barn' },
    { id: '68be85b2094d08828def57ec', name: 'Oslo väst barn' },
    { id: '68be85b2094d08828def57ed', name: 'America fodrad parkasjacka för barn' },
    { id: '68be85b2094d08828def57ee', name: 'Surf Kids - SURF KIDS WINDBREAKER 210g' },
    { id: '68be85b2094d08828def57fd', name: 'THC ZAGREB KIDS. Barnjacka' },
    { id: '68be85b2094d08828def57ff', name: 'Jr Lytham softshell jacket' },
    { id: '68be85b4094d08828def5f04', name: 'Jr Links  rainjacket' },
    { id: '68be85b4094d08828def5fa3', name: 'Jr Ganton wind jacket' },
    { id: '68be85d1094d08828defd027', name: 'THC AMSTERDAM KIDS WH. Barnjacka' },
    { id: '68be85d6094d08828defe6bf', name: 'Willmar Junior' },
    { id: '68be85e4094d08828df01b95', name: 'Tallin isolerad jacka för barn' },
    { id: '68be85e4094d08828df01ba6', name: 'Europa isolerad jacka för barn' },
    { id: '68be85e5094d08828df01c22', name: 'Oslo väst barn' },
    { id: '68be85e5094d08828df01c37', name: 'America fodrad parkasjacka för barn' },
  ],

  // koksknivar (20 products)
  'koksknivar': [
    { id: '68be85b2094d08828def5560', name: 'Set med skärbräda och kniv' },
    { id: '68be85b2094d08828def5574', name: 'Set med skärbräda och kniv' },
    { id: '68be85b2094d08828def5614', name: 'Akira kinesisk kockkniv' },
    { id: '68be85c9094d08828defa8bf', name: 'InSideOut Santoku knivset 2 st Ravn' },
    { id: '68be85c9094d08828defa8c0', name: 'Skärbräda "Bambu Cut"' },
    { id: '68be85c9094d08828defa8c1', name: 'Skärset' },
    { id: '68be85ca094d08828defa93b', name: 'KOMPLETT GRILLSET - 26 DELAR' },
    { id: '68be85ca094d08828defa950', name: 'Elegance Red - Skinkkniv 26 Cm' },
    { id: '68be85ca094d08828defa952', name: 'BOSKA Köksknivar Monaco+, set om 3' },
    { id: '68be85d0094d08828defc816', name: 'Sabrage Elegance - Sabre Kniv 45 Cm' },
    { id: '68be85d0094d08828defcafa', name: 'Knivset i Bambu Tony' },
    { id: '68be85d0094d08828defcddc', name: 'Brancusi Board' },
    { id: '68be85d2094d08828defd235', name: 'Smörkniv Schwarzwolf Garmisch' },
    { id: '68be85d2094d08828defd370', name: 'Knivset' },
    { id: '68be85d3094d08828defdac0', name: 'Gourmet - 5st knivar i knivblock' },
    { id: '68be85d4094d08828defdc50', name: 'Sanjo Knivset i bambu' },
    { id: '68be85d4094d08828defdd9d', name: 'Santoku Knivblock i bambu' },
    { id: '68be85d4094d08828defe00c', name: 'Samos - Skinkbestick' },
    { id: '68be85df094d08828df00bbc', name: 'Akira Knivset' },
    { id: '68be85e0094d08828df00cb6', name: 'Akira kinesisk kockkniv' },
  ],

  // vattentata-vaskor (20 products)
  'vattentata-vaskor': [
    { id: '68be85be094d08828def7fc3', name: 'Camper 10 L vattentät outdoorbag' },
    { id: '68be85bf094d08828def8084', name: 'Drybag Ripstop 5L IPX6' },
    { id: '68be85bf094d08828def8086', name: 'Drybag Ripstop 10L IPX6' },
    { id: '68be85bf094d08828def8087', name: 'Drybag Ripstop 15L IPX6' },
    { id: '68be85bf094d08828def8089', name: 'Vattentät väska i PVC' },
    { id: '68be85bf094d08828def8098', name: 'Camper 10 L vattentät outdoorbag' },
    { id: '68be85bf094d08828def8099', name: 'Drybag Ripstop 5L IPX6' },
    { id: '68be85bf094d08828def809a', name: 'Drybag Ripstop 15L IPX6' },
    { id: '68be85bf094d08828def809b', name: 'Vattentät Ryggsäck SLX 25L' },
    { id: '68be85bf094d08828def809c', name: 'väska, fodral Vattentät' },
    { id: '68be85c0094d08828def86b7', name: 'Vattentät Ryggsäck SLX 25L' },
    { id: '68be85cd094d08828defb944', name: 'Fodral, väska vattentät för kamera' },
    { id: '68be85cd094d08828defb945', name: 'Tarp Roll-Top Backpack' },
    { id: '68be85e2094d08828df0149c', name: 'Drybag Ripstop 5L IPX6' },
    { id: '68be85e2094d08828df014b4', name: 'Drybag Ripstop 15L IPX6' },
    { id: '68be85e2094d08828df0155c', name: 'Drybag Ripstop 10L IPX6' },
    { id: '68be85e8094d08828df02619', name: 'Camper 10 L vattentät outdoorbag' },
    { id: '68be85e9094d08828df02c6f', name: 'Vattentät väska i PVC' },
    { id: '68be85e9094d08828df02cdc', name: 'Scuba - Vattentät väska PVC 10 L' },
    { id: '68be85eb094d08828df03083', name: 'väska, fodral Vattentät' },
  ],

  // mobilfodral (20 products)
  'mobilfodral': [
    { id: '68be85c0094d08828def85de', name: 'SBS Book Wallet Lite Case för Samsung Galaxy S22®. Svart' },
    { id: '68be85c0094d08828def85df', name: 'SBS Book Wallet Lite Case för Samsung Galaxy S21 FE®. Svart' },
    { id: '68be85c0094d08828def85e0', name: 'SBS Book Wallet Lite Case för iPhone 12 / 12 Pro®. Svart' },
    { id: '68be85cd094d08828defb8b0', name: 'Plånboksfodral i läder (iPhone) olika modeller' },
    { id: '68be85d2094d08828defd65d', name: 'Plånboksfodral i PU-läder (iPhone)' },
    { id: '68be85d2094d08828defd668', name: 'Plånboksfodral i läder (Samsung)' },
    { id: '68be85d2094d08828defd66b', name: 'Plånboksfodral i läder (Samsung)' },
    { id: '68be85d3094d08828defd8a8', name: 'Plånboksfodral i läder (Samsung)' },
    { id: '68be85d3094d08828defd8b5', name: 'Plånboksfodral i läder med magnet (iPhone) olika modeller' },
    { id: '68be85d4094d08828defdc0d', name: 'Plånboksfodral i läder med magnet (Samsung)' },
    { id: '68be85e4094d08828df01a3f', name: 'SBS Book Wallet Lite Case för Samsung Galaxy S22®. Svart' },
    { id: '68be85e4094d08828df01a45', name: 'SBS Book Wallet Lite Case för Samsung Galaxy S21 FE®. Svart' },
    { id: '68be85e4094d08828df01a46', name: 'SBS Book Wallet Lite Case för iPhone 13®. Svart' },
    { id: '68be85e4094d08828df01aa0', name: 'SBS Book Wallet Lite Case för Samsung Galaxy S23®. Svart' },
    { id: '68be85e4094d08828df01aa2', name: 'SBS Book Wallet Lite Case för iPhone 12 / 12 Pro®. Svart' },
    { id: '68be85e4094d08828df01aa4', name: 'SBS Novelty Book Wallet Lite Case för iPhone 14 / 13®. Svart' },
    { id: '68be85e4094d08828df01b2c', name: 'SBS Book Wallet Lite Case för iPhone 15®. Svart' },
    { id: '68be85e4094d08828df01b2d', name: 'SBS Novelty bookcover med löstagbart skal för iPhone 14 Plus®. Svart' },
    { id: '68be85e4094d08828df01b2e', name: 'SBS Book Wallet Lite Case för iPhone 15 Plus®. Svart' },
    { id: '68be85e4094d08828df01bc7', name: 'SBS Book Plånboksfodral med stativfunktion för iPhone 14/13. Svart' },
  ],

  // bladderblock (20 products)
  'bladderblock': [
    { id: '68be85c6094d08828def9ef2', name: 'Blädderblock Sketch Eco 5x20st' },
    { id: '68be85c6094d08828def9ef3', name: 'Blädderblock Sketch Eco rutigt 2x50st' },
    { id: '68be85c6094d08828def9ef4', name: 'Blädderblock Sketch Eco rutigt 5x20st' },
    { id: '68be85c6094d08828def9ef5', name: 'Blädderblock EARTH självh 50x58,5cm 6/fp' },
    { id: '68be85c6094d08828def9efb', name: 'Blädderblock LYRECO 78,80x59cm 70g 5/fp' },
    { id: '68be85c6094d08828def9efc', name: 'Blädderblock LYRECO 98x65cm rut 60g 5/fp' },
    { id: '68be85c6094d08828def9efd', name: 'Skrivbordsställ LEITZ Ergo Cosy stående' },
    { id: '68be85c6094d08828def9efe', name: 'Blädderblock LYRECO 90x65cm rut 70g 5/fp' },
    { id: '68be85c6094d08828def9eff', name: 'Blädderblock LYRECO 78,80x59cm 70g' },
    { id: '68be85c6094d08828def9f00', name: 'Skrivbordsställ LEITZ Ergo Cosy tang.bo' },
    { id: '68be85c6094d08828def9f0a', name: 'Blädderblock OXFORD SM 98x65cm olinj' },
    { id: '68be85c6094d08828def9f0d', name: 'Blädderblock TMP 60x84cm ol/l/rut 5/fp' },
    { id: '68be85c6094d08828def9f0f', name: 'Blädderblock TMP 55x75cm ol/l/rut 5/fp' },
    { id: '68be85c6094d08828def9f16', name: 'Magic-Chart flipchart film 60x80cm' },
    { id: '68be85c6094d08828def9f17', name: 'Blädderblock 55x75cm ol/l/rut 5/fp' },
    { id: '68be85c6094d08828def9f18', name: 'Blädderblock 60x85cm olinjerat 60g 5/fp' },
    { id: '68be85c6094d08828def9f19', name: 'Blädderblock 60x85cm olinjerat 80g 5/fp' },
    { id: '68be85c6094d08828def9f1b', name: 'Foliefilmrulle LEITZ vit 600mmx20m' },
    { id: '68be85c6094d08828def9f1d', name: 'Blädderblock TMP 59x80cm olinjerat 5/fp' },
    { id: '68be85c6094d08828def9f24', name: 'Blädderblock 60x85cm ol/rut 5/fp' },
  ],

  // vaderstationer-termometrar (20 products)
  'vaderstationer-termometrar': [
    { id: '68be85cd094d08828defb815', name: 'Zepra väderstation' },
    { id: '68be85cd094d08828defb816', name: 'Väderstation Calor' },
    { id: '68be85cd094d08828defb843', name: 'Väderstation Forecast' },
    { id: '68be85cd094d08828defb844', name: 'Väderstation Shiny day' },
    { id: '68be85cd094d08828defb845', name: 'Väderstation Colour' },
    { id: '68be85cd094d08828defb847', name: 'Väderstation Mix' },
    { id: '68be85cd094d08828defb848', name: 'DENE. Skridbords väderstation med aluminium och ABS LCD-skärm' },
    { id: '68be85cd094d08828defb849', name: 'Väderstation, digital, Griffin' },
    { id: '68be85cd094d08828defb84b', name: 'Digital väderstation' },
    { id: '68be85cd094d08828defb84c', name: 'Grundig väderstation, alarm och kalender' },
    { id: '68be85ce094d08828defc2ca', name: 'Väderstation av bambu Lane' },
    { id: '68be85cf094d08828defc7db', name: 'Florida väderstation' },
    { id: '68be85d1094d08828defd009', name: 'Väderstation i bambu Colton' },
    { id: '68be85d1094d08828defd1c3', name: 'Väderstation i bambu Piper' },
    { id: '68be85d2094d08828defd220', name: 'Väderstation av bambu Lia' },
    { id: '68be85d2094d08828defd251', name: 'Luce - Väckarklocka i  ABS/RPET' },
    { id: '68be85d2094d08828defd77f', name: 'BROMLEY. Skrivbords väderstation med LCD-skärm i ABS och bambu' },
    { id: '68be85d4094d08828defdd3e', name: 'Ferrel - Väderstation i bambu' },
    { id: '68be85d4094d08828defdd4e', name: 'Suncity - Väderstation i bambu' },
    { id: '68be85d4094d08828defdf2a', name: 'Hisa - Väderstation i bambu' },
  ],

  // tillbehor-resa (19 products)
  'tillbehor-resa': [
    { id: '68be85af094d08828def4bc2', name: 'SuitSave Skräddarsydd Resegarderob' },
    { id: '68be85af094d08828def4e49', name: 'Cozy - 2 i 1 resefilt set' },
    { id: '68be85be094d08828def7e56', name: 'Trip Aware flaskväska av återvunnet material på 2 l' },
    { id: '68be85be094d08828def7e57', name: 'Filla 5 ml bärbar påfyllningsbar parfymflaska' },
    { id: '68be85be094d08828def7eaf', name: 'SuitSave Skräddarsydd Resegarderob' },
    { id: '68be85ca094d08828defab07', name: 'Reporterväska Valet' },
    { id: '68be85cd094d08828defb989', name: 'CreaFelt Journey RPET reseorganisatör med tryck' },
    { id: '68be85cd094d08828defb9b3', name: 'Resekit packkuber' },
    { id: '68be85cd094d08828defbcc4', name: 'Tracks Passhållare' },
    { id: '68be85d1094d08828defd0df', name: 'Klädväskor, set av 3 Schwarzwolf KIOTARI (svarta)' },
    { id: '68be85d2094d08828defd3a8', name: 'BILBO. Rese sy-kit' },
    { id: '68be85d2094d08828defd6c0', name: 'Case Logic Invigo tillbehörsväska av återvunnet material' },
    { id: '68be85d2094d08828defd6c3', name: 'Case Logic Invigo återvunnen tillbehörsväska' },
    { id: '68be85d4094d08828defdf5a', name: 'Fragrano parfymflaska av bambu' },
    { id: '68be85d4094d08828defe08c', name: 'Compact - Kompakt sykit' },
    { id: '68be85d4094d08828defe0a3', name: 'OREN. Krok med karbinhake' },
    { id: '68be85d4094d08828defe12d', name: 'Lini - Syetui/Sykit' },
    { id: '68be85d5094d08828defe190', name: 'Mizer - Parfymflaska 10 ml' },
    { id: '68be85e8094d08828df0286a', name: 'Sneezie - Mini näsduk paket' },
  ],

  // disk-rengoring (19 products)
  'disk-rengoring': [
    { id: '68be85b1094d08828def5335', name: 'Disktrasa Standard 172x200 mm' },
    { id: '68be85b1094d08828def5337', name: 'Disktrasa Stor 303x258 mm' },
    { id: '68be85b1094d08828def5339', name: 'Dina Diskställ rullbart' },
    { id: '68be85ca094d08828defab98', name: 'Kitchen Hand Balm' },
    { id: '68be85ca094d08828defab99', name: 'Kitchen Hand Balm' },
    { id: '68be85ca094d08828defab9a', name: 'Kitchen Hand Balm' },
    { id: '68be85ca094d08828defab9b', name: 'Kitchen Hand Balm' },
    { id: '68be85ca094d08828defab9c', name: 'Kitchen Hand Balm' },
    { id: '68be85ca094d08828defab9d', name: 'Kitchen Hand Balm' },
    { id: '68be85ca094d08828defab9e', name: 'Kitchen Hand Balm' },
    { id: '68be85ca094d08828defab9f', name: 'Bottle Brush' },
    { id: '68be85ca094d08828defaba0', name: 'WashIt' },
    { id: '68be85de094d08828df00a65', name: 'Neutral - Disktrasa (2-pack)' },
    { id: '68be85de094d08828df00a66', name: 'Neutral - Disktrasa (2-pack)' },
    { id: '68be85df094d08828df00bc1', name: 'Dina Diskställ rullbart' },
    { id: '68be85e2094d08828df01581', name: 'Disktrasa Standard 172x200 mm' },
    { id: '68be85e2094d08828df01583', name: 'Disktrasa Stor 303x258 mm' },
    { id: '68be85e2094d08828df01585', name: 'Disktrasa Avlång 150x258 mm' },
    { id: '68be85e5094d08828df01ed8', name: 'Disktrasa 200x170 mm' },
  ],

  // namnbrickor (19 products)
  'namnbrickor': [
    { id: '68be85c6094d08828def9cef', name: 'Namnskylt DURABLE vridbart 60x90 25/fp' },
    { id: '68be85c6094d08828def9cf1', name: 'Namnskylt DURABLE A6 halsb. 10/fp' },
    { id: '68be85c6094d08828def9cf2', name: 'Namnskylt ACTUAL 90x57mm 50-pack' },
    { id: '68be85c6094d08828def9cf3', name: 'Namnskylt med hål A6 148x105mm 25/fp' },
    { id: '68be85c6094d08828def9cf5', name: 'Namnskylt LYRECO m.klämma 60x90mm 30/fp' },
    { id: '68be85c6094d08828def9cf6', name: 'Namnskylt LYRECO m.kläm/nå 40x75mm 50/fp' },
    { id: '68be85c6094d08828def9cf7', name: 'Namnskylt LYRECO m.kläm/nål 55x89 50/fp' },
    { id: '68be85c6094d08828def9cf8', name: 'Namnskylt med hål 74x105mm 25/fp' },
    { id: '68be85c6094d08828def9cf9', name: 'Namnskylt 54x90 med nål/klämma 50/fp' },
    { id: '68be85c6094d08828def9cfa', name: 'Namnskylt DURABLE magnet 90x54mm 10/fp' },
    { id: '68be85c6094d08828def9cfb', name: 'Namnskylt DURABLE clips stående25/fp' },
    { id: '68be85c6094d08828def9cfc', name: 'Namnskylt DURABLE 90x54mm 25/fp' },
    { id: '68be85c6094d08828def9cfd', name: 'Garderobsbricka onum. vit 90x57mm 25/fp' },
    { id: '68be85c6094d08828def9cfe', name: 'Namnskylt DURABLE clips liggande 25/fp' },
    { id: '68be85c6094d08828def9cff', name: 'Namnskylt DURABLE 75x40mm 25/fp' },
    { id: '68be85c6094d08828def9d00', name: 'Namnskylt DURABLE magnet 74x34mm10/fp' },
    { id: '68be85c6094d08828def9d01', name: 'Namnskylt DURABLE med nål 75x40mm 100/fp' },
    { id: '68be85c6094d08828def9d02', name: 'Namnskylt DURABLE m.magnet 17x67mm 25/fp' },
    { id: '68be85c6094d08828def9d03', name: 'Namnskylt DURABLE 90x60mm' },
  ],

  // burkar-matforvaring (18 products)
  'burkar-matforvaring': [
    { id: '68be85b1094d08828def5385', name: 'Poesia Glasburk på Fat' },
    { id: '68be85ca094d08828defab95', name: 'Large Jar' },
    { id: '68be85ca094d08828defab96', name: 'Ellen harburk med lock (6) Benvit' },
    { id: '68be85ca094d08828defac2f', name: 'Mepal Cirqula 1 250 ml multiskål' },
    { id: '68be85cb094d08828defb02b', name: 'Kashmir kryddhållare set' },
    { id: '68be85cd094d08828defbd01', name: 'Salladsskål i glas Isabeau' },
    { id: '68be85d0094d08828defc9b8', name: 'Lökgömma' },
    { id: '68be85d2094d08828defd625', name: 'JASMIN 800. Glasflaska med korklock 800 mL' },
    { id: '68be85d4094d08828defdc4e', name: 'Momomi XL Förvaringsburk i glas' },
    { id: '68be85d4094d08828defdd10', name: 'Momomi Förvaringsburk i glas' },
    { id: '68be85d4094d08828defdd20', name: 'Galangal kryddhållare set' },
    { id: '68be85d4094d08828defdf59', name: 'Lanai kryddhållare i glas' },
    { id: '68be85d4094d08828defe018', name: 'Rakel - Förvaringsburk - 200 ml' },
    { id: '68be85d4094d08828defe122', name: 'Noak - Förvaringsburk - 1 000 ml' },
    { id: '68be85d4094d08828defe123', name: 'Manne - Förvaringsburk - 700 ml' },
    { id: '68be85d4094d08828defe124', name: 'Rim - Förvaringsburk - 400 ml' },
    { id: '68be85d4094d08828defe128', name: 'Rita - Förvaringsburk - 150 ml' },
    { id: '68be85e9094d08828df02a1c', name: 'Poesia Glasburk på Fat' },
  ],

  // ekologiska-t-shirt (18 products)
  'ekologiska-t-shirt': [
    { id: '68be85b2094d08828def5885', name: 'Breda kortärmad T-shirt ekologisk bomull barn' },
    { id: '68be85b2094d08828def5886', name: 'Prince kortärmad piké ekologisk bomull herr' },
    { id: '68be85b2094d08828def5889', name: 'Azurite kortärmad herr ekologisk t-shirt' },
    { id: '68be85b2094d08828def589b', name: 'Sports T-shirt, herr' },
    { id: '68be85b2094d08828def589c', name: 'T-shirt Bio, dam' },
    { id: '68be85b2094d08828def589d', name: 'T-shirt Bio, herr' },
    { id: '68be85b5094d08828def610b', name: 'Sports T-shirt, herr' },
    { id: '68be85b7094d08828def6719', name: 'Breda kortärmad T-shirt ekologisk bomull barn' },
    { id: '68be85b7094d08828def671a', name: 'Prince kortärmad piké ekologisk bomull herr' },
    { id: '68be85b7094d08828def672f', name: 'Sports T-shirt, herr' },
    { id: '68be85b7094d08828def6730', name: 'T-shirt Bio, dam' },
    { id: '68be85b7094d08828def6731', name: 'T-shirt Bio, herr' },
    { id: '68be85b7094d08828def6841', name: 'Sports T-shirt, herr' },
    { id: '68be85b7094d08828def6842', name: 'T-shirt Bio, herr' },
    { id: '68be85df094d08828df00c5b', name: 'Breda kortärmad T-shirt ekologisk bomull barn' },
    { id: '68be85e0094d08828df00d70', name: 'Azurite kortärmad herr ekologisk t-shirt' },
    { id: '68be85e4094d08828df01ade', name: 'Breda kortärmad T-shirt ekologisk bomull barn' },
    { id: '68be85e4094d08828df01aec', name: 'Prince kortärmad piké ekologisk bomull herr' },
  ],

  // armbandsur (18 products)
  'armbandsur': [
    { id: '68be85c0094d08828def877c', name: 'Carpe Diem, Montmartre' },
    { id: '68be85c0094d08828def877d', name: 'Spectre' },
    { id: '68be85c0094d08828def877e', name: 'Turbo' },
    { id: '68be85c0094d08828def877f', name: '24H' },
    { id: '68be85c0094d08828def8780', name: 'Carpe Diem, Metal Freeze' },
    { id: '68be85c0094d08828def8781', name: 'Chrono Freeze' },
    { id: '68be85c0094d08828def8782', name: 'Carpe Diem, Funny' },
    { id: '68be85c0094d08828def8783', name: 'Carpe Diem, Giulia Leather' },
    { id: '68be85c0094d08828def8784', name: 'Dandy Silver' },
    { id: '68be85c0094d08828def8785', name: 'Dandy Gold' },
    { id: '68be85c0094d08828def8786', name: 'Carpe Diem, Giulia Metal' },
    { id: '68be85c0094d08828def8787', name: 'Carpe Diem, Manhattan' },
    { id: '68be85cd094d08828defb826', name: 'Carpe Diem, Chaudanne' },
    { id: '68be85cd094d08828defb827', name: 'Carpe Diem, Vauban' },
    { id: '68be85cd094d08828defb829', name: 'Bregille' },
    { id: '68be85cd094d08828defb82a', name: 'Chailluz' },
    { id: '68be85d4094d08828defdeae', name: 'Klocka Ferraghini Torello' },
    { id: '68be85d4094d08828defdeaf', name: 'Klocka Ferraghini Centurio' },
  ],

  // anslagstavlor (18 products)
  'anslagstavlor': [
    { id: '68be85c3094d08828def9257', name: 'Anslagstavla EARTH kork 120x90' },
    { id: '68be85c3094d08828def9258', name: 'Glasskåp NOBO Premium 4xA4' },
    { id: '68be85c3094d08828def9259', name: 'Anslagstavla kork 45x60cm' },
    { id: '68be85c3094d08828def925a', name: 'Anslagstavla 90x120cm' },
    { id: '68be85c3094d08828def925b', name: 'Anslagstavla 60x90cm' },
    { id: '68be85c3094d08828def925c', name: 'Anslagstavla 90x120cm' },
    { id: '68be85c3094d08828def925d', name: 'Anslagstavla kork 90x60cm' },
    { id: '68be85c3094d08828def925e', name: 'Anslagstavla kork 120x90cm' },
    { id: '68be85c3094d08828def925f', name: 'Anslagstavla kork träram 60x45cm' },
    { id: '68be85c3094d08828def9260', name: 'Anslagstavla 60x90cm' },
    { id: '68be85c3094d08828def9261', name: 'Anslagstavla 90x120cm' },
    { id: '68be85c3094d08828def9262', name: 'Anslagstavla väv m/träram 120x60cm' },
    { id: '68be85c3094d08828def9263', name: 'Anslagstavla 60x90cm' },
    { id: '68be85c3094d08828def9264', name: 'Anslagstavla kork träram 90x60cm' },
    { id: '68be85c3094d08828def9265', name: 'Anslagstavla väv m/träram 90x60cm' },
    { id: '68be85c3094d08828def9266', name: 'Anslagstavla kork 180x90 cm' },
    { id: '68be85c3094d08828def9267', name: 'Anslagstavla väv m/träram 60x40cm' },
    { id: '68be85c3094d08828def9268', name: 'Anslagstavla självhäftande 46x58cm Brun' },
  ],

  // skrivplattor (18 products)
  'skrivplattor': [
    { id: '68be85c4094d08828def9506', name: 'Skrivplatta EXACOMPTA enkel A4' },
    { id: '68be85c4094d08828def9507', name: 'Skrivplatta EXACOMPTA enkel A4' },
    { id: '68be85c4094d08828def9508', name: 'Skrivplatta enkel A4 PVC' },
    { id: '68be85c4094d08828def950a', name: 'Skrivplatta EXACOMPTA enkel A4' },
    { id: '68be85c4094d08828def950b', name: 'Skrivplatta enkel A4 PVC' },
    { id: '68be85c4094d08828def950c', name: 'Skrivplatta enkel 100 ark metall' },
    { id: '68be85c4094d08828def950e', name: 'Skrivplatta enkel 250 ark MDF' },
    { id: '68be85c4094d08828def9510', name: 'Skrivplatta BIGSO Knut 32x24cm' },
    { id: '68be85c4094d08828def9511', name: 'Skrivplatta A4 omslag PP svart' },
    { id: '68be85c4094d08828def9514', name: 'Skrivplatta A4' },
    { id: '68be85c4094d08828def9515', name: 'Skrivplatta LEITZ Solid A4 PF svart' },
    { id: '68be85c4094d08828def9516', name: 'Skrivplatta BIGSO Knut 32x24cm' },
    { id: '68be85c4094d08828def9519', name: 'Skrivplatta m/magnet KEBA A4 svart' },
    { id: '68be85c4094d08828def951b', name: 'Skrivplatta DURABLE visitkortsficka A5' },
    { id: '68be85c4094d08828def951c', name: 'Skrivplatta KEBA A3 stående svart' },
    { id: '68be85c4094d08828def951e', name: 'Skrivplatta KEBA A4 liggande svart' },
    { id: '68be85c4094d08828def951f', name: 'Skrivplatta BIGSO Knut kart sv. 32x24cm' },
    { id: '68be85c4094d08828def9528', name: 'Skrivplatta DURABLE 2332 svart' },
  ],

  // gatustall (18 products)
  'gatustall': [
    { id: '68be85c6094d08828def9e80', name: 'Gatuställ Alufjäder 70x100cm silver' },
    { id: '68be85c6094d08828def9e81', name: 'Gatuställ Sign 50x70cm' },
    { id: '68be85c6094d08828def9e82', name: 'Gatuställ Sign 50x70cm' },
    { id: '68be85c6094d08828def9e83', name: 'Gatuställ Sign 70x100cm' },
    { id: '68be85c6094d08828def9e84', name: 'Gatuställ Sign 70x100cm' },
    { id: '68be85c6094d08828def9e86', name: 'Gatuställ Sign 50x70cm' },
    { id: '68be85c6094d08828def9e87', name: 'Gatuställ Sign 50x70cm' },
    { id: '68be85c6094d08828def9e88', name: 'Gatuställ Windsign/Alufjäder 50x70cm' },
    { id: '68be85c6094d08828def9e89', name: 'Gatuställ Alu-Blackline 50x70 svart' },
    { id: '68be85c6094d08828def9e8b', name: 'Gatuställ Gotik 70x100cm' },
    { id: '68be85c6094d08828def9e8c', name: 'Fotring för gatuställ 50x70 svart' },
    { id: '68be85c6094d08828def9e8d', name: 'Gatuställ A3 liggande vit "Mäklarställ"' },
    { id: '68be85c6094d08828def9e8e', name: 'Gatuställ Alusign/Alu-line 50x70' },
    { id: '68be85c6094d08828def9e8f', name: 'Gatuställ Gotik 70x100cm' },
    { id: '68be85c6094d08828def9e90', name: 'Gatuställ Griffel 45x73' },
    { id: '68be85c6094d08828def9e91', name: 'Gatuställ Gotic 50x70cm rundfot svart' },
    { id: '68be85c6094d08828def9e92', name: 'Gatuställ Gotic 70x100 rundfot svart' },
    { id: '68be85c6094d08828def9e93', name: 'Gatuställ Gotik 50X70cm vit' },
  ],

  // manikyr (17 products)
  'manikyr': [
    { id: '68be85ad094d08828def47a6', name: 'RASPERA. Nagelfil i glas' },
    { id: '68be85bd094d08828def7b73', name: 'NADIA. 4-delars manikyrset' },
    { id: '68be85bd094d08828def7b74', name: 'RASPERA. Nagelfil i glas' },
    { id: '68be85bd094d08828def7b75', name: 'Missy' },
    { id: '68be85ce094d08828defc424', name: 'Bambu manikyrset Lydia' },
    { id: '68be85ce094d08828defc53a', name: 'Maracu RABS manikyrset' },
    { id: '68be85d1094d08828defcff2', name: 'Manoky manikyrset i bambu' },
    { id: '68be85d3094d08828defdb7e', name: 'Sewa - Manikyrset' },
    { id: '68be85d4094d08828defdc06', name: 'Tidaholm - Manikyrset' },
    { id: '68be85d4094d08828defddc3', name: 'DIAZ. Manikyrset i fem delar med nagelfil' },
    { id: '68be85d4094d08828defdee0', name: 'Amuren manikyrset' },
    { id: '68be85d4094d08828defdf72', name: 'Lilly - Manikyrset' },
    { id: '68be85d5094d08828defe1ac', name: 'Fenicul manikyrset' },
    { id: '68be85d5094d08828defe1ad', name: 'Manikyrset i påse PVC Blake' },
    { id: '68be85d5094d08828defe1ae', name: 'Ricardo by Richartz Manikyrset' },
    { id: '68be85d5094d08828defe1af', name: 'Ricardo by Richartz Resekit' },
    { id: '68be85e3094d08828df0178d', name: 'Nagelfil med tryck' },
  ],

  // reseplanbocker (17 products)
  'reseplanbocker': [
    { id: '68be85ad094d08828def4821', name: 'Florens, passfodral/korthållare' },
    { id: '68be85af094d08828def4ec3', name: 'Passpu RPU-passfodral' },
    { id: '68be85b0094d08828def5113', name: 'rPET reseplånbok Susanne' },
    { id: '68be85be094d08828def7e83', name: 'Ross GRS RPET RFID-passhållare' },
    { id: '68be85be094d08828def7e84', name: 'AIRLINE. 600D resedokumentväska' },
    { id: '68be85be094d08828def7e85', name: 'Identify GRS RPET Felt passfodral' },
    { id: '68be85be094d08828def7e86', name: 'rPET reseplånbok Susanne' },
    { id: '68be85be094d08828def7e87', name: 'Florens, passfodral/korthållare' },
    { id: '68be85cb094d08828defacd5', name: 'BrandCharger Rover reseplånbok' },
    { id: '68be85cd094d08828defb9a4', name: 'Car dokumentmapp' },
    { id: '68be85ce094d08828defc2af', name: 'Corkpass - Passhållare i kork' },
    { id: '68be85d1094d08828defceeb', name: 'Jettag - Set för pass och bagagebricka' },
    { id: '68be85d1094d08828defd068', name: 'CreaFelt Pass RPET-passfodral med tryck' },
    { id: '68be85de094d08828df00947', name: 'Identify GRS RPET Felt passfodral' },
    { id: '68be85e0094d08828df00e06', name: 'Recycled Leather Passport Holder passfodral' },
    { id: '68be85e8094d08828df0293b', name: 'Recycled Leather Passport Holder passfodral' },
    { id: '68be85eb094d08828df030d9', name: 'Ross GRS RPET RFID-passhållare' },
  ],

  // speglar (17 products)
  'speglar': [
    { id: '68be85ae094d08828def49dc', name: 'Remake RPS fickspegel' },
    { id: '68be85bd094d08828def7b29', name: 'Glow - Dubbel magnetisk spegel' },
    { id: '68be85bd094d08828def7b2a', name: 'Glow Round - Spegel' },
    { id: '68be85bd094d08828def7b2b', name: 'STREEP. Smink spegel' },
    { id: '68be85bd094d08828def7b2c', name: 'See Me spegel' },
    { id: '68be85bd094d08828def7b2d', name: 'Pollux fickspegel' },
    { id: '68be85bd094d08828def7b2e', name: 'Remake RPS fickspegel' },
    { id: '68be85cf094d08828defc67a', name: 'Fickspegel i bambu Jeremiah' },
    { id: '68be85d2094d08828defd558', name: 'SHIMMER. Dubbel fickspegel i metall' },
    { id: '68be85d4094d08828defdd35', name: 'TILBURY. Dubbel fickspegel i kork' },
    { id: '68be85d4094d08828defddda', name: 'Malay - Sminkspegel i bambu' },
    { id: '68be85d4094d08828defddea', name: 'Pamela - Sminkspegel' },
    { id: '68be85d4094d08828defdef8', name: 'PIAF. Smink spegel' },
    { id: '68be85d4094d08828defe015', name: 'Duni - Spegel' },
    { id: '68be85d4094d08828defe027', name: 'Lustre spegel av bambu' },
    { id: '68be85e9094d08828df02c29', name: 'Glow - Dubbel magnetisk spegel' },
    { id: '68be85e9094d08828df02ce1', name: 'Glow Round - Spegel' },
  ],

  // brandskydd (17 products)
  'brandskydd': [
    { id: '68be85af094d08828def4d88', name: 'Brandsläckare 2 Kg' },
    { id: '68be85af094d08828def4d8b', name: 'Brandfilt 120 x 120 cm' },
    { id: '68be85af094d08828def4d8c', name: 'Brandfilt 120 x 180 cm' },
    { id: '68be85af094d08828def4e4d', name: 'Brandsläckare 6 Kg' },
    { id: '68be85af094d08828def4e50', name: 'Brandfilt (180 cm) i canvasfodral' },
    { id: '68be85bd094d08828def7ad5', name: 'Brandsläckare 2 Kg' },
    { id: '68be85bd094d08828def7ad6', name: 'Brandfilt 120 x 120 cm' },
    { id: '68be85bd094d08828def7ad7', name: 'Brandfilt 120 x 180 cm' },
    { id: '68be85bd094d08828def7ad8', name: 'Brandsläckare 6 Kg' },
    { id: '68be85bd094d08828def7ad9', name: 'Brandfilt Mocka' },
    { id: '68be85d1094d08828defcdf3', name: 'Brandfilt (120 cm) i canvasfodral' },
    { id: '68be85d1094d08828defcdff', name: 'Brandfiltsfodral med fotomotiv (120x180 cm brandfilt)' },
    { id: '68be85d1094d08828defcebd', name: 'Brandfilt (120 cm) i canvasfodral' },
    { id: '68be85d1094d08828defcec6', name: 'Brandsläckare 6 Kg' },
    { id: '68be85d1094d08828defcf69', name: 'Brandvarnare 1 år' },
    { id: '68be85d1094d08828defcf6e', name: 'Brandfiltsfodral med fotomotiv (120x120 cm brandfilt)' },
    { id: '68be85d1094d08828defcf7e', name: 'Brandsläckare 2 Kg' },
  ],

  // mobilfickor (17 products)
  'mobilfickor': [
    { id: '68be85c0094d08828def85d1', name: 'Korthållare med Lycra' },
    { id: '68be85c0094d08828def85d2', name: 'Mobilficka silikon' },
    { id: '68be85c0094d08828def85d3', name: 'Slip - Visitkortsfodral för mobil' },
    { id: '68be85c0094d08828def85d4', name: 'SHELLEY. Silikonkorthållare för smartphone' },
    { id: '68be85c0094d08828def85d5', name: 'PopSockets® PopWallet+ korthållare med PopGrip' },
    { id: '68be85cd094d08828defb8b1', name: 'DuPont? Tyvek® Card Holder Magnet' },
    { id: '68be85cd094d08828defb8b2', name: 'Magsafe Card Holder' },
    { id: '68be85cd094d08828defb8b3', name: 'C-Secure MagSafe-telefonplånbok' },
    { id: '68be85ce094d08828defc534', name: 'Wallk - Kontokortshållare i kork/RFID' },
    { id: '68be85ce094d08828defc536', name: 'Leamag - Magnetisk PU-korthållare' },
    { id: '68be85d0094d08828defcda0', name: 'Korthållare i PVC Quinn' },
    { id: '68be85d1094d08828defce5e', name: 'Wecca kreditkortshållare' },
    { id: '68be85e2094d08828df014a5', name: 'Mobilficka silikon' },
    { id: '68be85e5094d08828df01e8a', name: 'PopSockets® PopWallet+ korthållare med PopGrip' },
    { id: '68be85e8094d08828df026a2', name: 'Korthållare med Lycra' },
    { id: '68be85e8094d08828df027c0', name: 'Korthållare silikon' },
    { id: '68be85e9094d08828df02a7b', name: 'Slip - Visitkortsfodral för mobil' },
  ],

  // block-ovriga (17 products)
  'block-ovriga': [
    { id: '68be85c2094d08828def8f36', name: 'Blockkubhållare DURABLE 90x90mm 800ark g' },
    { id: '68be85c2094d08828def8f37', name: 'Blockkubhåll Pepperpot 90x90 800ark vit' },
    { id: '68be85c2094d08828def8f38', name: 'Blockkub Pepperpot 90x90 800ark färg' },
    { id: '68be85c3094d08828def9052', name: 'Blockkub Pepperpot 90x90 800ark vit' },
    { id: '68be85c3094d08828def9053', name: 'Kollegieblock FW A5 60g 70bl rut' },
    { id: '68be85c3094d08828def9054', name: 'Skissblock GRIEG A3 stående 150g svart' },
    { id: '68be85c3094d08828def9055', name: 'Blockkub 90x90mm 800ark färgat' },
    { id: '68be85c3094d08828def9057', name: 'Blockkub 100x100x50mm 500ark vit' },
    { id: '68be85c3094d08828def9058', name: 'Skissblock GRIEG A4 liggande 150g svart' },
    { id: '68be85c3094d08828def9059', name: 'Kollegieblock FW A4 60g 70bl rut gul' },
    { id: '68be85c3094d08828def905c', name: 'Kollegieblock FW A4 60g 70bl linj h' },
    { id: '68be85c3094d08828def905d', name: 'Blockkubhåll Pepperpot 90x90 850ark färg' },
    { id: '68be85c3094d08828def905f', name: 'Skissblock GRIEG A5 liggande 150g svart' },
    { id: '68be85c3094d08828def9060', name: 'Blockkub 90x90mm 500ark färgat' },
    { id: '68be85c3094d08828def9063', name: 'Blockkub Pepperpot 90x90 500ark vit' },
    { id: '68be85c3094d08828def9065', name: 'Spiralkladd 96 blad 148x295mm linjerat' },
    { id: '68be85c3094d08828def9066', name: 'Skissblock GRIEG A5 stående 150g svart' },
  ],

  // moss-tangentbord (16 products)
  'moss-tangentbord': [
    { id: '68be85ad094d08828def4789', name: 'Curvy C - Trådlös mus uppladdningsbar' },
    { id: '68be85ad094d08828def4841', name: 'Wlick optisk mus' },
    { id: '68be85c0094d08828def869a', name: 'Curvy - Trådlös mus' },
    { id: '68be85c0094d08828def869b', name: 'Curvy C - Trådlös mus uppladdningsbar' },
    { id: '68be85c0094d08828def869c', name: 'Mus trådlös optisk i ABS Jodi' },
    { id: '68be85c0094d08828def869d', name: 'Trådlös mus Sinou' },
    { id: '68be85c0094d08828def869e', name: 'Wlick optisk mus' },
    { id: '68be85cc094d08828defb0cc', name: 'ABS trådlös mus Eileen' },
    { id: '68be85cd094d08828defb87b', name: 'Sakkum optisk mus' },
    { id: '68be85cd094d08828defb87c', name: 'Caret optisk mus' },
    { id: '68be85cd094d08828defb87d', name: 'Datormus' },
    { id: '68be85cd094d08828defb87e', name: 'RGB gaming mus' },
    { id: '68be85d2094d08828defd5c3', name: 'Curvy Bam - Trådlös mus i bambu/ABS' },
    { id: '68be85d3094d08828defdb26', name: 'Sikkim optisk mus' },
    { id: '68be85e9094d08828df02cd4', name: 'Curvy - Trådlös mus' },
    { id: '68be85e9094d08828df02d14', name: 'Mus trådlös optisk i ABS Jodi' },
  ],

  // grytlappar-grytvantar (16 products)
  'grytlappar-grytvantar': [
    { id: '68be85af094d08828def4cff', name: 'Ugnsvantar i bomull Elsie' },
    { id: '68be85af094d08828def4d0e', name: 'Basquiat Kitchen Glove' },
    { id: '68be85af094d08828def4d13', name: 'Titian Kitchen Glove' },
    { id: '68be85b1094d08828def5417', name: 'Grytlappar 2-pack' },
    { id: '68be85b1094d08828def5418', name: 'Ugnsvantar i bomull Elsie' },
    { id: '68be85b1094d08828def541b', name: 'Grytlappar 2-pack' },
    { id: '68be85b1094d08828def541d', name: 'Titian Kitchen Glove' },
    { id: '68be85b1094d08828def541f', name: 'Basquiat Kitchen Glove' },
    { id: '68be85b1094d08828def5420', name: 'Challah ugnshandske' },
    { id: '68be85b1094d08828def546d', name: 'Grytlappar 2-pack' },
    { id: '68be85ca094d08828defa9c1', name: 'Handtagsskydd' },
    { id: '68be85d0094d08828defcca1', name: 'Brioche RPET ugnshandske' },
    { id: '68be85d2094d08828defd20b', name: 'PICOTTI. Kökshandskar' },
    { id: '68be85df094d08828df00b66', name: 'Lyxig canvas grytvante' },
    { id: '68be85e9094d08828df02aa3', name: 'Grytlappar 2-pack' },
    { id: '68be85e9094d08828df02b8f', name: 'Challah ugnshandske' },
  ],

  // herr-t-shirt (16 products)
  'herr-t-shirt': [
    { id: '68be85b7094d08828def6779', name: 'Original T-Shirts' },
    { id: '68be85b7094d08828def677d', name: 'Rock T' },
    { id: '68be85b7094d08828def6780', name: 'Printer RED - Run' },
    { id: '68be85b7094d08828def6781', name: 'Basic-T' },
    { id: '68be85b7094d08828def67af', name: 'Boston T-shirt' },
    { id: '68be85b7094d08828def67b6', name: 'Basic-T' },
    { id: '68be85b7094d08828def6829', name: 'Original T-Shirts' },
    { id: '68be85b7094d08828def682c', name: 'Rock T' },
    { id: '68be85b7094d08828def683a', name: 'Original' },
    { id: '68be85b7094d08828def683b', name: 'Workwear T-Shirt, herr' },
    { id: '68be85b7094d08828def683e', name: 'Monza T-shirt' },
    { id: '68be85b7094d08828def6840', name: 'T-shirt Superstar' },
    { id: '68be85b8094d08828def6913', name: 'Printer - Heavy V-neck' },
    { id: '68be85e2094d08828df013b0', name: 'Original T-Shirts' },
    { id: '68be85e5094d08828df01e3a', name: 'Printer - Heavy T-shirt Rsx' },
    { id: '68be85e5094d08828df01f1b', name: 'Printer - Heavy V-neck' },
  ],

  // magnet-ramar (16 products)
  'magnet-ramar': [
    { id: '68be85c3094d08828def9275', name: 'Plastficka rPET A3 magnetisk 5/fp' },
    { id: '68be85c3094d08828def9276', name: 'Plastficka rPET A4 magnetisk 5/fp' },
    { id: '68be85c3094d08828def9277', name: 'Magnetram DJOIS solo A3 röd/vit 2/fp' },
    { id: '68be85c3094d08828def9278', name: 'Magnetram DURAFRAME A4 silv 5/fp' },
    { id: '68be85c3094d08828def9279', name: 'Frontplast magnetband 70x100cm 0,5mm' },
    { id: '68be85c3094d08828def927a', name: 'Magnetram DURAFRAME MAGNETIC A3 sva 5/fp' },
    { id: '68be85c3094d08828def927c', name: 'Magnetram DURAFRAME A6 svart 2/fp' },
    { id: '68be85c3094d08828def927d', name: 'Frontplast 50x70cm med magnet' },
    { id: '68be85c3094d08828def927e', name: 'Magnetram självh. DJOIS A4 svart 2/fp' },
    { id: '68be85c3094d08828def927f', name: 'Magnetram DURAFRAME SUN UV A4 2/fp' },
    { id: '68be85c3094d08828def9280', name: 'Magnetram DURAFRAME SUN UV A3 svart 2/fp' },
    { id: '68be85c3094d08828def9282', name: 'Magnetram självh.DURAFRAME A4 svart 2/fp' },
    { id: '68be85c3094d08828def9283', name: 'Magnetram självh.DURAFRAME A4 silv 2/fp' },
    { id: '68be85c3094d08828def9284', name: 'Magnetram självh.DURAFRAME A5 silv 2/fp' },
    { id: '68be85c3094d08828def9285', name: 'Magnetram självh.DURAFRAME A5 svart 2/fp' },
    { id: '68be85c3094d08828def9286', name: 'Magnetram självh.DURAFRAME A3 svart 2/fp' },
  ],

  // pappersklammor (16 products)
  'pappersklammor': [
    { id: '68be85c4094d08828def94c0', name: 'Pappersklämma Foldback 19mm' },
    { id: '68be85c4094d08828def94c1', name: 'Pappersklämma LYRECO foldback 41mm 12/fp' },
    { id: '68be85c4094d08828def94c2', name: 'Pappersklämma BULL DOG metall 50mm 12/fp' },
    { id: '68be85c4094d08828def94c3', name: 'Pappersklämma med fjäder 114mm' },
    { id: '68be85c4094d08828def94c4', name: 'Pappersklämma LYRECO foldback 25mm 12/fp' },
    { id: '68be85c4094d08828def94c5', name: 'Pappersklämma LYRECO bulldog 75mm' },
    { id: '68be85c4094d08828def94c6', name: 'Pappersklämma LYRECO bulldog 31mm 12/fp' },
    { id: '68be85c4094d08828def94c7', name: 'Pappersklämma m. hål WESTCOTT 31mm 10/fp' },
    { id: '68be85c4094d08828def94c8', name: 'Pappersklämma m.hål WESTCOTT 65mm 10/fp' },
    { id: '68be85c4094d08828def94c9', name: 'Pappersklämma m.hål WESTCOTT 51mm 10/fp' },
    { id: '68be85c4094d08828def94ca', name: 'Pappersklämma m.hål WESTCOTT 75mm 10/fp' },
    { id: '68be85c4094d08828def94cb', name: 'Pappersklämma LAUREL plast 25x43mm' },
    { id: '68be85c4094d08828def94cc', name: 'Pappersklämma LAUREL plast 80x26mm' },
    { id: '68be85c4094d08828def94cd', name: 'Pappersklämma magnet 53mm' },
    { id: '68be85c4094d08828def94ce', name: 'Papperssamlare 100/fp' },
    { id: '68be85c4094d08828def94cf', name: 'Pappershållare Varioclip 60x27mm 5/fp' },
  ],

  // padel (15 products)
  'padel': [
    { id: '68be85b0094d08828def5100', name: 'Setty - Set med pickleballpaddel' },
    { id: '68be85be094d08828def7d76', name: 'Setty - Set med pickleballpaddel' },
    { id: '68be85be094d08828def7d77', name: 'Overgrip ring' },
    { id: '68be85be094d08828def7d78', name: 'Pine Valley padelbag' },
    { id: '68be85be094d08828def7d7a', name: 'Harlem Padel väska' },
    { id: '68be85cd094d08828defba11', name: 'Pro Padelbollar' },
    { id: '68be85cd094d08828defba12', name: 'Pine Valley Footprint overgrip' },
    { id: '68be85cd094d08828defba13', name: 'Pine Valley Smile overgrip' },
    { id: '68be85cd094d08828defba15', name: 'Exel Snadi Junior' },
    { id: '68be85cd094d08828defba16', name: 'Padelracks fodral' },
    { id: '68be85cd094d08828defba18', name: 'Padelbollar med tryck' },
    { id: '68be85cd094d08828defba19', name: 'Padel grepp med logo tryck' },
    { id: '68be85cd094d08828defba1a', name: 'Harlem Padel Nirvana 12K' },
    { id: '68be85cd094d08828defba1b', name: 'Harlem Padel Helix Pro' },
    { id: '68be85cd094d08828defba1c', name: 'Harlem Padel Euphoria Pro' },
  ],

  // dam-t-shirt (15 products)
  'dam-t-shirt': [
    { id: '68be85b4094d08828def6075', name: 'Printer RED - Run Lady' },
    { id: '68be85b7094d08828def6759', name: 'Basic-T, dam' },
    { id: '68be85b7094d08828def675a', name: 'Rock T Lady' },
    { id: '68be85b7094d08828def675c', name: 'Printer - Heavy T-shirt Lady' },
    { id: '68be85b7094d08828def675f', name: 'Printer - Heavy V-neck Lady' },
    { id: '68be85b7094d08828def6761', name: 'Printer RED - Run Lady' },
    { id: '68be85b7094d08828def6767', name: 'Workwear T-Shirt, dam' },
    { id: '68be85b7094d08828def6768', name: 'T-shirt Loose Fit Dam' },
    { id: '68be85b7094d08828def676a', name: 'T-shirt Stretch Dam' },
    { id: '68be85b7094d08828def67b4', name: 'Printer RED - Run Lady' },
    { id: '68be85b7094d08828def67b7', name: 'Basic-T, dam' },
    { id: '68be85b7094d08828def6828', name: 'T-shirt Long Length Dam' },
    { id: '68be85b7094d08828def682b', name: 'Rock T Lady' },
    { id: '68be85e5094d08828df01e3d', name: 'Printer - Heavy T-shirt Lady' },
    { id: '68be85e5094d08828df01e48', name: 'Printer - Heavy V-neck Lady' },
  ],

  // piketrojor-herr (15 products)
  'piketrojor-herr': [
    { id: '68be85b5094d08828def6345', name: 'Men"s Classic Polo' },
    { id: '68be85b5094d08828def6347', name: 'Original Pique' },
    { id: '68be85b5094d08828def6350', name: 'Men"s classic fit tipped polo' },
    { id: '68be85b5094d08828def6351', name: 'Printer - Surf Rsx' },
    { id: '68be85b5094d08828def6352', name: 'Klassisk piké, herr' },
    { id: '68be85b5094d08828def6354', name: 'Printer - Surf Pro Rsx' },
    { id: '68be85b5094d08828def6355', name: 'Printer - Surf Stretch' },
    { id: '68be85b5094d08828def6445', name: 'Men"s classic fit contrast polo' },
    { id: '68be85b5094d08828def6446', name: 'Herrpiké Basic Bio' },
    { id: '68be85b5094d08828def644a', name: 'Workwear piké, herr' },
    { id: '68be85ba094d08828def708e', name: 'Original Pique' },
    { id: '68be85e2094d08828df013af', name: 'Original Pique' },
    { id: '68be85e5094d08828df01e43', name: 'Printer - Surf Rsx' },
    { id: '68be85e5094d08828df01e50', name: 'Printer - Surf Pro Rsx' },
    { id: '68be85e5094d08828df01e52', name: 'Printer - Surf Stretch' },
  ],

  // varmedynor (15 products)
  'varmedynor': [
    { id: '68be85bd094d08828def7adc', name: 'HeatPad värmedyna' },
    { id: '68be85bd094d08828def7add', name: 'Relief värmepaket' },
    { id: '68be85bd094d08828def7ade', name: 'Heapsule varm-kall förpackning' },
    { id: '68be85bd094d08828def7adf', name: 'Soothing värmepaket' },
    { id: '68be85d2094d08828defd2cc', name: 'LOVELY. Värmepåse i PVC' },
    { id: '68be85d3094d08828defd7c7', name: 'Värmedyna' },
    { id: '68be85d4094d08828defdcda', name: 'Plint - Handvärmare' },
    { id: '68be85d4094d08828defde98', name: 'Level - Kyl/värmedyna' },
    { id: '68be85d4094d08828defdf92', name: 'CORDEN. Värmepåse i PVC' },
    { id: '68be85d5094d08828defe1c6', name: 'Hot&Cold Pack värmedyna' },
    { id: '68be85e6094d08828df02278', name: 'Relief värmepaket' },
    { id: '68be85e6094d08828df022ec', name: 'Heapsule varm-kall förpackning' },
    { id: '68be85e6094d08828df02378', name: 'Heapsule varm-kall förpackning' },
    { id: '68be85e7094d08828df0241e', name: 'Soothing värmepaket' },
    { id: '68be85e8094d08828df028f4', name: 'Värmekudde, i PVC, Charles' },
  ],

  // haftapparater-manuella (15 products)
  'haftapparater-manuella': [
    { id: '68be85c3094d08828def92b7', name: 'Blockhäftare LYRECO HD100 grå' },
    { id: '68be85c3094d08828def92b8', name: 'Blockhäftare RAPID Duax grå/orange' },
    { id: '68be85c3094d08828def92c0', name: 'Blockhäftare LYRECO HD200 ljusgrå/svart' },
    { id: '68be85c3094d08828def92c1', name: 'Blockhäftare ACTUAL Power 200' },
    { id: '68be85c3094d08828def92c3', name: 'Akthäftare LYRECO 40ark svart' },
    { id: '68be85c4094d08828def944a', name: 'Blockhäftare LEITZ HD120 grå' },
    { id: '68be85c4094d08828def944d', name: 'Blockhäftare LEITZ 80 ark silver' },
    { id: '68be85c4094d08828def944f', name: 'Akthäftare RAPID HD12 40ark 400mm svart' },
    { id: '68be85c4094d08828def9451', name: 'Akthäftare RAPID E15 12tum' },
    { id: '68be85c4094d08828def9452', name: 'Blockhäftare RAPID HD210 svart/grå' },
    { id: '68be85c4094d08828def9455', name: 'Blockhäftare RAPID HD110 svart/grå' },
    { id: '68be85c4094d08828def9457', name: 'Blockhäftare RAPID HD9 110 ark svart' },
    { id: '68be85c4094d08828def9459', name: 'Akthäftare RAPID HD12 40ark 300mm svart' },
    { id: '68be85c4094d08828def945a', name: 'Blockhäftare LEITZ FC5552 silver' },
    { id: '68be85c4094d08828def9466', name: 'Blockhäftare RAPID HD70 grå/orange' },
  ],

  // bladderblockstall (15 products)
  'bladderblockstall': [
    { id: '68be85c6094d08828def9f54', name: 'Blädderblocksställ Sketch Pro' },
    { id: '68be85c6094d08828def9f55', name: 'Blädderblocksställ Sketch Pro mobil' },
    { id: '68be85c6094d08828def9f56', name: 'Blädderblocksställ Sketch Pro mobil rund' },
    { id: '68be85c6094d08828def9f57', name: 'Blädderblocksställ Mobile' },
    { id: '68be85c6094d08828def9f58', name: 'Pappershållare WOODEN magnetisk 2/fp' },
    { id: '68be85c6094d08828def9f59', name: 'Blädderblocksställ NOBO Glas 70x100' },
    { id: '68be85c6094d08828def9f5a', name: 'Blädderblocksställ Pro mobil magnetisk' },
    { id: '68be85c6094d08828def9f5b', name: 'Blädderblocksställ mobil magnetisk' },
    { id: '68be85c6094d08828def9f5c', name: 'Blädderblocksställ Tripod magnetisk' },
    { id: '68be85c6094d08828def9f5d', name: 'Blädderblocksställ ECO Popiel' },
    { id: '68be85c6094d08828def9f5e', name: 'Blädderblocksställ Easy Tripod' },
    { id: '68be85c6094d08828def9f5f', name: 'Blädderblocksställ Pro Tripod magnetisk' },
    { id: '68be85c6094d08828def9f60', name: 'Blädderblocksställ Barracuda stål Mobil' },
    { id: '68be85c6094d08828def9f61', name: 'Blädderblocksställ NOBO Classic Tripod' },
    { id: '68be85c6094d08828def9f62', name: 'Blädderblocksställ NOBO Classic Mobil' },
  ],

  // kartnalar (15 products)
  'kartnalar': [
    { id: '68be85c6094d08828def9f79', name: 'Kartnålar cylinderformade 25/fp' },
    { id: '68be85c6094d08828def9f7a', name: 'Kartnålar cylinderformade 25/fp' },
    { id: '68be85c6094d08828def9f7c', name: 'Kartnålar ACTUAL cylinderformad 30/fp' },
    { id: '68be85c6094d08828def9f7d', name: 'Kartnålar ACTUAL cylinderformad 30/fp' },
    { id: '68be85c6094d08828def9f7e', name: 'Kartnålar ACTUAL cylinderformad 30/fp' },
    { id: '68be85c6094d08828def9f7f', name: 'Kartnålar WOODEN 25/fp' },
    { id: '68be85c6094d08828def9f80', name: 'Kartnålar ACTUAL runda 100/fp' },
    { id: '68be85c6094d08828def9f81', name: 'Kartnålar ACTUAL runda 100/fp' },
    { id: '68be85c6094d08828def9f82', name: 'Kartnål ACTUAL cylindf. sort färg100/fp' },
    { id: '68be85c6094d08828def9f83', name: 'Kartnål EXACOMPTA 10mm sort.färg 200/fp' },
    { id: '68be85c6094d08828def9f84', name: 'Kartnålar ACTUAL runda 100/fp' },
    { id: '68be85c6094d08828def9f85', name: 'Kartnålar ACTUAL runda 100/fp' },
    { id: '68be85c6094d08828def9f86', name: 'Kartnål EXACOMPTA 10mm sort.färg 25/fp' },
    { id: '68be85c6094d08828def9f87', name: 'Kartnål EXACOMPTA 4mm sort.färg 100/fp' },
    { id: '68be85c6094d08828def9f88', name: 'Kartnålar Push-pin transparent 25/fp' },
  ],

  // husdjurstillbehor (14 products)
  'husdjurstillbehor': [
    { id: '68be85ad094d08828def4882', name: 'Kolapdier - Bärbar skål för husdjur 350 ml' },
    { id: '68be85ad094d08828def48db', name: 'Chappy hundskål' },
    { id: '68be85be094d08828def7c34', name: 'Kolapdier - Bärbar skål för husdjur 350 ml' },
    { id: '68be85be094d08828def7c39', name: 'Belka' },
    { id: '68be85be094d08828def7c3b', name: 'Chappy hundskål' },
    { id: '68be85cd094d08828defba4e', name: 'Doggo RSS hundbricka' },
    { id: '68be85cf094d08828defc7e5', name: 'Ziggy hundhalsband med tryck' },
    { id: '68be85d0094d08828defcaed', name: 'Turtle Care Desinfektion Hovar (250ml)' },
    { id: '68be85d0094d08828defcafd', name: 'Turtle Care Hundar (250 ml)' },
    { id: '68be85d0094d08828defcce0', name: 'Turtle Care Sårtvätt för Hästar (250ml)' },
    { id: '68be85d4094d08828defde33', name: 'AC gästparaply FARE- DoggyBrella' },
    { id: '68be85de094d08828df00768', name: 'Koda hundskål' },
    { id: '68be85e6094d08828df02379', name: 'Rex hundhalsband' },
    { id: '68be85e7094d08828df0246a', name: 'Koda hundskål' },
  ],

  // korrigeringsroller (14 products)
  'korrigeringsroller': [
    { id: '68be85c6094d08828def9e62', name: 'Korr.roller refill LYRECO 4,2x10m' },
    { id: '68be85c6094d08828def9e63', name: 'Korr.roller LYRECO 4,2mmx12m' },
    { id: '68be85c6094d08828def9e64', name: 'Korr.roller PRITT CompactFlex 6mmx10m' },
    { id: '68be85c6094d08828def9e65', name: 'Korrigeringsroller ACTUAL 5mmx6m' },
    { id: '68be85c6094d08828def9e66', name: 'Korr.roller LYRECO 4,2mmx8,5m' },
    { id: '68be85c6094d08828def9e68', name: 'Korr.roller PRITT Flex 4,2mmx12m' },
    { id: '68be85c6094d08828def9e69', name: 'Korr.roller ACTUAL 5mmx8m' },
    { id: '68be85c6094d08828def9e6a', name: 'Korr.roller PRITT Mini 4,2mmx7m' },
    { id: '68be85c6094d08828def9e6b', name: 'Korr.roller PILOT BeGreen 4mmx6m' },
    { id: '68be85c6094d08828def9e6c', name: 'Korr.roller PRITT EcoFlex 4,2mmx10m' },
    { id: '68be85c6094d08828def9e6d', name: 'Korr.roller PRITT CompactFlex 4,2mmx10m' },
    { id: '68be85c6094d08828def9e6e', name: 'Korr.roller refill PRITT Flex 6mmx12m' },
    { id: '68be85c6094d08828def9e6f', name: 'Korr.roller PRITT Flex 6mmx12m' },
    { id: '68be85c6094d08828def9e70', name: 'Refill PRITT Flex Roller 4,2mmx12m' },
  ],

  // spelkort (13 products)
  'spelkort': [
    { id: '68be85ae094d08828def49c0', name: 'Spelkort i metallbox Nathan' },
    { id: '68be85be094d08828def7ccd', name: 'Aruba - Kortlek i pp ask' },
    { id: '68be85be094d08828def7cce', name: 'JOHAN. Kortlek' },
    { id: '68be85be094d08828def7ccf', name: 'Dice & Play spel' },
    { id: '68be85cd094d08828defba2f', name: 'Reklamkortlek med egen ask' },
    { id: '68be85cd094d08828defba30', name: 'Reklamkortlek - Anglo, FSC Godkänd' },
    { id: '68be85cd094d08828defba32', name: 'Reklamkortlek - Klassisk dansk' },
    { id: '68be85cd094d08828defba33', name: 'Pappask' },
    { id: '68be85cd094d08828defba34', name: 'Reklamkortlek - Klassisk svensk, FSC Godkänd' },
    { id: '68be85d0094d08828defcb80', name: 'CreaCard Eco anpassade spelkort' },
    { id: '68be85d1094d08828defcfa4', name: 'Playcard - Set med klassiska spelkort' },
    { id: '68be85d4094d08828defdde1', name: 'Lindan - Kortlek/Spelkortset' },
    { id: '68be85e8094d08828df02858', name: 'Aruba - Kortlek i pp ask' },
  ],

  // pannlampor (13 products)
  'pannlampor': [
    { id: '68be85af094d08828def4b4d', name: 'Pannlampa Azalia' },
    { id: '68be85ba094d08828def6f18', name: 'Pannlampa Adventure' },
    { id: '68be85ba094d08828def6f19', name: 'Pannlampa Azalia' },
    { id: '68be85d0094d08828defc9a3', name: 'Rexplorer uppladdningsbar strålkastare' },
    { id: '68be85d1094d08828defcf99', name: 'Elydee - Uppladdningsbar LED-pannlampa' },
    { id: '68be85d2094d08828defd224', name: 'Pannlampa i ABS Mina' },
    { id: '68be85d2094d08828defd22b', name: 'Pannlampa SCHWARZWOLF MINO  laddningsbar' },
    { id: '68be85d5094d08828defe410', name: 'Pannlampa med rörelsesensor' },
    { id: '68be85d5094d08828defe411', name: 'Pannlampa' },
    { id: '68be85d5094d08828defe412', name: 'Pannlampa med rörelsesensor' },
    { id: '68be85d5094d08828defe413', name: 'HeadLight COB pannlampa' },
    { id: '68be85d5094d08828defe414', name: 'Pannlampa, med 5 LED-lampor, Kylie' },
    { id: '68be85e3094d08828df016bf', name: 'Pannlampa Adventure' },
  ],

  // ovrigt-usb-data (13 products)
  'ovrigt-usb-data': [
    { id: '68be85b0094d08828def4f44', name: 'Gocharge RPET organiseringsfodral' },
    { id: '68be85c0094d08828def8680', name: 'Prixton Goya P10-projektor' },
    { id: '68be85c0094d08828def8681', name: 'Prixton Cinema miniprojektor' },
    { id: '68be85c0094d08828def8686', name: 'Kabelväska TopJob' },
    { id: '68be85c0094d08828def8687', name: 'Gocharge RPET organiseringsfodral' },
    { id: '68be85cd094d08828defb885', name: 'Dataöverföringsblockerare' },
    { id: '68be85cd094d08828defb886', name: 'Sinox Webbkamera för kontor 1080P. Svart' },
    { id: '68be85cd094d08828defb887', name: 'Cable organizer bag' },
    { id: '68be85d2094d08828defd4d0', name: 'Case Logic Attache 15,4", webbkamera och headset' },
    { id: '68be85d4094d08828defdf22', name: 'Lagani - 1080P HD-webkamera med ljus' },
    { id: '68be85df094d08828df00b9c', name: 'Impact AWARE 14" laptopsleeve' },
    { id: '68be85df094d08828df00b9d', name: 'Impact AWARE 15.6" laptopsleeve' },
    { id: '68be85e0094d08828df00f29', name: 'Impact AWARE 15.6" laptopsleeve' },
  ],

  // bordsklockor (13 products)
  'bordsklockor': [
    { id: '68be85b0094d08828def4f62', name: 'Okiru väckarklocka' },
    { id: '68be85cd094d08828defb82e', name: 'Bordsklocka Bell' },
    { id: '68be85cd094d08828defb82f', name: 'Modern Retro Klocka' },
    { id: '68be85cd094d08828defc038', name: 'Bambu klocka Jenny' },
    { id: '68be85ce094d08828defc12f', name: 'Cuckoo Bird - MDF gökur' },
    { id: '68be85ce094d08828defc2bc', name: 'Cuckoo - MDF gökur' },
    { id: '68be85d0094d08828defcd52', name: 'Takai bordsklocka' },
    { id: '68be85d2094d08828defd304', name: 'Clambu - Bordsklocka i bambu' },
    { id: '68be85d2094d08828defd576', name: 'Chrona bordsklocka' },
    { id: '68be85d2094d08828defd582', name: 'Droplex bordsklocka' },
    { id: '68be85d3094d08828defdb2e', name: 'BeTime Desk bordsklocka med tryck' },
    { id: '68be85d4094d08828defe0a6', name: 'HENRY. PS digital bordsklocka' },
    { id: '68be85e3094d08828df017ba', name: 'Okiru väckarklocka' },
  ],

  // babyklader (13 products)
  'babyklader': [
    { id: '68be85b2094d08828def5801', name: 'Baby T-shirt' },
    { id: '68be85b2094d08828def5802', name: 'Baby All-in-One' },
    { id: '68be85b2094d08828def5803', name: 'Organic Baby Long Sleeve Bodysuit' },
    { id: '68be85b2094d08828def5804', name: 'Baby Sweatpants' },
    { id: '68be85b2094d08828def5805', name: 'Baby Hoodie' },
    { id: '68be85b2094d08828def5809', name: 'Baby All-in-One' },
    { id: '68be85b2094d08828def580b', name: 'Baby Sweatpants' },
    { id: '68be85b2094d08828def5856', name: 'Baby T-shirt' },
    { id: '68be85b2094d08828def5860', name: 'Organic Baby Long Sleeve Bodysuit' },
    { id: '68be85b2094d08828def5861', name: 'Baby All-in-One' },
    { id: '68be85b2094d08828def5867', name: 'Baby Hoodie' },
    { id: '68be85d6094d08828defe6be', name: 'Ekologisk Babyjacka Denim' },
    { id: '68be85e2094d08828df0154d', name: 'Organic Baby Long Sleeve Bodysuit' },
  ],

  // piketrojor-dam (13 products)
  'piketrojor-dam': [
    { id: '68be85b5094d08828def6305', name: 'Women"s polo' },
    { id: '68be85b5094d08828def630a', name: 'Printer - Surf Lady' },
    { id: '68be85b5094d08828def630b', name: 'Klassisk piké, dam' },
    { id: '68be85b5094d08828def6312', name: 'Printer - Surf Stretch Lady' },
    { id: '68be85b5094d08828def6313', name: 'Printer - Surf Pro Lady' },
    { id: '68be85b5094d08828def6315', name: 'Women"s contrast polo' },
    { id: '68be85b5094d08828def6317', name: 'Dampiké Basic Bio' },
    { id: '68be85b5094d08828def6319', name: 'Wokwear piké, dam' },
    { id: '68be85ba094d08828def7095', name: 'Ladies Pique' },
    { id: '68be85e2094d08828df013b9', name: 'Ladies Pique' },
    { id: '68be85e5094d08828df01e40', name: 'Printer - Surf Lady' },
    { id: '68be85e5094d08828df01e4d', name: 'Printer - Surf Stretch Lady' },
    { id: '68be85e5094d08828df01e4f', name: 'Printer - Surf Pro Lady' },
  ],

  // munskydd (12 products)
  'munskydd': [
    { id: '68be85bd094d08828def7ae4', name: 'INGRID. Multifunktionsväska med EVA-fack' },
    { id: '68be85bd094d08828def7ae6', name: 'MOORE. Multifunktionsväska med ett EVA-fack' },
    { id: '68be85bd094d08828def7b57', name: 'INGRID. Multifunktionsväska med EVA-fack' },
    { id: '68be85bd094d08828def7b6a', name: 'Munskydd i tyg' },
    { id: '68be85bd094d08828def7b6b', name: 'Munskydd i tyg' },
    { id: '68be85bd094d08828def7b6d', name: 'Kylande munskydd "ICE"' },
    { id: '68be85e0094d08828df00f63', name: 'XD DESIGN skyddande mask set' },
    { id: '68be85e9094d08828df02b3a', name: 'Munskydd i tyg' },
    { id: '68be85e9094d08828df02b3f', name: 'Munskydd i tyg' },
    { id: '68be85e9094d08828df02c38', name: 'Munskydd i fluorescerande tyg' },
    { id: '68be85e9094d08828df02c39', name: 'Kylande munskydd "ICE"' },
    { id: '68be85e9094d08828df02c3a', name: 'FFP2 Munskydd "Salzburg"' },
  ],

  // webcamskydd (12 products)
  'webcamskydd': [
    { id: '68be85be094d08828def7f84', name: 'Webcam Cover' },
    { id: '68be85be094d08828def7f85', name: 'HIDE. ABS webbkameraskydd' },
    { id: '68be85be094d08828def7f86', name: 'Webbkameraskydd Hide' },
    { id: '68be85be094d08828def7f87', name: 'Hideo webbkamerablockerare' },
    { id: '68be85cd094d08828defb962', name: 'Block-It Webcam Cover webbkamera täcka' },
    { id: '68be85cd094d08828defb963', name: 'Set Mobile Security' },
    { id: '68be85d3094d08828defd88b', name: 'CreaCam Plus anpassad webbkamerablockerare' },
    { id: '68be85e2094d08828df01564', name: 'Webcam Cover' },
    { id: '68be85e6094d08828df02263', name: 'Hideo webbkamerablockerare' },
    { id: '68be85e6094d08828df023a8', name: 'Hide kamerablockerare' },
    { id: '68be85e8094d08828df026d0', name: 'Blinka webbkamerablockerare' },
    { id: '68be85ea094d08828df02db7', name: 'Skydd för webbkamera med tryck' },
  ],

  // halslag (12 products)
  'halslag': [
    { id: '68be85c4094d08828def942a', name: 'Hålslag RAPID Int hålning 4 hål svart' },
    { id: '68be85c4094d08828def942b', name: 'Hålslag LYRECO EU.hål 30ark svart' },
    { id: '68be85c4094d08828def942c', name: 'Hålslag LEITZ WOW 5151 svart' },
    { id: '68be85c4094d08828def942d', name: 'Hålslag Addition svart' },
    { id: '68be85c4094d08828def942e', name: 'Hålslag RAPID FC20 svart EU-hålning' },
    { id: '68be85c4094d08828def942f', name: 'Hålslag RAPID KC3 krom/svart' },
    { id: '68be85c4094d08828def9430', name: 'Hålslag svart/silver' },
    { id: '68be85c4094d08828def9431', name: 'Hålslag RAPID 10 ark Black Magic' },
    { id: '68be85c4094d08828def9432', name: 'Hålslag RAPID 10 ark Coconut Kiss vit' },
    { id: '68be85c4094d08828def9433', name: 'Hålslag Addition, vit' },
    { id: '68be85c4094d08828def9434', name: 'Hålslag B010 svart' },
    { id: '68be85c4094d08828def9435', name: 'Hålslag RAPID FC12 svart' },
  ],

  // parmtillbehor (12 products)
  'parmtillbehor': [
    { id: '68be85c5094d08828def9806', name: 'Multifunktionshylla 4 hyllplan med hjul' },
    { id: '68be85c5094d08828def9807', name: 'Pärmvagn 2 hyllplan 100,6x86x34cm björk' },
    { id: '68be85c5094d08828def9808', name: 'Ringmekanism 23mm' },
    { id: '68be85c5094d08828def980a', name: 'Klämskena 6mm vit' },
    { id: '68be85c5094d08828def980b', name: 'Hålförstärkare DJOIS transparent 500/fp' },
    { id: '68be85c5094d08828def9814', name: 'Pärmvagn 2 hyllpan 91x86x34cm björk' },
    { id: '68be85c5094d08828def9815', name: 'Elefanttråd 1mmx40cm 550/fp' },
    { id: '68be85c5094d08828def9816', name: 'Satinband 10mmx30m' },
    { id: '68be85c5094d08828def9817', name: 'Etikett AVERY hålförs. vit 13mm 500/fp' },
    { id: '68be85c5094d08828def981b', name: 'Katalogfals Filefix för A5 25/fp' },
    { id: '68be85c5094d08828def981c', name: 'Katalogfals Filefix för A4 10/fp' },
    { id: '68be85c5094d08828def9823', name: 'Ringmekanism 29mm' },
  ],

  // fasten-och-farstpistol (12 products)
  'fasten-och-farstpistol': [
    { id: '68be85c6094d08828def9e71', name: 'Fästsnöre 85mm 5000/fp' },
    { id: '68be85c6094d08828def9e72', name: 'Handdukskrok TESA Smooz kromad' },
    { id: '68be85c6094d08828def9e74', name: 'J-Krok 25mm till Fästpistol 5000/fp' },
    { id: '68be85c6094d08828def9e75', name: 'Fästsnöre 135mm 5000/fp' },
    { id: '68be85c6094d08828def9e76', name: 'Fästpistol AVERY Standard' },
    { id: '68be85c6094d08828def9e77', name: 'Fästpistol Jolly FF' },
    { id: '68be85c6094d08828def9e79', name: 'Fästpistol AVERY Fine' },
    { id: '68be85c6094d08828def9e7a', name: 'Fästnylon 20mm standard 5000/fp' },
    { id: '68be85c6094d08828def9e7b', name: 'Nål till Fästpistol Fine 4/fp' },
    { id: '68be85c6094d08828def9e7d', name: 'Fästnylon 40mm standard 5000/fp' },
    { id: '68be85c6094d08828def9e7e', name: 'Nål till Fästpistol Standard 4/fp' },
    { id: '68be85c6094d08828def9e7f', name: 'Fästpistol Jolly' },
  ],

  // kannor (11 products)
  'kannor': [
    { id: '68be85ad094d08828def4867', name: 'MELIOR 1"2L. Plastkanna 1"2L' },
    { id: '68be85b1094d08828def534c', name: 'COOL-IT karaff 1.5 l.' },
    { id: '68be85b1094d08828def534d', name: 'COOL-IT karaff 1.5 l.' },
    { id: '68be85b1094d08828def5352', name: 'MELIOR 1"2L. Plastkanna 1"2L' },
    { id: '68be85ca094d08828defaa34', name: 'Glas Mia' },
    { id: '68be85cc094d08828defb0da', name: 'Glas Ivy' },
    { id: '68be85ce094d08828defc422', name: 'Servir - Dubbelväggig kanna 1L' },
    { id: '68be85d4094d08828defdf81', name: 'Figaro - Kanna' },
    { id: '68be85e4094d08828df01b3b', name: 'COOL-IT karaff 1.5 l.' },
    { id: '68be85e4094d08828df01b44', name: 'PIP serveringskanna' },
    { id: '68be85e4094d08828df01b46', name: 'COOL-IT karaff 1.5 l.' },
  ],

  // ovrigt-verktyg (11 products)
  'ovrigt-verktyg': [
    { id: '68be85ad094d08828def48f1', name: 'Helm - Skyddshjälm i ABS stl 51-63' },
    { id: '68be85b8094d08828def69a1', name: 'Largo nyckelring med plastnyckel för element' },
    { id: '68be85be094d08828def7f89', name: 'Largo nyckelring med plastnyckel för element' },
    { id: '68be85be094d08828def7f8b', name: 'Helm - Skyddshjälm i ABS stl 51-63' },
    { id: '68be85bf094d08828def8030', name: 'Energizer 1536Wh Reservkraftverk med 1800W effekt. Svart' },
    { id: '68be85ca094d08828defa8f1', name: 'Klohammare i bokträ Asha' },
    { id: '68be85ca094d08828defa91a', name: 'Snöskyffel i PP Zaya' },
    { id: '68be85cd094d08828defb961', name: 'SCX.design T05 minilaseravståndsmätare' },
    { id: '68be85d5094d08828defe4fe', name: 'Level-Up flasköppnare' },
    { id: '68be85df094d08828df00bc2', name: 'Energizer 1536Wh Reservkraftverk med 1800W effekt. Svart' },
    { id: '68be85e6094d08828df0230b', name: 'Largo nyckelring med plastnyckel för element' },
  ],

  // handvaskor (11 products)
  'handvaskor': [
    { id: '68be85ae094d08828def498b', name: 'GILI. PU-handväska (21 % återvunnen PU och 30 % återvunnen polyester)' },
    { id: '68be85b0094d08828def509d', name: 'SuboPurse 360 RPET-väska med tryck' },
    { id: '68be85b0094d08828def52d7', name: 'Mistral 2in1 Ryggsäck & Resväska' },
    { id: '68be85b0094d08828def52d8', name: 'GILI. PU-handväska (21 % återvunnen PU och 30 % återvunnen polyester)' },
    { id: '68be85b0094d08828def52d9', name: 'Florin handväska i bomull' },
    { id: '68be85b0094d08828def52da', name: 'SuboPurse 360 RPET-väska med tryck' },
    { id: '68be85bf094d08828def7fed', name: 'GILI. PU-handväska (21 % återvunnen PU och 30 % återvunnen polyester)' },
    { id: '68be85c1094d08828def8991', name: 'Mistral 2in1 Ryggsäck & Resväska' },
    { id: '68be85d0094d08828defccd2', name: 'Lunch bag EU' },
    { id: '68be85d2094d08828defd47b', name: 'Escape, handbag Bergen' },
    { id: '68be85d3094d08828defd987', name: 'CreaFelt Money anpassad handväska' },
  ],

  // akutvaska-plasterset-mm (11 products)
  'akutvaska-plasterset-mm': [
    { id: '68be85af094d08828def4da9', name: 'First Aid Bag' },
    { id: '68be85b8094d08828def69a0', name: 'Nyckelring mun mot mun-mask' },
    { id: '68be85bd094d08828def7abb', name: 'Förstahjälpen kudde' },
    { id: '68be85bd094d08828def7abe', name: 'First Aid Bag' },
    { id: '68be85d1094d08828defcdf6', name: 'Första hjälpen Recycled Canvas' },
    { id: '68be85d1094d08828defcf76', name: 'First Aid Box' },
    { id: '68be85d3094d08828defdb69', name: 'Help - Nödfilt i en påse' },
    { id: '68be85d5094d08828defe1b0', name: 'Plåster i bambufodral' },
    { id: '68be85de094d08828df00713', name: 'Nyckelring mun mot mun-mask' },
    { id: '68be85de094d08828df007bc', name: 'Förstahjälpen kudde' },
    { id: '68be85e9094d08828df02c6b', name: 'Första hjälpen set i nylonväska Rosalina' },
  ],

  // barn-t-shirt (11 products)
  'barn-t-shirt': [
    { id: '68be85b2094d08828def583c', name: 'Junior T-shirt' },
    { id: '68be85b2094d08828def583d', name: 'Rock T Junior' },
    { id: '68be85b2094d08828def583f', name: 'Printer - Heavy T-shirt Jr' },
    { id: '68be85b2094d08828def585b', name: 'Junior T-shirt' },
    { id: '68be85b2094d08828def5862', name: 'Rock T Junior' },
    { id: '68be85b2094d08828def5863', name: 'Printer - Heavy T-shirt Jr' },
    { id: '68be85b7094d08828def674e', name: 'Junior T-shirt' },
    { id: '68be85b7094d08828def674f', name: 'Printer - Heavy T-shirt Jr' },
    { id: '68be85b7094d08828def67b8', name: 'Junior T-shirt' },
    { id: '68be85e2094d08828df013b7', name: 'Junior T-shirt' },
    { id: '68be85e5094d08828df01e5b', name: 'Printer - Heavy T-shirt Jr' },
  ],

  // spiralblock (11 products)
  'spiralblock': [
    { id: '68be85c3094d08828def909a', name: 'Spiralblock A7 60g 50 blad Rutat' },
    { id: '68be85c3094d08828def909c', name: 'Spiralkladd 147x297mm 70g 96 blad linj' },
    { id: '68be85c3094d08828def909e', name: 'Spiralblock A5 60g 100 blad rutat' },
    { id: '68be85c3094d08828def909f', name: 'Spiralblock A6 100 blad olinjerat' },
    { id: '68be85c3094d08828def90a0', name: 'Spiralblock A5 60g 100 blad linjerat' },
    { id: '68be85c3094d08828def90a1', name: 'Spiralkladd 4-OFF 147x297mm 96 blad linj' },
    { id: '68be85c3094d08828def90a2', name: 'Spiralblock A6 60g 100 blad linjerat' },
    { id: '68be85c3094d08828def90a3', name: 'Spiralblock A6 60g 100 blad rutat' },
    { id: '68be85c3094d08828def90a4', name: 'Spiralblock 105x210mm 100 blad linj.' },
    { id: '68be85c3094d08828def90a5', name: 'Telefonbok svart' },
    { id: '68be85c3094d08828def90a6', name: 'Spiralblock A7 60g 50 blad linjerat' },
  ],

  // skyltning (11 products)
  'skyltning': [
    { id: '68be85c6094d08828def9ee4', name: 'Klämlist 80cm 2/fp' },
    { id: '68be85c6094d08828def9ee5', name: 'Klämlist 50cm 2/fp' },
    { id: '68be85c6094d08828def9ee6', name: 'Mobilknapp m. ögla för skyltupph. 100/fp' },
    { id: '68be85c6094d08828def9ee7', name: 'Klämlist 120cm 2/fp' },
    { id: '68be85c6094d08828def9eea', name: 'Upphängningskrok 100/fp' },
    { id: '68be85c6094d08828def9eeb', name: 'Klämlist 100cm 2/fp' },
    { id: '68be85c6094d08828def9eec', name: 'Kupongspjut 30mm 100/fp' },
    { id: '68be85c6094d08828def9eed', name: 'Klämlist DJOIS Grip 900 mm silver' },
    { id: '68be85c6094d08828def9eef', name: 'Produkthängare 40x30mm 100/fp' },
    { id: '68be85c6094d08828def9ef0', name: 'Mobilfjäder Jetsnabb 100/fp' },
    { id: '68be85c6094d08828def9efa', name: 'Sugpropp med krok 10/fp' },
  ],

  // resegarderober (10 products)
  'resegarderober': [
    { id: '68be85ad094d08828def475d', name: 'Florens, resegarderob' },
    { id: '68be85be094d08828def7eae', name: 'Renew AWARE rPET 3-delars förpackningskubset' },
    { id: '68be85bf094d08828def8078', name: 'Florens, resegarderob' },
    { id: '68be85cd094d08828defb9a0', name: 'Resegarderob Smoking' },
    { id: '68be85cd094d08828defb9a1', name: 'Resegarderob Clean' },
    { id: '68be85cd094d08828defb9a2', name: 'Resegarderob Suit' },
    { id: '68be85d2094d08828defd475', name: 'Lounge, garment bag' },
    { id: '68be85d4094d08828defde3e', name: 'FONTAINE. Non-woven plaggpåse (70 g/m²)' },
    { id: '68be85e2094d08828df014f7', name: 'Renew AWARE rPET 3-delars förpackningskubset' },
    { id: '68be85ea094d08828df02ee0', name: 'Resegarderob för slips, Rollor®, Gabriella' },
  ],

  // ovrigt-barnklader (10 products)
  'ovrigt-barnklader': [
    { id: '68be85ad094d08828def48a8', name: 'THC RUN KIDS. Sportstrumpa för barn' },
    { id: '68be85b2094d08828def57c2', name: 'Baby Bib' },
    { id: '68be85b2094d08828def57c3', name: 'Bandana Bib' },
    { id: '68be85b2094d08828def57c5', name: 'THC RUN KIDS. Sportstrumpa för barn' },
    { id: '68be85b2094d08828def57c6', name: 'Baby Mössa' },
    { id: '68be85b2094d08828def57c7', name: 'Haklapp' },
    { id: '68be85d1094d08828defd016', name: 'THC RUN KIDS WH. Sportstrumpa för barn' },
    { id: '68be85d6094d08828defe6c0', name: 'Dregellapp Denim' },
    { id: '68be85e5094d08828df01e0a', name: 'Haklapp' },
    { id: '68be85e6094d08828df021ce', name: 'Haklapp' },
  ],

  // polotrojor (10 products)
  'polotrojor': [
    { id: '68be85af094d08828def4ef4', name: 'Aloha UV turtle neck' },
    { id: '68be85af094d08828def4efa', name: 'Aloha UV turtle neck' },
    { id: '68be85b5094d08828def60b2', name: 'Aloha UV turtle neck' },
    { id: '68be85b7094d08828def667c', name: 'Pima Cotton 1/4 Zip' },
    { id: '68be85b7094d08828def667d', name: 'Ladies" Roll-Neck Merino Jumper' },
    { id: '68be85b7094d08828def667e', name: 'Men"s Roll-Neck Merino Jumper' },
    { id: '68be85b7094d08828def667f', name: 'Aloha UV turtle neck' },
    { id: '68be85d5094d08828defe4c3', name: 'Men Feel Good Stretch Roll Neck Top' },
    { id: '68be85e2094d08828df01556', name: 'Pima Cotton 1/4 Zip' },
    { id: '68be85e4094d08828df01a7d', name: 'Dakota' },
  ],

  // cardigans (10 products)
  'cardigans': [
    { id: '68be85b5094d08828def640e', name: 'Printer - Javelin Rsx' },
    { id: '68be85b5094d08828def6410', name: 'Printer - Javelin Lady' },
    { id: '68be85b5094d08828def6411', name: 'Lady Pima Cotton Cardigan' },
    { id: '68be85b5094d08828def6464', name: 'Printer - Javelin Lady' },
    { id: '68be85b6094d08828def64b6', name: 'Lady Pima Cotton Cardigan' },
    { id: '68be85b8094d08828def6920', name: 'Printer - Javelin Lady' },
    { id: '68be85e2094d08828df013c0', name: 'Lady Pima Cotton Cardigan' },
    { id: '68be85e2094d08828df01540', name: 'Printer - Javelin Rsx' },
    { id: '68be85e2094d08828df0154f', name: 'Printer - Javelin Lady' },
    { id: '68be85e5094d08828df01e56', name: 'Printer - Javelin Lady' },
  ],

  // earplugs (10 products)
  'earplugs': [
    { id: '68be85bd094d08828def7a4d', name: 'Skycap' },
    { id: '68be85bd094d08828def7a4e', name: 'Plux öronproppar' },
    { id: '68be85bd094d08828def7a4f', name: 'Continental' },
    { id: '68be85be094d08828def7ead', name: 'Skycap' },
    { id: '68be85d4094d08828defde9d', name: 'Hush öronproppar' },
    { id: '68be85d5094d08828defe1d6', name: 'Maskset - Reseset i papperslåda' },
    { id: '68be85e6094d08828df022d2', name: 'Skycap' },
    { id: '68be85e7094d08828df02419', name: 'Plux öronproppar' },
    { id: '68be85e7094d08828df024cd', name: 'Continental' },
    { id: '68be85e9094d08828df02c24', name: 'Buds To Go - Öronproppar' },
  ],

  // bokforingsbocker (10 products)
  'bokforingsbocker': [
    { id: '68be85c3094d08828def90e3', name: 'Journalbok 380x250mm 11 Dkol, 5 Ekol' },
    { id: '68be85c3094d08828def90e4', name: 'Kontorsbok A4 156N 96 sidor linj N' },
    { id: '68be85c3094d08828def90e5', name: 'Kontorsbok A4,153A, linj 200 sidor' },
    { id: '68be85c3094d08828def90e6', name: 'Kassabok ESSELTE för jordbrukare' },
    { id: '68be85c3094d08828def90e7', name: 'Kassabok BURDE A4L' },
    { id: '68be85c3094d08828def90e8', name: 'Kontorsbok 153 A/120' },
    { id: '68be85c3094d08828def90e9', name: 'Journalbok 366/48 11D 5E' },
    { id: '68be85c3094d08828def90ea', name: 'Bokföringsbok 156I/96 2 KOL' },
    { id: '68be85c3094d08828def90eb', name: 'Kassabok A4L/23 uppsl. 14kol' },
    { id: '68be85c3094d08828def90ec', name: 'Kassabok Privat A5 3 kol 32 sidor' },
  ],

  // prisetiketter-och-prismarkare (10 products)
  'prisetiketter-och-prismarkare': [
    { id: '68be85c6094d08828def9ee8', name: 'Etikett METO avtagbar 32x19 vit 1000/rl' },
    { id: '68be85c6094d08828def9ef7', name: 'Etikett Manilla 55x110mm natur 1000/fp' },
    { id: '68be85c6094d08828def9ef8', name: 'Biljettblock 1-100' },
    { id: '68be85c6094d08828def9ef9', name: 'Biljettblock 1-100' },
    { id: '68be85c6094d08828def9f02', name: 'Biljettblock 1-100' },
    { id: '68be85c6094d08828def9f04', name: 'Biljettblock 1-100' },
    { id: '68be85c6094d08828def9f05', name: 'Biljettblock 1-100' },
    { id: '68be85c6094d08828def9f14', name: 'Etikett 22x12mm Vit G1 7000/fp' },
    { id: '68be85c6094d08828def9f27', name: 'Etikett AVERY Ultragrip 70x35mm 2400/fp' },
    { id: '68be85c6094d08828def9f2c', name: 'Färgrullar till TRENDY 1, 2, 3 5/fp' },
  ],

  // traryggsparmar-specialformat (10 products)
  'traryggsparmar-specialformat': [
    { id: '68be85c6094d08828defa03b', name: 'Gaffelpärm JOPA special A4 80mm' },
    { id: '68be85c6094d08828defa03c', name: 'Gaffelpärm JOPA special A4 80mm' },
    { id: '68be85c6094d08828defa03d', name: 'Gaffelpärm JOPA special A4 80mm' },
    { id: '68be85c6094d08828defa03e', name: 'Gaffelpärm JOPA special A4 80mm' },
    { id: '68be85c6094d08828defa03f', name: 'Gaffelpärm JOPA special A3L 60mm blå' },
    { id: '68be85c6094d08828defa041', name: 'Gaffelpärm JOPA special A3 60mm blå' },
    { id: '68be85c6094d08828defa042', name: 'Gaffelpärm JOPA special A5L 60mm blå' },
    { id: '68be85c6094d08828defa043', name: 'Gaffelpärm JOPA special A4 80mm m.grön' },
    { id: '68be85c6094d08828defa044', name: 'Gaffelpärm JOPA special A5 40mm blå' },
    { id: '68be85c6094d08828defa045', name: 'Gaffelpärm JOPA special A5 60mm blå' },
  ],

  // tumstockar (10 products)
  'tumstockar': [
    { id: '68be85cd094d08828defb878', name: 'Metric tumstock' },
    { id: '68be85cd094d08828defb879', name: 'Metric WoodPro tumstock' },
    { id: '68be85d1094d08828defd0f4', name: 'Måttstock Stabila Pro' },
    { id: '68be85d1094d08828defd0f7', name: 'Måttstock (0,5 m) Holly' },
    { id: '68be85d1094d08828defd1b3', name: 'Måttstock (1 m) Leon' },
    { id: '68be85d1094d08828defd1b4', name: 'Måttstock i trä (2 m) Stabila®, Jessica' },
    { id: '68be85d1094d08828defd1bb', name: 'Måttstock i trä (2 m) Stabila® Jason' },
    { id: '68be85d2094d08828defd227', name: 'Måttstock i trä, Stabila® (2 m), Gloria' },
    { id: '68be85d5094d08828defe47a', name: 'MiniMetric' },
    { id: '68be85e6094d08828df02257', name: 'Tumstock trä 2 m premium färg' },
  ],

  // nyckelhittare (9 products)
  'nyckelhittare': [
    { id: '68be85ad094d08828def4656', name: 'FindIt bluetooth nyckelsökare' },
    { id: '68be85ae094d08828def4ad6', name: 'Busca - Smart Tracker iOS' },
    { id: '68be85be094d08828def7fb3', name: 'Busca - Smart Tracker iOS' },
    { id: '68be85be094d08828def7fb6', name: 'Chipolo POP Tracker' },
    { id: '68be85cd094d08828defb95c', name: 'Credit card Dual FindTag' },
    { id: '68be85d2094d08828defd71f', name: 'Finit - Nyckelfinnare i bambu' },
    { id: '68be85e6094d08828df02392', name: 'Spotit bluetooth nyckelsökare' },
    { id: '68be85e9094d08828df02b01', name: 'Find Me - Nyckel sökare' },
    { id: '68be85ea094d08828df02e05', name: 'Finder - Hitta anordning' },
  ],

  // putsdukar (9 products)
  'putsdukar': [
    { id: '68be85ae094d08828def4944', name: 'CreaClean RPET anpassade glasögon tyg' },
    { id: '68be85c0094d08828def8573', name: 'Skärmrengörare Leah' },
    { id: '68be85c0094d08828def8574', name: 'Skärmrengörare 15ml' },
    { id: '68be85ce094d08828defc42f', name: 'Putsduk i mikrofiber HQ EU' },
    { id: '68be85d0094d08828defc93d', name: 'MicroSpot putsduk till skärm' },
    { id: '68be85d1094d08828defd1c1', name: 'Putsduk i mikrofiber EU' },
    { id: '68be85e3094d08828df016c4', name: 'Webcamskydd och skärmrengörare' },
    { id: '68be85ea094d08828df02e40', name: 'Skärmrengörare Leah' },
    { id: '68be85ea094d08828df02f05', name: 'Skärmrengörare 15ml' },
  ],

  // touchvantar (9 products)
  'touchvantar': [
    { id: '68be85c0094d08828def856b', name: 'Oasis Touch-Screen Gloves Viraloff' },
    { id: '68be85c0094d08828def856d', name: 'Retap RPET-handskar för pekskärm' },
    { id: '68be85cd094d08828defb8c8', name: 'TouchGlove handskar' },
    { id: '68be85cd094d08828defb8c9', name: 'Dactile - RPET-touchhandskar' },
    { id: '68be85d2094d08828defd67c', name: 'Lesport - Touch sporthandskar' },
    { id: '68be85d4094d08828defdd3a', name: 'THOM. Handskar med touchtopp' },
    { id: '68be85e7094d08828df02593', name: 'Retap RPET-handskar för pekskärm' },
    { id: '68be85e8094d08828df027e8', name: 'Fillap Handskar för pekskärm' },
    { id: '68be85e9094d08828df02cd0', name: 'Tacto - Taktila handskar smartphone' },
  ],

  // brastandare (9 products)
  'brastandare': [
    { id: '68be85c0094d08828def869f', name: 'Laddbar Braständare med tryck' },
    { id: '68be85c0094d08828def86a1', name: 'Tändare Hot fire' },
    { id: '68be85c0094d08828def86a2', name: 'Grilltändare' },
    { id: '68be85e0094d08828df00fdb', name: 'Laddbar Braständare med tryck' },
    { id: '68be85e2094d08828df01614', name: 'Tändare Hot fire' },
    { id: '68be85e3094d08828df016bb', name: 'Grilltändare' },
    { id: '68be85e3094d08828df016bc', name: 'Somrig braständare' },
    { id: '68be85e3094d08828df016cf', name: 'Tändare' },
    { id: '68be85e3094d08828df0174d', name: 'Ljuslykta i metallutseende' },
  ],

  // haftapparater-el (9 products)
  'haftapparater-el': [
    { id: '68be85c4094d08828def9437', name: 'Elhäftare RAPID 90EC' },
    { id: '68be85c4094d08828def9438', name: 'Elhäftare RAPID 5025e' },
    { id: '68be85c4094d08828def943a', name: 'Elhäftare RAPID Optima 20 vit/svart' },
    { id: '68be85c4094d08828def943c', name: 'Elhäftare RAPID Optima 60E vit/svart' },
    { id: '68be85c4094d08828def943d', name: 'Elhäftare RAPID 5050e silver/orange' },
    { id: '68be85c4094d08828def943e', name: 'Elhäftare RAPID Optima Grip vit/svart' },
    { id: '68be85c4094d08828def943f', name: 'Elhäftare LEITZ 5532 svart' },
    { id: '68be85c4094d08828def9441', name: 'Elhäftare RAPID 20EX 20bl svart' },
    { id: '68be85c4094d08828def9446', name: 'Elhäftare RAPID 5025e' },
  ],

  // whiteboardtavlor-mobil-glas (9 products)
  'whiteboardtavlor-mobil-glas': [
    { id: '68be85c6094d08828def9f6e', name: 'Glastavla LEGAMASTER r.hörn 100x200cm gr' },
    { id: '68be85c6094d08828def9f6f', name: 'Glastavla LEGAMASTER r.hörn 100x200cm bl' },
    { id: '68be85c6094d08828def9f70', name: 'Glastavla LEGAMASTER r.hörn 100x150cm gr' },
    { id: '68be85c6094d08828def9f71', name: 'Glastavla LEGAMASTER r.hörn 100x200cm lg' },
    { id: '68be85c6094d08828def9f72', name: 'Glastavla LEGAMASTER r.hörn 100x150cm bl' },
    { id: '68be85c6094d08828def9f73', name: 'Glastavla LEGAMASTER r.hörn 90x120cm' },
    { id: '68be85c6094d08828def9f74', name: 'Glastavla LEGAMASTER r.hörn 100x150cm lg' },
    { id: '68be85c6094d08828def9f75', name: 'Glastavla LEGAMASTER r.hörn 90x120cm l.g' },
    { id: '68be85c6094d08828def9f76', name: 'Glastavla LEGAMASTER r.hörn 90x120cm' },
  ],

  // uppdelningsband (9 products)
  'uppdelningsband': [
    { id: '68be85c7094d08828defa2f8', name: 'Uppdelningsband ACTUAL 3mmx13m' },
    { id: '68be85c7094d08828defa2f9', name: 'Uppdelningsband ACTUAL 2mmx13m' },
    { id: '68be85c8094d08828defa2fa', name: 'Uppdelningsband ACTUAL 3mmx13m' },
    { id: '68be85c8094d08828defa2ff', name: 'Uppdelningsband ACTUAL 2mmx13m' },
    { id: '68be85c8094d08828defa301', name: 'Magnetband 12,5mmx3m' },
    { id: '68be85c8094d08828defa303', name: 'Magnetband 25mmx3m' },
    { id: '68be85c8094d08828defa304', name: 'Uppdelningsband NOBO svart 1,5mmx10m' },
    { id: '68be85c8094d08828defa305', name: 'Uppdelningsband ACTUAL 1mmx13m svart' },
    { id: '68be85c8094d08828defa306', name: 'Uppdelningsband NOBO svart 3mmx10m' },
  ],

  // scarves (8 products)
  'scarves': [
    { id: '68be85ae094d08828def4ad1', name: 'Stadium Scarf' },
    { id: '68be85ae094d08828def4ad4', name: 'Classic Waffle Knit Scarf' },
    { id: '68be85ae094d08828def4ad5', name: 'Knitted Scarf and Beanie Gift Set' },
    { id: '68be85af094d08828def4bee', name: 'Knitted Scarf and Beanie Gift Set' },
    { id: '68be85b3094d08828def5b9e', name: 'Knitted Scarf and Beanie Gift Set' },
    { id: '68be85b5094d08828def60a9', name: 'Stadium Scarf' },
    { id: '68be85b5094d08828def6134', name: 'Stickad Halsduk Lammull' },
    { id: '68be85e4094d08828df018d4', name: 'Recycled Fleece Scarf' },
  ],

  // vastar-herr (8 products)
  'vastar-herr': [
    { id: '68be85b3094d08828def5932', name: 'Printer - Trial Vest' },
    { id: '68be85b3094d08828def5934', name: 'Dunväst, herr' },
    { id: '68be85b3094d08828def5935', name: 'Fodrad Väst Nautilus Herr' },
    { id: '68be85b3094d08828def5937', name: 'Quitald Väst Tyler Herr' },
    { id: '68be85b4094d08828def5ea6', name: 'Printer - Trial Vest' },
    { id: '68be85b4094d08828def5eb9', name: 'Dunväst, herr' },
    { id: '68be85b4094d08828def5eba', name: 'Quitald Väst Tyler Herr' },
    { id: '68be85e5094d08828df01e45', name: 'Printer - Trial Vest' },
  ],

  // balten (8 products)
  'balten': [
    { id: '68be85b5094d08828def614c', name: 'Faux Leather & braid belt' },
    { id: '68be85b5094d08828def614f', name: 'Braid stretch belt' },
    { id: '68be85b5094d08828def6151', name: 'Two colour stripe braid stretch belt' },
    { id: '68be85b5094d08828def6153', name: 'Mens Vintage Wash Canvas Belt' },
    { id: '68be85b5094d08828def621e', name: 'Faux leather braid belt' },
    { id: '68be85d5094d08828defe504', name: 'Bangor 3-pack Belt' },
    { id: '68be85d5094d08828defe512', name: 'Colville Belt' },
    { id: '68be85d5094d08828defe513', name: 'Belt' },
  ],

  // sovmasker (8 products)
  'sovmasker': [
    { id: '68be85be094d08828def7e51', name: 'Bonne Nuit - Ögonbindel' },
    { id: '68be85be094d08828def7e53', name: 'Sovmask' },
    { id: '68be85be094d08828def7e55', name: 'Jetlag RPET ögonmask för resor' },
    { id: '68be85d1094d08828defce16', name: 'Reveyes - Vändande, svalkande ögonmask' },
    { id: '68be85d4094d08828defe0a8', name: 'DOZY. Praktisk 190T sovmask' },
    { id: '68be85e7094d08828df02426', name: 'Airnap ögonmask för resor' },
    { id: '68be85e7094d08828df024b5', name: 'Airnap ögonmask för resor' },
    { id: '68be85e9094d08828df02b6b', name: 'Ögonmask i nylon (190T) Clarke' },
  ],

  // mobiltillbehor-ovrigt (8 products)
  'mobiltillbehor-ovrigt': [
    { id: '68be85be094d08828def7fb5', name: '6SFT1 | Fresh "n Rebel Smart Finder (Apple Find My)' },
    { id: '68be85be094d08828def7fb8', name: 'Försvarsspray SMART  5-i-1' },
    { id: '68be85be094d08828def7fb9', name: 'Försvarsspray SMART Mini 3-i-1' },
    { id: '68be85be094d08828def7fba', name: 'Armband för mobil' },
    { id: '68be85cd094d08828defb95a', name: 'Clip-Light Mobile Light Connect' },
    { id: '68be85d1094d08828defd064', name: 'Beautily Eco selfie ringlampa' },
    { id: '68be85d2094d08828defd364', name: 'Emergency Button SMART' },
    { id: '68be85e5094d08828df01f79', name: 'Armband för mobil' },
  ],

  // lim (8 products)
  'lim': [
    { id: '68be85c3094d08828def9134', name: 'Häftmassa UHU 80 rutor 55g' },
    { id: '68be85c3094d08828def913a', name: 'Boktejp reparation SCOTCH 38,1mm × 13,7m' },
    { id: '68be85c3094d08828def913b', name: 'Häftmassa LYRECO 55 rutor 50G' },
    { id: '68be85c3094d08828def9140', name: 'Häftmassa Bright Office 60g' },
    { id: '68be85c3094d08828def9143', name: 'Fästkuddar dubbelhäftande 25x12mm 100/fp' },
    { id: '68be85c3094d08828def9144', name: 'Häftmassa stripes blå 60g' },
    { id: '68be85c3094d08828def9146', name: 'Powerstrips TESA Poster 20/fp' },
    { id: '68be85c3094d08828def914e', name: 'Häftmassa PRITT Multi Tac 35g 65/fp' },
  ],

  // dorrskyltar (8 products)
  'dorrskyltar': [
    { id: '68be85c3094d08828def926a', name: 'Instick Crystal Sign 148x105mm 10/fp' },
    { id: '68be85c3094d08828def926b', name: 'Dörrskylt DURABLE Info sign 210x297mm' },
    { id: '68be85c3094d08828def926c', name: 'Dörrskylt DURABLE Info sign 149x52,5mm' },
    { id: '68be85c3094d08828def926d', name: 'Dörrskylt DURABLE Crystal Sign 148x210mm' },
    { id: '68be85c3094d08828def926e', name: 'Dörrskylt DURABLE Crystal Sign 105x148mm' },
    { id: '68be85c3094d08828def926f', name: 'Dörrskylt DURABLE Info sign 149x105,5mm' },
    { id: '68be85c3094d08828def9270', name: 'Dörrskylt DURABLE Info sign 210x148,5mm' },
    { id: '68be85c3094d08828def9271', name: 'Skylt WC DURABLE 83mm borstat stål' },
  ],

  // gemkoppar (8 products)
  'gemkoppar': [
    { id: '68be85c4094d08828def9421', name: 'Gemkopp LYRECO magnetisk transparant' },
    { id: '68be85c4094d08828def9422', name: 'Gemkopp nät metall 118x50mm' },
    { id: '68be85c4094d08828def9423', name: 'Gemkopp nät metall 118x50mm' },
    { id: '68be85c4094d08828def9424', name: 'Gemkopp DURABLE Trend magnetisk transp.' },
    { id: '68be85c4094d08828def9425', name: 'Gemkopp DURABLE Trend magnetisk svart' },
    { id: '68be85c4094d08828def9426', name: 'Gemkopp ARLAC Clip Boy svart' },
    { id: '68be85c4094d08828def9427', name: 'Gemkopp Clip Master svart/transparent' },
    { id: '68be85c4094d08828def9429', name: 'Gemkopp Metallnät svart' },
  ],

  // startset-for-whiteboardtavlor (8 products)
  'startset-for-whiteboardtavlor': [
    { id: '68be85c7094d08828defa261', name: 'Tillbehörskit NOBO MoveMeet' },
    { id: '68be85c7094d08828defa264', name: 'Tillbehörskit NOBO MoveMeet Mod' },
    { id: '68be85c7094d08828defa265', name: 'Startset WOODEN 17-delar' },
    { id: '68be85c7094d08828defa266', name: 'Tillbehörsbox WOODEN glastavla' },
    { id: '68be85c7094d08828defa267', name: 'Pennhållare WOODEN glastavla' },
    { id: '68be85c7094d08828defa269', name: 'Glastavla Starter Kit LEGAMASTER' },
    { id: '68be85c7094d08828defa275', name: 'Startset tillbehör whiteboardtavla svart' },
    { id: '68be85c7094d08828defa280', name: 'Startpaket NOBO Whiteboardtavla' },
  ],

  // sportstrumpor (7 products)
  'sportstrumpor': [
    { id: '68be85b2094d08828def579b', name: 'Sportstrumpa, kort' },
    { id: '68be85b2094d08828def579c', name: 'Sneakerstrumpa' },
    { id: '68be85b4094d08828def5eb4', name: 'Sneakerstrumpa' },
    { id: '68be85b4094d08828def5f0f', name: 'Craft Sportstrumpa Progress' },
    { id: '68be85b4094d08828def5f10', name: 'Sportstrumpa, kort' },
    { id: '68be85b4094d08828def5f11', name: 'Sneakerstrumpa' },
    { id: '68be85b4094d08828def5f13', name: 'Craft Funktionsstrumpor Pro Control' },
  ],

  // billiga-t-shirt (7 products)
  'billiga-t-shirt': [
    { id: '68be85b7094d08828def6798', name: 'Basic-T Man 150' },
    { id: '68be85b7094d08828def679c', name: 'Printer - Light T-shirt Rsx' },
    { id: '68be85b7094d08828def679d', name: 'Printer - Light T-shirt Lady' },
    { id: '68be85b7094d08828def67a5', name: 'Basic-T Man 180' },
    { id: '68be85b7094d08828def67b0', name: 'Printer RED - Run Jr' },
    { id: '68be85e5094d08828df01e3c', name: 'Printer - Light T-shirt Rsx' },
    { id: '68be85e5094d08828df01e44', name: 'Printer - Light T-shirt Lady' },
  ],

  // kassaskrin-och-tillbehor (7 products)
  'kassaskrin-och-tillbehor': [
    { id: '68be85c3094d08828def90d4', name: 'Kassaskrin 115x150x80mm' },
    { id: '68be85c3094d08828def90d5', name: 'Kassaskrin 160x200x90mm mörkgrå' },
    { id: '68be85c3094d08828def90d6', name: 'Kassaskrin 115x150x80mm' },
    { id: '68be85c3094d08828def90d7', name: 'Kassaskrin 115x150x80mm' },
    { id: '68be85c3094d08828def90d9', name: 'Kassaskrin m. komb.lås 240x300x90mm mgrå' },
    { id: '68be85c3094d08828def90da', name: 'Kassaskrin stor 300x200x90mm svart' },
    { id: '68be85c3094d08828def90db', name: 'Kassaskrin medel 250x180x90mm röd' },
  ],

  // sjalvhaftande-ramar (7 products)
  'sjalvhaftande-ramar': [
    { id: '68be85c3094d08828def92c4', name: 'Plastficka rPET A4 självhäftande 5/fp' },
    { id: '68be85c3094d08828def92c5', name: 'Plastficka rPET A3 självhäftande 5/fp' },
    { id: '68be85c3094d08828def92c6', name: 'Magnetram DURAFRAME SUN UV A4 2/fp' },
    { id: '68be85c3094d08828def92c8', name: 'Magnetram självh. DJOIS A4 silv 2/fp' },
    { id: '68be85c3094d08828def92ca', name: 'Magnetram DURAFRAME A4 svart 5/fp' },
    { id: '68be85c3094d08828def92cb', name: 'Magnetram självh. DJOIS A4 rö/vi 2/fp' },
    { id: '68be85c3094d08828def92cc', name: 'Magnetram självh.DURAFRAME A3 silv 2/fp' },
  ],

  // brev-och-katalogstall (7 products)
  'brev-och-katalogstall': [
    { id: '68be85c4094d08828def936d', name: 'Katalogställ DURABLE ECO' },
    { id: '68be85c4094d08828def9375', name: 'Katalogställ DURABLE ECO' },
    { id: '68be85c4094d08828def9379', name: 'Akryllåda 300x300x110mm' },
    { id: '68be85c4094d08828def937a', name: 'Akryllåda 100x100x98mm' },
    { id: '68be85c4094d08828def937b', name: 'Akryllåda 150x150x102mm' },
    { id: '68be85c4094d08828def937c', name: 'Akryllåda 200x200x106mm' },
    { id: '68be85c4094d08828def9384', name: 'Katalogställ svart' },
  ],

  // visitkortshallare (7 products)
  'visitkortshallare': [
    { id: '68be85c4094d08828def9622', name: 'Visitkortsställ transparent' },
    { id: '68be85c4094d08828def9623', name: 'Visitkortssnurra DURABLE VISIFIX svart' },
    { id: '68be85c4094d08828def9624', name: 'Visitkorts/mobilhållare' },
    { id: '68be85c4094d08828def9626', name: 'Visitkortsställ DEFLECTO 1 fack transp' },
    { id: '68be85c4094d08828def9627', name: 'Visitkorts/mobilhållare' },
    { id: '68be85c4094d08828def9628', name: 'Visitkortshållare DURABLE aluminium' },
    { id: '68be85c4094d08828def9629', name: 'Visitkortsställ 4-fack transparent' },
  ],

  // ovriga-tillbehor (7 products)
  'ovriga-tillbehor': [
    { id: '68be85c4094d08828def9638', name: 'Sedelräknare SAFESCAN 2250 G2' },
    { id: '68be85c4094d08828def963a', name: 'Sedelräknare nr.6 diam 22mm 20/fp' },
    { id: '68be85c4094d08828def963b', name: 'Mynträknare SAFESCAN 1250' },
    { id: '68be85c4094d08828def963c', name: 'Sedelräknare nr.4 diam 17mm 20/fp' },
    { id: '68be85c4094d08828def963d', name: 'Sedelräknare nr.2 diam 12,5mm 20/fp' },
    { id: '68be85c4094d08828def963e', name: 'Sedelräknare nr.3 diam 15mm 20/fp' },
    { id: '68be85c4094d08828def963f', name: 'Sedelräknare nr.5 diam 19mm 20/fp' },
  ],

  // korthallare-clips (7 products)
  'korthallare-clips': [
    { id: '68be85c6094d08828def9cb2', name: 'Nyckelband rPET med karbinhake 10/fp' },
    { id: '68be85c6094d08828def9cb3', name: 'Jojo CARDKEEP med nyckelrin' },
    { id: '68be85c6094d08828def9cb4', name: 'Jojo CARDKEEP med plaststrip' },
    { id: '68be85c6094d08828def9cb5', name: 'Metallclip till korthållare plastficka' },
    { id: '68be85c6094d08828def9cb6', name: 'Korthållare DURABLE 1 kort transp. 25/fp' },
    { id: '68be85c6094d08828def9cb7', name: 'Metallclip DURABLE för korthållare 25/fp' },
    { id: '68be85c6094d08828def9cb8', name: 'Korthållare + clip CardKeep Reko 20' },
  ],

  // badrum (7 products)
  'badrum': [
    { id: '68be85ca094d08828defaba4', name: 'Brabantia Badrum Caddy' },
    { id: '68be85ca094d08828defaba5', name: 'Brabantia Mindset Badrumsavfallskärl' },
    { id: '68be85ca094d08828defac31', name: 'Hairtrimmer från Dahlbergs' },
    { id: '68be85ca094d08828defac32', name: 'Wellmark Happy Home presentförpackning' },
    { id: '68be85ce094d08828defc53c', name: 'Hydra pannband' },
    { id: '68be85d4094d08828defdba3', name: 'Glaffy badrumsvåg' },
    { id: '68be85d4094d08828defe038', name: 'Hedon tre-delat badrumsset i bambu' },
  ],

  // accessories (6 products)
  'accessories': [
    { id: '68be85ae094d08828def4a04', name: 'Siena Scarf' },
    { id: '68be85ae094d08828def4a05', name: 'Marlow Stretch Belt' },
    { id: '68be85d2094d08828defd262', name: 'Siena Beanie' },
    { id: '68be85d2094d08828defd263', name: 'W´s Siena Leather Gloves' },
    { id: '68be85d2094d08828defd264', name: 'Siena Leather Gloves' },
    { id: '68be85de094d08828df00774', name: 'OA05 - Polokrage' },
  ],

  // understallstrojor (6 products)
  'understallstrojor': [
    { id: '68be85b4094d08828def5f59', name: 'Wool Original Roll-neck with zip' },
    { id: '68be85b4094d08828def5f5a', name: 'Wool Original Hoodie Full Zip' },
    { id: '68be85b5094d08828def6124', name: 'Wool Original Round Neck' },
    { id: '68be85e2094d08828df014dd', name: 'Wool Original Round Neck' },
    { id: '68be85e2094d08828df014df', name: 'Wool Original Roll-neck with zip' },
    { id: '68be85e2094d08828df014e0', name: 'Wool Original Hoodie Full Zip' },
  ],

  // v-ringade-trojor (6 products)
  'v-ringade-trojor': [
    { id: '68be85b5094d08828def6426', name: 'Printer - Forehand' },
    { id: '68be85b5094d08828def6428', name: 'Printer - Forehand Lady' },
    { id: '68be85b6094d08828def64b7', name: 'Pima Cotton V-Neck' },
    { id: '68be85e2094d08828df013c3', name: 'Pima Cotton V-Neck' },
    { id: '68be85e5094d08828df01f32', name: 'Printer - Forehand' },
    { id: '68be85e5094d08828df01f37', name: 'Printer - Forehand Lady' },
  ],

  // elfordon (6 products)
  'elfordon': [
    { id: '68be85be094d08828def7c1c', name: 'RAWBIKE 250E | Flera färger' },
    { id: '68be85be094d08828def7c1d', name: 'Abus Skurb Hjälm | Flera storlekar' },
    { id: '68be85e5094d08828df01d89', name: 'RAWBIKE 4X | Flera färger' },
    { id: '68be85e5094d08828df01d8a', name: 'RAWBIKE 250E | Flera färger' },
    { id: '68be85e5094d08828df01d8b', name: 'RAWBIKE URBAN | Flera färger' },
    { id: '68be85e5094d08828df01d8c', name: 'Abus Skurb Hjälm | Flera storlekar' },
  ],

  // bagageband (6 products)
  'bagageband': [
    { id: '68be85be094d08828def7f04', name: 'Valo - Bagageband/rem' },
    { id: '68be85cd094d08828defb97d', name: 'Bagageband 3 pack' },
    { id: '68be85cd094d08828defb97e', name: 'Bagageband, Vävda bagageband (1700 mm)' },
    { id: '68be85d1094d08828defcdf9', name: 'Resekit - Bagageband och bagagetag' },
    { id: '68be85d1094d08828defcf6a', name: 'Bagageband Fabriksbeställning' },
    { id: '68be85e8094d08828df0296c', name: 'Valo - Bagageband/rem' },
  ],

  // bokstod (6 products)
  'bokstod': [
    { id: '68be85c3094d08828def9313', name: 'Bokstöd 230X150mm svart 2-pack' },
    { id: '68be85c3094d08828def9314', name: 'Bokstöd DJOIS Eco 2/fp' },
    { id: '68be85c3094d08828def9315', name: 'Bokstöd med hyllklämma till vänster vit' },
    { id: '68be85c3094d08828def9316', name: 'Bokstöd med hyllklämma till höger vit' },
    { id: '68be85c3094d08828def9317', name: 'Bokstöd DJOIS Eco 2/fp' },
    { id: '68be85c3094d08828def9318', name: 'Bokstöd metall 15cm, Vit 2/fp' },
  ],

  // paperclips (6 products)
  'paperclips': [
    { id: '68be85c4094d08828def93d6', name: 'Gem Koppar 25mm 100/fp' },
    { id: '68be85c4094d08828def93d8', name: 'Gem koppar 45mm 1 kg' },
    { id: '68be85c4094d08828def93de', name: 'Gem koppar 32 mm 1 kg' },
    { id: '68be85c4094d08828def93df', name: 'Gem koppar 25 mm 1 kg' },
    { id: '68be85c4094d08828def93e1', name: 'Gem Koppar 32 mm 100/fp' },
    { id: '68be85c4094d08828def93e2', name: 'Gem koppar 45mm 100/fp' },
  ],

  // visitkortsparmar (6 products)
  'visitkortsparmar': [
    { id: '68be85c4094d08828def962a', name: 'Visitkortspärm extrafickor 10/fp' },
    { id: '68be85c4094d08828def962b', name: 'Visitkortsficka självhäft. 60x95mm 10/fp' },
    { id: '68be85c4094d08828def962c', name: 'Visitkortsficka DURABLE 10/fp' },
    { id: '68be85c4094d08828def962d', name: 'Visitkortsbok DURABLE VISIFIX®' },
    { id: '68be85c4094d08828def962e', name: 'Visitkortspärm för 160 kort svart' },
    { id: '68be85c4094d08828def962f', name: 'Visitkortsficka A4 10/fp' },
  ],

  // verktygsset (6 products)
  'verktygsset': [
    { id: '68be85cd094d08828defb822', name: 'Pitstop' },
    { id: '68be85cd094d08828defb854', name: 'Bits sats' },
    { id: '68be85cd094d08828defb856', name: 'SCX.design T20 30-delars skruvmejsel- och reparationssats i aluminiumfodral' },
    { id: '68be85ce094d08828defc2ab', name: 'Screy - 32-delars bitsats' },
    { id: '68be85d1094d08828defd0f5', name: 'Verktygssats, i läderfodral, Lani' },
    { id: '68be85d3094d08828defd90c', name: 'Bartlett - Verktygssats i bambufodral' },
  ],

  // bagagevagar (6 products)
  'bagagevagar': [
    { id: '68be85cd094d08828defb986', name: 'Bagagevåg Lift Off' },
    { id: '68be85cd094d08828defb987', name: 'Fickvåg' },
    { id: '68be85cd094d08828defb988', name: 'Bagagevåg' },
    { id: '68be85e7094d08828df024c5', name: 'Newark bagagevåg' },
    { id: '68be85e9094d08828df02c28', name: 'Weighit - Bagagevåg' },
    { id: '68be85e9094d08828df02ccb', name: 'Weighit - Bagagevåg' },
  ],

  // arkiveringstillbehor (6 products)
  'arkiveringstillbehor': [
    { id: '68be85dd094d08828df0054e', name: 'Bindmekanism LYRECO 80mm 50/fp' },
    { id: '68be85dd094d08828df0054f', name: 'Pappersspjut ACTUAL 155mm svart' },
    { id: '68be85dd094d08828df00550', name: 'Bindmekanism FELLOWES EU-hålning 100/fp' },
    { id: '68be85dd094d08828df00551', name: 'Påsnit LYRECO 30mm 100/fp' },
    { id: '68be85dd094d08828df00552', name: 'Bindmekanism Snap-clip svensk hål 50/fp' },
    { id: '68be85dd094d08828df00553', name: 'Bindmekanism F-binder svensk håln.100/fp' },
  ],

  // supporterprodukter (5 products)
  'supporterprodukter': [
    { id: '68be85ae094d08828def4a38', name: 'Ansiktsfärg Colornation' },
    { id: '68be85b0094d08828def4fd4', name: 'Clappy RPP-klämma' },
    { id: '68be85be094d08828def7cc3', name: 'Ansiktsfärg Colornation' },
    { id: '68be85be094d08828def7dce', name: 'Clappy RPP-klämma' },
    { id: '68be85ca094d08828defa91b', name: 'Medalj, av trä, Trämedalj, Koa' },
  ],

  // picknickvaskor (5 products)
  'picknickvaskor': [
    { id: '68be85b2094d08828def56fb', name: 'Shoppingväska/picknickväska polyester (600D) Nadine' },
    { id: '68be85b2094d08828def572c', name: 'Picknickryggsäck Polyester (600D) Allison' },
    { id: '68be85d4094d08828defdfa9', name: 'Picknick-ryggsäck med kylfack, i polyester (600D) Izaro' },
    { id: '68be85d4094d08828defe113', name: 'Picknick ryggsäck för 4 personer, Neo' },
    { id: '68be85ea094d08828df02e3d', name: 'Shoppingväska/picknickväska polyester (600D) Nadine' },
  ],

  // vastar-barn (5 products)
  'vastar-barn': [
    { id: '68be85b3094d08828def592c', name: 'Reflexväst för barn med tryck' },
    { id: '68be85b3094d08828def592d', name: 'Reflexväxt Barn med tryck' },
    { id: '68be85b4094d08828def5f31', name: 'Reflexväxt Barn med tryck' },
    { id: '68be85e9094d08828df02a97', name: 'Reflexväst för barn med tryck' },
    { id: '68be85e9094d08828df02b69', name: 'Reflexväxt Barn med tryck' },
  ],

  // traningsunderklader (5 products)
  'traningsunderklader': [
    { id: '68be85b4094d08828def5ef7', name: 'Women"s Cool Sports Crop Top' },
    { id: '68be85b4094d08828def5ef8', name: 'Women"s TriDri® performance sports bra' },
    { id: '68be85d5094d08828defe539', name: 'TriDri® Boxer Briefs' },
    { id: '68be85d5094d08828defe53a', name: 'Women"s Cross Back Crop Top' },
    { id: '68be85d5094d08828defe53b', name: 'Womens TriDri® Performance Sports Mid Length Bra (' },
  ],

  // selfiepinnar (5 products)
  'selfiepinnar': [
    { id: '68be85c0094d08828def854d', name: 'Selfiepinne med EVA-handtag Ursula' },
    { id: '68be85d1094d08828defcf21', name: 'Influp selfie-stativ' },
    { id: '68be85d4094d08828defdca9', name: 'Helie - Mobil Selfie ring ljus' },
    { id: '68be85d4094d08828defdd57', name: 'Helo - 26cm Selfie LED ring ljus' },
    { id: '68be85e9094d08828df02c5d', name: 'Selfiepinne med EVA-handtag Ursula' },
  ],

  // mobilarmband (5 products)
  'mobilarmband': [
    { id: '68be85c0094d08828def85ce', name: 'Foban mobil armband fodral' },
    { id: '68be85cd094d08828defb8b4', name: 'Runfree anpassat armbandsfodral för mobil' },
    { id: '68be85d4094d08828defdf8d', name: 'CONFOR. PU-armband och softshell för 6.5" smartphone' },
    { id: '68be85d4094d08828defe107', name: 'Mobilarmband i ABS med tryck' },
    { id: '68be85e6094d08828df02386', name: 'Foban mobil armband fodral' },
  ],

  // vaxduksbocker (5 products)
  'vaxduksbocker': [
    { id: '68be85c3094d08828def90a7', name: 'Vaxduksbok A6 72 blad, linjerat' },
    { id: '68be85c3094d08828def90a8', name: 'Vaxduksbok A7 48 blad, linjerat' },
    { id: '68be85c3094d08828def90a9', name: 'Vaxduksbok A5 med register 72 blad' },
    { id: '68be85c3094d08828def90aa', name: 'Vaxduksbok A6 med register 72 blad' },
    { id: '68be85c3094d08828def90ab', name: 'Vaxduksbok A5 72 blad, linjerat' },
  ],

  // kundkorg (5 products)
  'kundkorg': [
    { id: '68be85c6094d08828def9eb6', name: 'Kundkorg 27L' },
    { id: '68be85c6094d08828def9eb7', name: 'Kundkorg 27L' },
    { id: '68be85c6094d08828def9eb8', name: 'Kundkorg 27L' },
    { id: '68be85c6094d08828def9eb9', name: 'Kundkorg 27L svart exklusiv' },
    { id: '68be85c6094d08828def9eba', name: 'Korgvagn m hjul för 27L' },
  ],

  // taveltorkare (5 products)
  'taveltorkare': [
    { id: '68be85c7094d08828defa299', name: 'Refillpads WOODEN för taveltorkare 10/fp' },
    { id: '68be85c7094d08828defa29a', name: 'Microfiberduk 40x40cm' },
    { id: '68be85c7094d08828defa29b', name: 'Taveltorkare WOODEN magnetisk' },
    { id: '68be85c7094d08828defa29c', name: 'MagicWipe torkduk 2/fp' },
    { id: '68be85c7094d08828defa29d', name: 'Torkdukar för TZ4 taveltorkare 100/fp' },
  ],

  // bagagelas (5 products)
  'bagagelas': [
    { id: '68be85cd094d08828defb97f', name: 'Kombinationslås för resväska' },
    { id: '68be85cd094d08828defb980', name: 'SCX.design T11 smart hänglås med fingeravtryck' },
    { id: '68be85cd094d08828defb981', name: 'SCX.design T10 hänglås som öppnas med fingeravtryck' },
    { id: '68be85d6094d08828defe593', name: 'Bagagetagg Far Away' },
    { id: '68be85e6094d08828df02261', name: 'Baiyun Bagagelås' },
  ],

  // traningsvastar (4 products)
  'traningsvastar': [
    { id: '68be85b4094d08828def5f5e', name: 'Hi vis reflective border tabard (HVJ259)' },
    { id: '68be85b4094d08828def5f60', name: 'Warmup' },
    { id: '68be85d3094d08828defd8a1', name: 'Craft Reflexväst' },
    { id: '68be85e8094d08828df026e8', name: 'Warmup' },
  ],

  // usb-hub (4 products)
  'usb-hub': [
    { id: '68be85c0094d08828def8698', name: 'Dorian' },
    { id: '68be85cd094d08828defb87f', name: 'Fyra Bamboo Hub' },
    { id: '68be85cd094d08828defb881', name: 'PD Hub Type C' },
    { id: '68be85e4094d08828df01aac', name: 'Xoopar Cubbi Hub' },
  ],

  // haftpistoler-och-hafttanger (4 products)
  'haftpistoler-och-hafttanger': [
    { id: '68be85c4094d08828def94a1', name: 'Häftpistol RAPID R23' },
    { id: '68be85c4094d08828def94a2', name: 'Häftpistol RAPID R13 Ergonomic' },
    { id: '68be85c4094d08828def94a3', name: 'Häftpistol RAPID ECO svart' },
    { id: '68be85c4094d08828def94a4', name: 'Häftpistol RAPID PRO R33E' },
  ],

  // stalryggsparmar (4 products)
  'stalryggsparmar': [
    { id: '68be85c4094d08828def95c2', name: 'Gaffelpärm Agrippa A4+ 60mm' },
    { id: '68be85c4094d08828def95c3', name: 'Gaffelpärm Agrippa A4+ 60mm' },
    { id: '68be85c4094d08828def95c4', name: 'Gaffelpärm Agrippa A4+ 60mm' },
    { id: '68be85c4094d08828def95c5', name: 'Gaffelpärm Agrippa A4+ 60mm' },
  ],

  // pappersregister (4 products)
  'pappersregister': [
    { id: '68be85c4094d08828def9702', name: 'Pappersreg. EXACOMPTA Forever A4 12-del' },
    { id: '68be85c4094d08828def9707', name: 'Pappersreg EXACOMPTA Forever A4 10-del' },
    { id: '68be85c4094d08828def9709', name: 'Pappersreg EXACOMPTA Forever A4 5-del' },
    { id: '68be85c4094d08828def970b', name: 'Pappersreg EXACOMPTA Forever A4 6-del' },
  ],

  // powerbank-multifunktion (4 products)
  'powerbank-multifunktion': [
    { id: '68be85d0094d08828defcac9', name: 'Wusic - 15W trådlös laddningshögtalare' },
    { id: '68be85d3094d08828defd7e1', name: 'Vevradio med ficklampa och solcell' },
    { id: '68be85d4094d08828defe09e', name: 'Powerset - Datortillbehör påse' },
    { id: '68be85d5094d08828defe311', name: 'SCX.design O16 light-up A5-anteckningsbok med powerbank' },
  ],

  // powerbank-egen-design (3 products)
  'powerbank-egen-design': [
    { id: '68be85ae094d08828def4a2e', name: 'Nödradio, Multifunktionell handvevad nödradio' },
    { id: '68be85b2094d08828def5650', name: 'Nödradio, Multifunktionell handvevad nödradio' },
    { id: '68be85c9094d08828defa7ee', name: 'Sinox Bluetooth® nödradio. Grön' },
  ],

  // mobler (3 products)
  'mobler': [
    { id: '68be85b1094d08828def531d', name: 'Original Outdoor Sittsäck' },
    { id: '68be85ca094d08828defaba1', name: 'Sinox Bluetooth® högtalare och bord i svart' },
    { id: '68be85ca094d08828defaba2', name: 'Sinox Bluetooth® högtalare och bord i vitt' },
  ],

  // barn-trojor (3 products)
  'barn-trojor': [
    { id: '68be85b2094d08828def582d', name: 'Klassisk collegetröja, barn' },
    { id: '68be85b5094d08828def6431', name: 'Klassisk collegetröja, barn' },
    { id: '68be85b8094d08828def69be', name: 'Klassisk collegetröja, barn' },
  ],

  // vastar-dam (3 products)
  'vastar-dam': [
    { id: '68be85b3094d08828def593b', name: 'Dunväst, dam' },
    { id: '68be85b3094d08828def593d', name: 'Fodrad Väst Nautilus Dam' },
    { id: '68be85d6094d08828defe595', name: 'Quiltad Väst Tarah Dam' },
  ],

  // langarmade-t-shirt (3 products)
  'langarmade-t-shirt': [
    { id: '68be85b7094d08828def66f2', name: 'Nebraska T-shirt lång ärm' },
    { id: '68be85b7094d08828def66f5', name: 'Printer - Heavy T-shirt L/s' },
    { id: '68be85e5094d08828df01f34', name: 'Printer - Heavy T-shirt L/s' },
  ],

  // usb-minnen-nyckelring (3 products)
  'usb-minnen-nyckelring': [
    { id: '68be85b8094d08828def696e', name: 'USB-minne - Capsul' },
    { id: '68be85c0094d08828def83d4', name: 'USB-minne - Capsul' },
    { id: '68be85e9094d08828df02a29', name: 'USB-minne - Capsul' },
  ],

  // kortlador-och-tillbehor (3 products)
  'kortlador-och-tillbehor': [
    { id: '68be85c3094d08828def90dc', name: 'Kortlåda HAN A5L ljusgrå' },
    { id: '68be85c3094d08828def90dd', name: 'Kortlåda HAN A7L ljusgrå' },
    { id: '68be85c3094d08828def90de', name: 'Kortlåda HAN A6L ljusgrå' },
  ],

  // golvstaende-tavlor (3 products)
  'golvstaende-tavlor': [
    { id: '68be85c6094d08828def9f77', name: 'Glastavla mobil LINTEX 650x1960mm' },
    { id: '68be85c6094d08828def9f78', name: 'Glastavla mobil LINTEX 650x1960mm' },
    { id: '68be85c6094d08828def9f7b', name: 'Glastavla mobil LINTEX mobilt svart' },
  ],

  // korrigeringsvatska (3 products)
  'korrigeringsvatska': [
    { id: '68be85c6094d08828def9f89', name: 'Korrigeringsvätska Soft Tip 25g' },
    { id: '68be85c6094d08828def9f8a', name: 'Korrigeringsvätska LYRECO 20ml' },
    { id: '68be85c6094d08828def9f8b', name: 'Korrigeringsvätska PRITT 20ml' },
  ],

  // whiteboardtavlor-a4-och-a5 (3 products)
  'whiteboardtavlor-a4-och-a5': [
    { id: '68be85c8094d08828defa311', name: 'Whiteboard kontorstavla A4 vit' },
    { id: '68be85c8094d08828defa312', name: 'Whiteboard kontorstavla linjerad A5' },
    { id: '68be85c8094d08828defa315', name: 'Whiteboard kontorstavla A5 vit' },
  ],

  // smycken (3 products)
  'smycken': [
    { id: '68be85d0094d08828defcd22', name: 'Fauleti - Armband i flätat konstläder' },
    { id: '68be85d1094d08828defce05', name: 'Faulet - Armband i flätat konstläder' },
    { id: '68be85d2094d08828defd4f5', name: 'I love pride armband' },
  ],

  // notebooks (3 products)
  'notebooks': [
    { id: '68be85dd094d08828df0054b', name: 'Konferensblock LYRECO A5 70g 10bl linj' },
    { id: '68be85dd094d08828df0054c', name: 'Konferensblock A4 60g 25bl linj hålat' },
    { id: '68be85dd094d08828df0054d', name: 'Konferensblock A4 70g 10 blad linjerat' },
  ],

  // miniflaktar (2 products)
  'miniflaktar': [
    { id: '68be85b0094d08828def4f94', name: 'Blobile smartphone-fan' },
    { id: '68be85d4094d08828defdcd1', name: 'Nadira - Bordsfläkt' },
  ],

  // ekologiska-piketrojor (2 products)
  'ekologiska-piketrojor': [
    { id: '68be85b2094d08828def587e', name: 'Prince kortärmad piké ekologisk bomull dam' },
    { id: '68be85e4094d08828df01b8e', name: 'Prince kortärmad piké ekologisk bomull dam' },
  ],

  // understall (2 products)
  'understall': [
    { id: '68be85b3094d08828def5928', name: 'Wool Original Long Johns' },
    { id: '68be85e2094d08828df014de', name: 'Wool Original Long Johns' },
  ],

  // sportvastar (2 products)
  'sportvastar': [
    { id: '68be85b4094d08828def5ea8', name: 'Printer - Trial Vest Lady' },
    { id: '68be85e5094d08828df01e55', name: 'Printer - Trial Vest Lady' },
  ],

  // powerbank-anteckningsbok (2 products)
  'powerbank-anteckningsbok': [
    { id: '68be85ba094d08828def71d9', name: 'Nao - Konferens/Dokumentmapp - A5' },
    { id: '68be85e9094d08828df02bb1', name: 'Nao - Konferens/Dokumentmapp - A5' },
  ],

  // billiga-usb-minnen (2 products)
  'billiga-usb-minnen': [
    { id: '68be85c0094d08828def83eb', name: 'USB 2.0 T-Shirt' },
    { id: '68be85ea094d08828df02dbd', name: 'USB 2.0 T-Shirt' },
  ],

  // powerbank-slim (2 products)
  'powerbank-slim': [
    { id: '68be85c0094d08828def84fc', name: 'Powerflat8 - Power Bank 8000 mAh' },
    { id: '68be85ea094d08828df02e93', name: 'Powerflat8 - Power Bank 8000 mAh' },
  ],

  // powerbank-solcell (2 products)
  'powerbank-solcell': [
    { id: '68be85c0094d08828def8505', name: 'Solar Powerflat - Solcells power bank 8000 mAh' },
    { id: '68be85ea094d08828df02e92', name: 'Solar Powerflat - Solcells power bank 8000 mAh' },
  ],

  // balansredskap (2 products)
  'balansredskap': [
    { id: '68be85c3094d08828def9311', name: 'Sittboll JOBOUT Ø65' },
    { id: '68be85c3094d08828def9312', name: 'Balansplatta JOBOUT Aktiv 60x39x11cm sva' },
  ],

  // arkivparmar (2 products)
  'arkivparmar': [
    { id: '68be85c4094d08828def9640', name: 'Arkivpärm A5 60mm brun' },
    { id: '68be85c4094d08828def9641', name: 'Arkivpärm A4 kartong 60mm beige' },
  ],

  // europaparmar (2 products)
  'europaparmar': [
    { id: '68be85c4094d08828def9666', name: 'Pärm EU-hålning PP A4 50mm svart' },
    { id: '68be85c4094d08828def966d', name: 'Pärm EU-hålning PP A4 80mm svart' },
  ],

  // hallare-for-pennor-och-taveltork (2 products)
  'hallare-for-pennor-och-taveltork': [
    { id: '68be85c7094d08828defa1f8', name: 'Tillbehörsbox glastavla svart' },
    { id: '68be85c7094d08828defa1fa', name: 'Pennhylla Cup Magnetic' },
  ],

  // kombinationstavlor (2 products)
  'kombinationstavlor': [
    { id: '68be85c7094d08828defa25f', name: 'Kombinationstavla NOBO 90x120cm' },
    { id: '68be85c7094d08828defa260', name: 'Kombinationstavla NOBO 60x90cm' },
  ],

  // whiteboardtavlor-lackerad-stal (2 products)
  'whiteboardtavlor-lackerad-stal': [
    { id: '68be85c7094d08828defa2c6', name: 'board NOBO MoveMeet 180x90cm' },
    { id: '68be85c7094d08828defa2c8', name: 'board NOBO MoveMeet 180x90cm' },
  ],

  // usb-lampor (2 products)
  'usb-lampor': [
    { id: '68be85ce094d08828defc13b', name: 'Lushlet - Inomhusträdgård med LED-ljus' },
    { id: '68be85d1094d08828defd1c2', name: 'Laptoplampa, ABS och metall Lola' },
  ],

  // 418885894-892112 (1 products)
  '418885894-892112': [
    { id: '68be85ad094d08828def4593', name: 'GIBRALTAR. Återvunnen presentväska av bomull (70%), polyester (30% rPET) (140 g/m²)' },
  ],

  // 375996474-843286 (1 products)
  '375996474-843286': [
    { id: '68be85ad094d08828def4594', name: 'THC MONACO WOMEN. Dam piketröja' },
  ],

  // 451066322-963803 (1 products)
  '451066322-963803': [
    { id: '68be85ad094d08828def4597', name: '75089. Lanyard Tube Long Set II. Standard modeller' },
  ],

  // 375998798-843294 (1 products)
  '375998798-843294': [
    { id: '68be85ad094d08828def4598', name: 'THC BERLIN WOMEN. Dam piketröja' },
  ],

  // 500207302-1220078 (1 products)
  '500207302-1220078': [
    { id: '68be85ad094d08828def45a1', name: 'Lanyard Tube Long Set I. Standard modeller' },
  ],

  // 500206140-1220068 (1 products)
  '500206140-1220068': [
    { id: '68be85ad094d08828def45a2', name: 'Lanyard Tube Short Set. Standard modeller' },
  ],

  // 500204978-1220051 (1 products)
  '500204978-1220051': [
    { id: '68be85ad094d08828def45a4', name: 'Lanyard Tube Long Set II. Standard modeller' },
  ],

  // 447149220-956103 (1 products)
  '447149220-956103': [
    { id: '68be85ad094d08828def45a7', name: 'THC PIXEL 3XL. Kroppsvärmare med flera fickor' },
  ],

  // 553236334-1600726 (1 products)
  '553236334-1600726': [
    { id: '68be85ad094d08828def464a', name: 'Revent RPET nyckelband' },
  ],

  // 477458828-1087853 (1 products)
  '477458828-1087853': [
    { id: '68be85ad094d08828def464d', name: 'Kaipi nyckelring med flasköppnare' },
  ],

  // 477457666-1087849 (1 products)
  '477457666-1087849': [
    { id: '68be85ad094d08828def4657', name: 'Ralager kapsylöppnare' },
  ],

  // 447156192-956130 (1 products)
  '447156192-956130': [
    { id: '68be85ad094d08828def4695', name: 'THC FAIR. T-shirt i 100 % bomull' },
  ],

  // 447160840-956147 (1 products)
  '447160840-956147': [
    { id: '68be85ad094d08828def4696', name: 'THC TUBE. Polyester (90 %) t-shirt' },
  ],

  // 447146896-956095 (1 products)
  '447146896-956095': [
    { id: '68be85ad094d08828def4697', name: 'THC FAIR SMALL. T-shirt i 100 % bomull' },
  ],

  // 454079388-972205 (1 products)
  '454079388-972205': [
    { id: '68be85ad094d08828def475c', name: 'Florens, bagagetag' },
  ],

  // 59143476-94872 (1 products)
  '59143476-94872': [
    { id: '68be85ad094d08828def477c', name: 'Applådstavar 2-pack - Standard' },
  ],

  // 473148970-1057818 (1 products)
  '473148970-1057818': [
    { id: '68be85ad094d08828def4785', name: 'Perfect Lsl Men - PERFECT HERR L.Ä. POLO PIQ' },
  ],

  // 489485528-1153438 (1 products)
  '489485528-1153438': [
    { id: '68be85ad094d08828def478b', name: 'Stream Bw Men - STREAM HERR VÄST' },
  ],

  // 493732638-1186187 (1 products)
  '493732638-1186187': [
    { id: '68be85ad094d08828def4792', name: 'Pegase - PEGASE Pique ekologisk 210g' },
  ],

  // 336432698-1555459 (1 products)
  '336432698-1555459': [
    { id: '68be85ad094d08828def47e7', name: 'T-Shirt Round Neck' },
  ],

  // 336437346-722389 (1 products)
  '336437346-722389': [
    { id: '68be85ad094d08828def47f7', name: 'Polo Piqué Shirt' },
  ],

  // 461449954-991477 (1 products)
  '461449954-991477': [
    { id: '68be85ad094d08828def4828', name: 'Presentband' },
  ],

  // 461455764-991493 (1 products)
  '461455764-991493': [
    { id: '68be85ad094d08828def482a', name: 'Presentband' },
  ],

  // 493732638-1186185 (1 products)
  '493732638-1186185': [
    { id: '68be85ad094d08828def482e', name: 'Pegase - PEGASE Pique ekologisk 210g' },
  ],

  // 493727990-1624425 (1 products)
  '493727990-1624425': [
    { id: '68be85ad094d08828def4835', name: 'Re Crusader - RE CRUSADER T-shirt 150g' },
  ],

  // 448635418-958218 (1 products)
  '448635418-958218': [
    { id: '68be85ad094d08828def4845', name: 'Subiner YoYo RPET Nyckelring' },
  ],

  // 495010838-1191365 (1 products)
  '495010838-1191365': [
    { id: '68be85ad094d08828def4851', name: 'THC RUN. Sportstrumpa' },
  ],

  // 461451116-991484 (1 products)
  '461451116-991484': [
    { id: '68be85ad094d08828def4869', name: 'Presentband' },
  ],

  // 473150132-1057826 (1 products)
  '473150132-1057826': [
    { id: '68be85ad094d08828def4879', name: 'Wilson Bw Men - WILSON BW HERR 380T' },
  ],

  // 489486690-1153442 (1 products)
  '489486690-1153442': [
    { id: '68be85ad094d08828def487f', name: 'Stream Bw Women - STREAM DAM VÄST' },
  ],

  // 553892864-1619407 (1 products)
  '553892864-1619407': [
    { id: '68be85ad094d08828def48ad', name: 'Lanyard NAUTIC Long Set I. Standard modeller' },
  ],

  // 473147808-1057816 (1 products)
  '473147808-1057816': [
    { id: '68be85ad094d08828def48f5', name: 'Perfect Lsl Women - PERFECT DAM LSL POLO 180' },
  ],

  // 195379842-639003 (1 products)
  '195379842-639003': [
    { id: '68be85ad094d08828def4905', name: 'BARLEY. Flaska öppnare av aluminium' },
  ],

  // 495024782-1191399 (1 products)
  '495024782-1191399': [
    { id: '68be85ad094d08828def4915', name: 'THC CLOUD. Vadderad väst (unisex)' },
  ],

  // 336480340-722641 (1 products)
  '336480340-722641': [
    { id: '68be85ae094d08828def4928', name: 'Unisex Triblend Crew Neck T-Shirt' },
  ],

  // 532261072-1507240 (1 products)
  '532261072-1507240': [
    { id: '68be85ae094d08828def4934', name: 'Essential Crew 3-p Socks' },
  ],

  // 553232848-1600700 (1 products)
  '553232848-1600700': [
    { id: '68be85ae094d08828def494b', name: 'Revent Plus RPET nyckelband' },
  ],

  // 473151294-1057829 (1 products)
  '473151294-1057829': [
    { id: '68be85ae094d08828def4965', name: 'Wilson Bw Women - WILSON BW DAM 380T' },
  ],

  // 495024782-1191398 (1 products)
  '495024782-1191398': [
    { id: '68be85ae094d08828def4982', name: 'THC CLOUD. Vadderad väst (unisex)' },
  ],

  // 531246646-1511642 (1 products)
  '531246646-1511642': [
    { id: '68be85ae094d08828def49e0', name: 'Drizzle poncho' },
  ],

  // 477436750-1087805 (1 products)
  '477436750-1087805': [
    { id: '68be85ae094d08828def49e6', name: 'SuboGift L presentpåse med tryck, stor' },
  ],

  // 477433264-1087798 (1 products)
  '477433264-1087798': [
    { id: '68be85ae094d08828def49e8', name: 'SuboGift M presentpåse med tryck, medium' },
  ],

  // 435552460-950396 (1 products)
  '435552460-950396': [
    { id: '68be85ae094d08828def4a31', name: 'Presentpåse i papper Mariano' },
  ],

  // 435409534-950196 (1 products)
  '435409534-950196': [
    { id: '68be85ae094d08828def4a34', name: 'Flasköppnare i plast Tay' },
  ],

  // 524969522-1467665 (1 products)
  '524969522-1467665': [
    { id: '68be85ae094d08828def4adc', name: 'Tuner - TUNER T-SHIRT' },
  ],

  // 500805732-1225591 (1 products)
  '500805732-1225591': [
    { id: '68be85af094d08828def4bb7', name: 'Sancho strandtofflor' },
  ],

  // 477485554-1087896 (1 products)
  '477485554-1087896': [
    { id: '68be85af094d08828def4bc6', name: 'Rescrap isskrapa' },
  ],

  // 549743362-1586410 (1 products)
  '549743362-1586410': [
    { id: '68be85af094d08828def4c0f', name: 'Ezra - Veganskt läppbalsam' },
  ],

  // 24002272-361674 (1 products)
  '24002272-361674': [
    { id: '68be85af094d08828def4c1a', name: 'Profilerbar kyl med egen design' },
  ],

  // 23999948-461560 (1 products)
  '23999948-461560': [
    { id: '68be85af094d08828def4c1c', name: 'Julmust med egen etikett' },
  ],

  // 477485554-1087895 (1 products)
  '477485554-1087895': [
    { id: '68be85af094d08828def4c90', name: 'Rescrap isskrapa' },
  ],

  // 495703390-1232023 (1 products)
  '495703390-1232023': [
    { id: '68be85af094d08828def4cd0', name: 'Max cushioning Premier Slip In Shoe' },
  ],

  // 553098056-1600380 (1 products)
  '553098056-1600380': [
    { id: '68be85af094d08828def4d62', name: 'Revent Call RPET nyckelband för mobilhållare' },
  ],

  // 553045766-1600294 (1 products)
  '553045766-1600294': [
    { id: '68be85af094d08828def4d68', name: 'Swirl RABS flasköppnare' },
  ],

  // 446318390-954408 (1 products)
  '446318390-954408': [
    { id: '68be85af094d08828def4d86', name: 'Cray drycool polo' },
  ],

  // 446263776-954262 (1 products)
  '446263776-954262': [
    { id: '68be85af094d08828def4d90', name: 'Cray drycool polo' },
  ],

  // 446264938-954273 (1 products)
  '446264938-954273': [
    { id: '68be85af094d08828def4d9e', name: 'Cray sleeveless' },
  ],

  // 446306770-954379 (1 products)
  '446306770-954379': [
    { id: '68be85af094d08828def4da0', name: 'Lytham softshell vest' },
  ],

  // 446338144-954462 (1 products)
  '446338144-954462': [
    { id: '68be85af094d08828def4da5', name: 'Dove sock 3-pack' },
  ],

  // 446253318-954233 (1 products)
  '446253318-954233': [
    { id: '68be85af094d08828def4db0', name: 'Lytham softshell vest' },
  ],

  // 552996962-1600200 (1 products)
  '552996962-1600200': [
    { id: '68be85af094d08828def4e25', name: 'Flintlight tändare' },
  ],

  // 552994638-1600192 (1 products)
  '552994638-1600192': [
    { id: '68be85af094d08828def4e29', name: 'Flatlight tändare' },
  ],

  // 553001610-1600209 (1 products)
  '553001610-1600209': [
    { id: '68be85af094d08828def4e3b', name: 'Jetlight jet tändare' },
  ],

  // 446320714-954424 (1 products)
  '446320714-954424': [
    { id: '68be85af094d08828def4e60', name: 'Loop t-shirt' },
  ],

  // 558598964-1616731 (1 products)
  '558598964-1616731': [
    { id: '68be85af094d08828def4e6f', name: 'Hammel recycled polo' },
  ],

  // 531488342-1512410 (1 products)
  '531488342-1512410': [
    { id: '68be85af094d08828def4ec9', name: 'Labicor Läppbalsam' },
  ],

  // 531365170-1512117 (1 products)
  '531365170-1512117': [
    { id: '68be85af094d08828def4ecc', name: 'Tublox Läppbalsam' },
  ],

  // 511649516-1323099 (1 products)
  '511649516-1323099': [
    { id: '68be85af094d08828def4ee2', name: 'Gift Bag Recycled S' },
  ],

  // 511650678-1323102 (1 products)
  '511650678-1323102': [
    { id: '68be85af094d08828def4ee3', name: 'Gift Bag Recycled M' },
  ],

  // 512367632-1331142 (1 products)
  '512367632-1331142': [
    { id: '68be85af094d08828def4ee6', name: 'Gift Bag Recycled L' },
  ],

  // 558597802-1616727 (1 products)
  '558597802-1616727': [
    { id: '68be85af094d08828def4efb', name: 'Pikewood drycool polo' },
  ],

  // 538982080-1535291 (1 products)
  '538982080-1535291': [
    { id: '68be85af094d08828def4efc', name: 'Grove hybrid vest' },
  ],

  // 558587344-1616709 (1 products)
  '558587344-1616709': [
    { id: '68be85af094d08828def4efd', name: 'Hammel recycled cupsleeve' },
  ],

  // 558588506-1616715 (1 products)
  '558588506-1616715': [
    { id: '68be85b0094d08828def4f01', name: 'Hammel recycled halfsleeve' },
  ],

  // 538979756-1535286 (1 products)
  '538979756-1535286': [
    { id: '68be85b0094d08828def4f06', name: 'Grove hybrid vest' },
  ],

  // 531488342-1512411 (1 products)
  '531488342-1512411': [
    { id: '68be85b0094d08828def4f3f', name: 'Labicor Läppbalsam' },
  ],

  // 531447672-1512284 (1 products)
  '531447672-1512284': [
    { id: '68be85b0094d08828def4f43', name: 'PivoBag anpassad RPET-ölpåse' },
  ],

  // 531446510-1512281 (1 products)
  '531446510-1512281': [
    { id: '68be85b0094d08828def4f4b', name: 'VinoBag RPET-vinpåse med tryck' },
  ],

  // 531361684-1512110 (1 products)
  '531361684-1512110': [
    { id: '68be85b0094d08828def4f4c', name: 'Lippa Läppbalsam' },
  ],

  // 488035352-1142854 (1 products)
  '488035352-1142854': [
    { id: '68be85b0094d08828def4f8a', name: 'Passerkortshållare Exklusiv' },
  ],

  // 501121796-1599968 (1 products)
  '501121796-1599968': [
    { id: '68be85b0094d08828def4f96', name: 'Orlando bagagetagg' },
  ],

  // 552950482-1600087 (1 products)
  '552950482-1600087': [
    { id: '68be85b0094d08828def4f98', name: 'Boofri kylskåpsmagnet, rektangel' },
  ],

  // 553237496-1600737 (1 products)
  '553237496-1600737': [
    { id: '68be85b0094d08828def4fde', name: 'Corphon RPET nyckelband för mobilhållare' },
  ],

  // 501124120-1226228 (1 products)
  '501124120-1226228': [
    { id: '68be85b0094d08828def5019', name: 'Tangerang bagagetagg' },
  ],

  // 531489504-1512415 (1 products)
  '531489504-1512415': [
    { id: '68be85b0094d08828def501c', name: 'Contor Läppbalsam' },
  ],

  // 531287316-1599980 (1 products)
  '531287316-1599980': [
    { id: '68be85b0094d08828def5022', name: 'Nordra väst med kroppsvärmare' },
  ],

  // 475753012-1080142 (1 products)
  '475753012-1080142': [
    { id: '68be85b0094d08828def5068', name: 'Passerkortshållare (pull reel)' },
  ],

  // 578516806-1721436 (1 products)
  '578516806-1721436': [
    { id: '68be85b0094d08828def5071', name: 'Explorer - Explorer T-shirt Unisex' },
  ],

  // bracelets (1 products)
  'bracelets': [
    { id: '68be85b0094d08828def5097', name: 'Atama - Pannband i polycotton' },
  ],

  // 583530836-1760130 (1 products)
  '583530836-1760130': [
    { id: '68be85b0094d08828def513a', name: 'Soc Large - Ett par julstrumpor L' },
  ],

  // 555002574-1608386 (1 products)
  '555002574-1608386': [
    { id: '68be85b0094d08828def514a', name: 'PP-ask läppbalsam Kimberly' },
  ],

  // 583529674-1760128 (1 products)
  '583529674-1760128': [
    { id: '68be85b0094d08828def516b', name: 'Soc Medium - Par julstrumpor M' },
  ],

  // 93840796-175830 (1 products)
  '93840796-175830': [
    { id: '68be85b0094d08828def529e', name: 'Korallrock 290g' },
  ],

  // 205906400-591551 (1 products)
  '205906400-591551': [
    { id: '68be85b0094d08828def529f', name: 'Badrock College' },
  ],

  // 159368300-633550 (1 products)
  '159368300-633550': [
    { id: '68be85b0094d08828def52a0', name: 'Sparock 150g' },
  ],

  // 124064416-265043 (1 products)
  '124064416-265043': [
    { id: '68be85b0094d08828def52a1', name: 'Velourbadrock 400g' },
  ],

  // 377914936-796933 (1 products)
  '377914936-796933': [
    { id: '68be85b0094d08828def52a2', name: 'Frottérock 450g' },
  ],

  // 306012700-633548 (1 products)
  '306012700-633548': [
    { id: '68be85b0094d08828def52a3', name: 'Frottérock Med Luva' },
  ],

  // 527222640-1483011 (1 products)
  '527222640-1483011': [
    { id: '68be85b0094d08828def52a4', name: 'Velourrock' },
  ],

  // 551116846-881951 (1 products)
  '551116846-881951': [
    { id: '68be85b0094d08828def52a5', name: 'Diamond Badrock Herr' },
  ],

  // 548698724-881954 (1 products)
  '548698724-881954': [
    { id: '68be85b0094d08828def52a6', name: 'Diamond Badrock Herr' },
  ],

  // 584944990-1066075 (1 products)
  '584944990-1066075': [
    { id: '68be85b0094d08828def52a7', name: 'Diamond Badrock Dam' },
  ],

  // 531447672-1512283 (1 products)
  '531447672-1512283': [
    { id: '68be85b2094d08828def5679', name: 'PivoBag anpassad RPET-ölpåse' },
  ],

  // 531446510-1512282 (1 products)
  '531446510-1512282': [
    { id: '68be85b2094d08828def567a', name: 'VinoBag RPET-vinpåse med tryck' },
  ],

  // 93840796-175829 (1 products)
  '93840796-175829': [
    { id: '68be85b2094d08828def56da', name: 'Korallrock 290g' },
  ],

  // 4098374-8200 (1 products)
  '4098374-8200': [
    { id: '68be85b2094d08828def573d', name: 'Badboll med tryck' },
  ],

  // 138598712-948534 (1 products)
  '138598712-948534': [
    { id: '68be85b2094d08828def573f', name: 'Uppblåsbar badboll med tryck' },
  ],

  // 495123552-1191597 (1 products)
  '495123552-1191597': [
    { id: '68be85b2094d08828def576a', name: 'MAUPITI S / M. Bekväma tofflor med PE-sula och PVC-band' },
  ],

  // 495124714-1191608 (1 products)
  '495124714-1191608': [
    { id: '68be85b2094d08828def576b', name: 'MAUPITI L / XL. Bekväma tofflor med PE-sula och PVC-band' },
  ],

  // 413941584-882951 (1 products)
  '413941584-882951': [
    { id: '68be85b2094d08828def5794', name: 'Canichie - Toffelstrumpor M' },
  ],

  // 583530836-1760129 (1 products)
  '583530836-1760129': [
    { id: '68be85b2094d08828def5795', name: 'Soc Large - Ett par julstrumpor L' },
  ],

  // 583529674-1760127 (1 products)
  '583529674-1760127': [
    { id: '68be85b2094d08828def5796', name: 'Soc Medium - Par julstrumpor M' },
  ],

  // 565002746-1185435 (1 products)
  '565002746-1185435': [
    { id: '68be85b2094d08828def5797', name: 'GEYSER stretch running socks' },
  ],

  // 375514244-789204 (1 products)
  '375514244-789204': [
    { id: '68be85b2094d08828def5798', name: 'Active Mid Sock 3-Pack' },
  ],

  // 196280392-450883 (1 products)
  '196280392-450883': [
    { id: '68be85b2094d08828def5799', name: 'Sport socks' },
  ],

  // 196279230-450875 (1 products)
  '196279230-450875': [
    { id: '68be85b2094d08828def579a', name: 'Sneaker socks' },
  ],

  // 147852880-338896 (1 products)
  '147852880-338896': [
    { id: '68be85b2094d08828def57a1', name: 'Långt Skohorn med tryck' },
  ],

  // 147854042-338899 (1 products)
  '147854042-338899': [
    { id: '68be85b2094d08828def57a2', name: 'Extra Långt Skohorn med tryck' },
  ],

  // 187192390-429116 (1 products)
  '187192390-429116': [
    { id: '68be85b2094d08828def57a3', name: 'Skohorn 130 mm' },
  ],

  // 486341156-1132618 (1 products)
  '486341156-1132618': [
    { id: '68be85b2094d08828def57a4', name: 'Sure Track Erath Work Shoe w' },
  ],

  // 486344642-1132622 (1 products)
  '486344642-1132622': [
    { id: '68be85b2094d08828def57a5', name: 'Relaxed Fit Flex Advantage Bendon Work Shoe' },
  ],

  // 486522428-1132911 (1 products)
  '486522428-1132911': [
    { id: '68be85b2094d08828def57a6', name: 'Bregman Shoe' },
  ],

  // 486631656-1133311 (1 products)
  '486631656-1133311': [
    { id: '68be85b2094d08828def57a7', name: 'Max Cushioning Delta Shoe w' },
  ],

  // 486346966-1132625 (1 products)
  '486346966-1132625': [
    { id: '68be85b2094d08828def57a8', name: 'Max Cushioning Delta Shoe' },
  ],

  // 446338144-954461 (1 products)
  '446338144-954461': [
    { id: '68be85b2094d08828def57af', name: 'Dove sock 3-pack' },
  ],

  // 495010838-1191364 (1 products)
  '495010838-1191364': [
    { id: '68be85b2094d08828def57b0', name: 'THC RUN. Sportstrumpa' },
  ],

  // 561417976-1628837 (1 products)
  '561417976-1628837': [
    { id: '68be85b2094d08828def57b2', name: 'Seger Basic Cotton 5-pack' },
  ],

  // 561416814-1628834 (1 products)
  '561416814-1628834': [
    { id: '68be85b2094d08828def57b3', name: 'Seger Basic Cotton Ribbed 3-pack' },
  ],

  // 534248092-1513236 (1 products)
  '534248092-1513236': [
    { id: '68be85b2094d08828def57b4', name: 'Skohorn metall 58 cm' },
  ],

  // 534246930-1513233 (1 products)
  '534246930-1513233': [
    { id: '68be85b2094d08828def57b5', name: 'Skohorn metall 31 cm' },
  ],

  // 562112852-1632284 (1 products)
  '562112852-1632284': [
    { id: '68be85b2094d08828def57b6', name: 'Leatherlace on role 50 M Shoelace' },
  ],

  // 554111320-1604463 (1 products)
  '554111320-1604463': [
    { id: '68be85b2094d08828def5833', name: 'Max Cushioning Exciton Endeavour Slip ins Shoe' },
  ],

  // 495123552-1191594 (1 products)
  '495123552-1191594': [
    { id: '68be85b2094d08828def58a2', name: 'MAUPITI S / M. Bekväma tofflor med PE-sula och PVC-band' },
  ],

  // 495124714-1191605 (1 products)
  '495124714-1191605': [
    { id: '68be85b2094d08828def58a3', name: 'MAUPITI L / XL. Bekväma tofflor med PE-sula och PVC-band' },
  ],

  // 545826260-1564593 (1 products)
  '545826260-1564593': [
    { id: '68be85b2094d08828def58a4', name: 'Printer - Shoelaces' },
  ],

  // 545825098-1564589 (1 products)
  '545825098-1564589': [
    { id: '68be85b2094d08828def58a5', name: 'Printer - Flex Sneakers' },
  ],

  // 568429484-1659821 (1 products)
  '568429484-1659821': [
    { id: '68be85b2094d08828def58a6', name: 'Flipflop' },
  ],

  // 485490572-1128948 (1 products)
  '485490572-1128948': [
    { id: '68be85b2094d08828def58a7', name: 'MASCOT® FOOTWEAR ORIGINALS' },
  ],

  // 568437618-1659852 (1 products)
  '568437618-1659852': [
    { id: '68be85b2094d08828def58a8', name: 'Flipflop' },
  ],

  // 568439942-1659862 (1 products)
  '568439942-1659862': [
    { id: '68be85b2094d08828def58a9', name: 'Flipflop' },
  ],

  // 568431808-1659837 (1 products)
  '568431808-1659837': [
    { id: '68be85b2094d08828def58aa', name: 'Flipflop' },
  ],

  // 568430646-1659830 (1 products)
  '568430646-1659830': [
    { id: '68be85b2094d08828def58ab', name: 'Flipflop' },
  ],

  // 568435294-1659845 (1 products)
  '568435294-1659845': [
    { id: '68be85b3094d08828def58c7', name: 'Flipflop' },
  ],

  // 568432970-1659839 (1 products)
  '568432970-1659839': [
    { id: '68be85b3094d08828def58c8', name: 'Flipflop' },
  ],

  // 568434132-1659842 (1 products)
  '568434132-1659842': [
    { id: '68be85b3094d08828def58c9', name: 'Flipflop' },
  ],

  // 579175660-1730006 (1 products)
  '579175660-1730006': [
    { id: '68be85b3094d08828def58ca', name: 'MASCOT® FOOTWEAR CASUAL' },
  ],

  // 500805732-1225592 (1 products)
  '500805732-1225592': [
    { id: '68be85b3094d08828def58cb', name: 'Sancho strandtofflor' },
  ],

  // 205906400-479456 (1 products)
  '205906400-479456': [
    { id: '68be85b3094d08828def58e5', name: 'Badrock College' },
  ],

  // 205912210-479481 (1 products)
  '205912210-479481': [
    { id: '68be85b3094d08828def58e6', name: 'Frottérock 445g' },
  ],

  // 159368300-362507 (1 products)
  '159368300-362507': [
    { id: '68be85b3094d08828def58e7', name: 'Sparock 150g' },
  ],

  // 377914936-796936 (1 products)
  '377914936-796936': [
    { id: '68be85b3094d08828def58e8', name: 'Frottérock 450g' },
  ],

  // 527222640-1588110 (1 products)
  '527222640-1588110': [
    { id: '68be85b3094d08828def58e9', name: 'Velourrock' },
  ],

  // 205192932-477781 (1 products)
  '205192932-477781': [
    { id: '68be85b3094d08828def58fb', name: 'Advantage Dress Women' },
  ],

  // 442324596-943331 (1 products)
  '442324596-943331': [
    { id: '68be85b3094d08828def58fc', name: 'Marietta' },
  ],

  // 587322442-1806551 (1 products)
  '587322442-1806551': [
    { id: '68be85b3094d08828def58fe', name: 'Eco-Friendly Ladie"s Terry Towel Dropped Shoulders' },
  ],

  // 587321280-1806548 (1 products)
  '587321280-1806548': [
    { id: '68be85b3094d08828def58ff', name: 'Eco-Friendly Ladies" Jersey Washed Effect Dress' },
  ],

  // 111018642-226353 (1 products)
  '111018642-226353': [
    { id: '68be85b3094d08828def5900', name: 'Serenity öronproppar i etui' },
  ],

  // 110922196-226113 (1 products)
  '110922196-226113': [
    { id: '68be85b3094d08828def5901', name: 'Discovery bagageetikett med tryck' },
  ],

  // 495627860-1194820 (1 products)
  '495627860-1194820': [
    { id: '68be85b3094d08828def5902', name: 'River bagagebricka med fönster av återvunnet material' },
  ],

  // 139503910-717433 (1 products)
  '139503910-717433': [
    { id: '68be85b3094d08828def5905', name: 'Bagagebricka Reflex med tryck' },
  ],

  // 411652444-871078 (1 products)
  '411652444-871078': [
    { id: '68be85b3094d08828def5906', name: 'RPET Felt GRS Luggage Tag resbagagelapp' },
  ],

  // 454079388-972204 (1 products)
  '454079388-972204': [
    { id: '68be85b3094d08828def5907', name: 'Florens, bagagetag' },
  ],

  // 140978488-662811 (1 products)
  '140978488-662811': [
    { id: '68be85b3094d08828def5908', name: 'Bagagebricka Flip-Flop med tryck' },
  ],

  // 520359868-1428069 (1 products)
  '520359868-1428069': [
    { id: '68be85b3094d08828def5909', name: 'Recycled Leather Luggage Tag Bagagebrickorna' },
  ],

  // 524687156-1465227 (1 products)
  '524687156-1465227': [
    { id: '68be85b3094d08828def590a', name: 'Vegan Pineapple Leather Luggage Tag' },
  ],

  // 557389322-1613654 (1 products)
  '557389322-1613654': [
    { id: '68be85b3094d08828def590b', name: 'Flygbricka med nyckelring' },
  ],

  // 56741622-468552 (1 products)
  '56741622-468552': [
    { id: '68be85b3094d08828def590e', name: 'Billig Skoputs med tryck' },
  ],

  // 147744814-338603 (1 products)
  '147744814-338603': [
    { id: '68be85b3094d08828def590f', name: 'Skoputs med tryck' },
  ],

  // 141165570-663225 (1 products)
  '141165570-663225': [
    { id: '68be85b3094d08828def5910', name: 'Rund Skoputs med tryck' },
  ],

  // 140859964-662429 (1 products)
  '140859964-662429': [
    { id: '68be85b3094d08828def5912', name: 'Stor Kylskåpsmagnet med tryck' },
  ],

  // 140858802-662428 (1 products)
  '140858802-662428': [
    { id: '68be85b3094d08828def5913', name: 'Rektangulär Kylskåpsmagnet med tryck' },
  ],

  // 353740688-763298 (1 products)
  '353740688-763298': [
    { id: '68be85b3094d08828def5914', name: 'DomeBadge Magnetiskt Badge' },
  ],

  // 353788330-763350 (1 products)
  '353788330-763350': [
    { id: '68be85b3094d08828def5915', name: 'Woofri kylskåpsmagnet' },
  ],

  // 552950482-1600086 (1 products)
  '552950482-1600086': [
    { id: '68be85b3094d08828def5916', name: 'Boofri kylskåpsmagnet, rektangel' },
  ],

  // 553751100-1602565 (1 products)
  '553751100-1602565': [
    { id: '68be85b3094d08828def593e', name: 'Åhus - Bagagebricka' },
  ],

  // 174593986-400568 (1 products)
  '174593986-400568': [
    { id: '68be85b3094d08828def593f', name: 'Glasgow' },
  ],

  // 174588176-400546 (1 products)
  '174588176-400546': [
    { id: '68be85b3094d08828def5940', name: 'Denver' },
  ],

  // 501124120-1226229 (1 products)
  '501124120-1226229': [
    { id: '68be85b3094d08828def5941', name: 'Tangerang bagagetagg' },
  ],

  // 446318390-954413 (1 products)
  '446318390-954413': [
    { id: '68be85b4094d08828def5ef9', name: 'Cray drycool polo' },
  ],

  // 446263776-954259 (1 products)
  '446263776-954259': [
    { id: '68be85b4094d08828def5efa', name: 'Cray drycool polo' },
  ],

  // 446306770-954380 (1 products)
  '446306770-954380': [
    { id: '68be85b4094d08828def5f02', name: 'Lytham softshell vest' },
  ],

  // 584202472-1767810 (1 products)
  '584202472-1767810': [
    { id: '68be85b4094d08828def5f69', name: 'Delano Padded Blazer' },
  ],

  // 558598964-1616730 (1 products)
  '558598964-1616730': [
    { id: '68be85b4094d08828def5fb6', name: 'Hammel recycled polo' },
  ],

  // 538982080-1535290 (1 products)
  '538982080-1535290': [
    { id: '68be85b5094d08828def60b0', name: 'Grove hybrid vest' },
  ],

  // 558597802-1616726 (1 products)
  '558597802-1616726': [
    { id: '68be85b5094d08828def60b3', name: 'Pikewood drycool polo' },
  ],

  // 558587344-1616712 (1 products)
  '558587344-1616712': [
    { id: '68be85b5094d08828def60b4', name: 'Hammel recycled cupsleeve' },
  ],

  // 139213410-716986 (1 products)
  '139213410-716986': [
    { id: '68be85b5094d08828def60c3', name: 'Kundvagnsmynt EUR med tryck' },
  ],

  // 139211086-716984 (1 products)
  '139211086-716984': [
    { id: '68be85b5094d08828def60c5', name: 'Kundvagnsmynt Nyckelring SEK med tryck' },
  ],

  // 139209924-716982 (1 products)
  '139209924-716982': [
    { id: '68be85b5094d08828def60c6', name: 'Kundvagnsmynt SEK med logo' },
  ],

  // 109897312-223616 (1 products)
  '109897312-223616': [
    { id: '68be85b5094d08828def60dc', name: 'Regnponcho i påse med tryck' },
  ],

  // 152582220-347979 (1 products)
  '152582220-347979': [
    { id: '68be85b5094d08828def60de', name: 'Nimbus - Regnponcho i rund behållare' },
  ],

  // 152370736-347559 (1 products)
  '152370736-347559': [
    { id: '68be85b5094d08828def60df', name: 'Blado - Regnkappa med kapuchong' },
  ],

  // 152153442-347148 (1 products)
  '152153442-347148': [
    { id: '68be85b5094d08828def60e0', name: 'Regal - Regnponcho' },
  ],

  // 141734950-310562 (1 products)
  '141734950-310562': [
    { id: '68be85b5094d08828def60e1', name: 'Regnponcho med tryck' },
  ],

  // 138583606-948497 (1 products)
  '138583606-948497': [
    { id: '68be85b5094d08828def60e2', name: 'Regnponcho i plastboll med tryck' },
  ],

  // 138592902-948509 (1 products)
  '138592902-948509': [
    { id: '68be85b5094d08828def60e4', name: 'Billig regnponcho med tryck' },
  ],

  // 191530136-668253 (1 products)
  '191530136-668253': [
    { id: '68be85b5094d08828def60e5', name: 'Clear regnponcho' },
  ],

  // 499591442-1215660 (1 products)
  '499591442-1215660': [
    { id: '68be85b5094d08828def60e8', name: 'Vallen - Regnponcho' },
  ],

  // 175680456-403601 (1 products)
  '175680456-403601': [
    { id: '68be85b5094d08828def60eb', name: 'Aegis poncho nyckelring' },
  ],

  // 448335622-957650 (1 products)
  '448335622-957650': [
    { id: '68be85b5094d08828def60ec', name: 'Barrio poncho' },
  ],

  // 531246646-1511644 (1 products)
  '531246646-1511644': [
    { id: '68be85b5094d08828def60ed', name: 'Drizzle poncho' },
  ],

  // 152806486-348412 (1 products)
  '152806486-348412': [
    { id: '68be85b5094d08828def60f0', name: 'Servitörskniv med logo' },
  ],

  // 140403298-717024 (1 products)
  '140403298-717024': [
    { id: '68be85b5094d08828def612a', name: 'Knappar Kampanjknappar (25 mm Ø)' },
  ],

  // 140839048-662376 (1 products)
  '140839048-662376': [
    { id: '68be85b5094d08828def6130', name: 'Handgel med tryck' },
  ],

  // 52719940-83748 (1 products)
  '52719940-83748': [
    { id: '68be85b5094d08828def61d1', name: 'De Luxe Kapsylöppnare med tryck' },
  ],

  // 52722264-83752 (1 products)
  '52722264-83752': [
    { id: '68be85b5094d08828def61d2', name: 'Kapsylöppnare med nyckelring' },
  ],

  // 137290300-946973 (1 products)
  '137290300-946973': [
    { id: '68be85b5094d08828def61d4', name: 'Kapsylöppnare Nyckelring med tryck' },
  ],

  // 192412094-670890 (1 products)
  '192412094-670890': [
    { id: '68be85b5094d08828def61d7', name: 'LiftUp öppnare / nyckelring' },
  ],

  // 195769112-640052 (1 products)
  '195769112-640052': [
    { id: '68be85b5094d08828def61d8', name: 'CLOSE. Karbinhake med kapselöppnare i aluminium' },
  ],

  // 353740688-763297 (1 products)
  '353740688-763297': [
    { id: '68be85b5094d08828def61f7', name: 'DomeBadge Magnetiskt Badge' },
  ],

  // 449609174-960291 (1 products)
  '449609174-960291': [
    { id: '68be85b5094d08828def6258', name: 'Isolerad mugg' },
  ],

  // 435409534-950198 (1 products)
  '435409534-950198': [
    { id: '68be85b5094d08828def625e', name: 'Flasköppnare i plast Tay' },
  ],

  // 524110804-1438509 (1 products)
  '524110804-1438509': [
    { id: '68be85b5094d08828def626c', name: 'Nyckelring med flasköppnare' },
  ],

  // 568818754-1661521 (1 products)
  '568818754-1661521': [
    { id: '68be85b5094d08828def6386', name: 'Kapsylöppnare i Aluminium med nyckelring' },
  ],

  // 568821078-1661531 (1 products)
  '568821078-1661531': [
    { id: '68be85b5094d08828def6387', name: 'Kapsylöppnare flaskdesign' },
  ],

  // 568814106-1661499 (1 products)
  '568814106-1661499': [
    { id: '68be85b5094d08828def6388', name: 'Kapsylöppnare i Aluminium med nyckelring' },
  ],

  // 568816430-1661508 (1 products)
  '568816430-1661508': [
    { id: '68be85b5094d08828def6389', name: 'Kapsylöppnare i Aluminium' },
  ],

  // 568815268-1661501 (1 products)
  '568815268-1661501': [
    { id: '68be85b5094d08828def638a', name: 'Kapsylöppnare i Aluminium med nyckelring' },
  ],

  // 568817592-1661513 (1 products)
  '568817592-1661513': [
    { id: '68be85b5094d08828def638b', name: 'Kapsylöppnare i Aluminium med nyckelring' },
  ],

  // 568819916-1661523 (1 products)
  '568819916-1661523': [
    { id: '68be85b5094d08828def638c', name: 'Kapsylöppnare design likt en kanna' },
  ],

  // 568822240-1661532 (1 products)
  '568822240-1661532': [
    { id: '68be85b5094d08828def638d', name: 'Kapsylöppnare i Aluminium med nyckelring' },
  ],

  // 568805972-1661479 (1 products)
  '568805972-1661479': [
    { id: '68be85b5094d08828def638e', name: 'Kapsylöppnare Magnetisk' },
  ],

  // 568812944-1661491 (1 products)
  '568812944-1661491': [
    { id: '68be85b5094d08828def638f', name: 'Kapsylöppnare i Aluminium' },
  ],

  // 477458828-1087856 (1 products)
  '477458828-1087856': [
    { id: '68be85b6094d08828def648c', name: 'Kaipi nyckelring med flasköppnare' },
  ],

  // 477457666-1087845 (1 products)
  '477457666-1087845': [
    { id: '68be85b6094d08828def648d', name: 'Ralager kapsylöppnare' },
  ],

  // 52711806-83737 (1 products)
  '52711806-83737': [
    { id: '68be85b6094d08828def6591', name: 'Microfiberduk i ask med tryck' },
  ],

  // 139380738-717264 (1 products)
  '139380738-717264': [
    { id: '68be85b6094d08828def6592', name: 'Korthållare silikon med putsduk' },
  ],

  // 4098374-10986 (1 products)
  '4098374-10986': [
    { id: '68be85b6094d08828def6594', name: 'Badboll med tryck' },
  ],

  // 138598712-948533 (1 products)
  '138598712-948533': [
    { id: '68be85b6094d08828def6596', name: 'Uppblåsbar badboll med tryck' },
  ],

  // 5355658-437648 (1 products)
  '5355658-437648': [
    { id: '68be85b6094d08828def6597', name: 'Mini Badboll med tryck' },
  ],

  // 109931010-223704 (1 products)
  '109931010-223704': [
    { id: '68be85b6094d08828def659c', name: 'Antistressboll med tryck' },
  ],

  // 137587772-947364 (1 products)
  '137587772-947364': [
    { id: '68be85b6094d08828def659d', name: 'Billig Stressboll med tryck' },
  ],

  // 137586610-947356 (1 products)
  '137586610-947356': [
    { id: '68be85b6094d08828def659e', name: 'Jonglerboll med logo' },
  ],

  // 137722564-947587 (1 products)
  '137722564-947587': [
    { id: '68be85b6094d08828def659f', name: 'Antistress Bygghjälm med tryck' },
  ],

  // 137283328-946946 (1 products)
  '137283328-946946': [
    { id: '68be85b6094d08828def65f6', name: 'Fickspegel med logo' },
  ],

  // 296903782-1228944 (1 products)
  '296903782-1228944': [
    { id: '68be85b6094d08828def65fa', name: 'Kampo - Tändare' },
  ],

  // 1677928-49708 (1 products)
  '1677928-49708': [
    { id: '68be85b6094d08828def65fc', name: 'Billig tändare med tryck' },
  ],

  // 140883204-662513 (1 products)
  '140883204-662513': [
    { id: '68be85b6094d08828def65ff', name: 'Tändare Polo med tryck' },
  ],

  // 140937818-662716 (1 products)
  '140937818-662716': [
    { id: '68be85b6094d08828def6600', name: 'Elektronisk Tändare med Kapsylöppnare' },
  ],

  // 1676766-3291 (1 products)
  '1676766-3291': [
    { id: '68be85b6094d08828def6601', name: 'Färgad Tändare med tryck' },
  ],

  // 1758106-3411 (1 products)
  '1758106-3411': [
    { id: '68be85b6094d08828def6603', name: 'Tändare med egen logo' },
  ],

  // 210119812-662595 (1 products)
  '210119812-662595': [
    { id: '68be85b6094d08828def6605', name: 'Tändare kapsylöppnare' },
  ],

  // 140893662-662560 (1 products)
  '140893662-662560': [
    { id: '68be85b6094d08828def6606', name: 'Tändare med logo' },
  ],

  // 378312340-798840 (1 products)
  '378312340-798840': [
    { id: '68be85b6094d08828def6607', name: 'Flint tändare' },
  ],

  // 140887852-662536 (1 products)
  '140887852-662536': [
    { id: '68be85b6094d08828def6608', name: 'Elektronisk Tändare med tryck' },
  ],

  // 313353054-662588 (1 products)
  '313353054-662588': [
    { id: '68be85b6094d08828def6609', name: 'Turbotändare' },
  ],

  // 67841046-108666 (1 products)
  '67841046-108666': [
    { id: '68be85b6094d08828def660a', name: 'Elektronisk tändare med logo' },
  ],

  // 161737618-366563 (1 products)
  '161737618-366563': [
    { id: '68be85b6094d08828def660b', name: 'Tändare i plast med tryck' },
  ],

  // 140934332-662706 (1 products)
  '140934332-662706': [
    { id: '68be85b6094d08828def660c', name: 'Tändare med fullfärgstryck' },
  ],

  // 140884366-662522 (1 products)
  '140884366-662522': [
    { id: '68be85b6094d08828def660d', name: 'Transparent Tändare med tryck' },
  ],

  // 140882042-662510 (1 products)
  '140882042-662510': [
    { id: '68be85b6094d08828def660e', name: 'Tändare Cricket 90 med tryck' },
  ],

  // 206152744-479814 (1 products)
  '206152744-479814': [
    { id: '68be85b6094d08828def660f', name: 'Noa - Tändare' },
  ],

  // 210118650-662586 (1 products)
  '210118650-662586': [
    { id: '68be85b6094d08828def6610', name: 'Turbotändare Adventure' },
  ],

  // 378320474-798862 (1 products)
  '378320474-798862': [
    { id: '68be85b6094d08828def6612', name: 'Fuego tändare' },
  ],

  // 378315826-798848 (1 products)
  '378315826-798848': [
    { id: '68be85b6094d08828def6613', name: 'Tornado tändare' },
  ],

  // 520370326-1428100 (1 products)
  '520370326-1428100': [
    { id: '68be85b7094d08828def6715', name: 'Blacktop tändare' },
  ],

  // 552996962-1600201 (1 products)
  '552996962-1600201': [
    { id: '68be85b7094d08828def6716', name: 'Flintlight tändare' },
  ],

  // 553001610-1600207 (1 products)
  '553001610-1600207': [
    { id: '68be85b7094d08828def6717', name: 'Jetlight jet tändare' },
  ],

  // 553085274-1600355 (1 products)
  '553085274-1600355': [
    { id: '68be85b7094d08828def6718', name: 'Flatlight Shine tändare' },
  ],

  // 152779760-348347 (1 products)
  '152779760-348347': [
    { id: '68be85b7094d08828def67ee', name: 'Werel - Ansiktsfärg Belgium' },
  ],

  // 59143476-94873 (1 products)
  '59143476-94873': [
    { id: '68be85b7094d08828def67f0', name: 'Applådstavar 2-pack - Standard' },
  ],

  // 147852880-338897 (1 products)
  '147852880-338897': [
    { id: '68be85b7094d08828def67f1', name: 'Långt Skohorn med tryck' },
  ],

  // 147747138-338606 (1 products)
  '147747138-338606': [
    { id: '68be85b7094d08828def67f2', name: 'Putshorn med tryck' },
  ],

  // 187364366-429267 (1 products)
  '187364366-429267': [
    { id: '68be85b7094d08828def67f3', name: 'Påsklämma med logo' },
  ],

  // 187355070-429257 (1 products)
  '187355070-429257': [
    { id: '68be85b7094d08828def67f4', name: 'Påsklämma med tryck' },
  ],

  // 187380634-429277 (1 products)
  '187380634-429277': [
    { id: '68be85b7094d08828def67f5', name: 'Stor Påsklämma med tryck' },
  ],

  // 153208538-349360 (1 products)
  '153208538-349360': [
    { id: '68be85b7094d08828def67f6', name: 'Silikonarmband med eget tryck' },
  ],

  // 138905480-716651 (1 products)
  '138905480-716651': [
    { id: '68be85b7094d08828def67f7', name: 'Festivalband PVC med tryck' },
  ],

  // 139069322-716705 (1 products)
  '139069322-716705': [
    { id: '68be85b7094d08828def685c', name: 'Sytt Sadelskydd med tryck' },
  ],

  // 139555038-717505 (1 products)
  '139555038-717505': [
    { id: '68be85b7094d08828def685d', name: 'Sadelskydd reflex med tryck' },
  ],

  // 139075132-716771 (1 products)
  '139075132-716771': [
    { id: '68be85b7094d08828def685e', name: 'Sadelskydd PU med tryck' },
  ],

  // 139072808-716747 (1 products)
  '139072808-716747': [
    { id: '68be85b7094d08828def6861', name: 'Sadelskydd Nylon med tryck' },
  ],

  // 109964708-223793 (1 products)
  '109964708-223793': [
    { id: '68be85b8094d08828def687a', name: 'Billigt cerat med tryck' },
  ],

  // 495512822-1194516 (1 products)
  '495512822-1194516': [
    { id: '68be85b8094d08828def687b', name: 'Adony läppbalsam' },
  ],

  // 548379174-1578775 (1 products)
  '548379174-1578775': [
    { id: '68be85b8094d08828def687c', name: 'Ero läppbalsam' },
  ],

  // 568613080-1660952 (1 products)
  '568613080-1660952': [
    { id: '68be85b8094d08828def687d', name: 'Eden läppbalsam med vanilj' },
  ],

  // 152195274-347251 (1 products)
  '152195274-347251': [
    { id: '68be85b8094d08828def687e', name: 'Gloss - Läppbalsam' },
  ],

  // 164800650-376477 (1 products)
  '164800650-376477': [
    { id: '68be85b8094d08828def687f', name: 'Lips - Lypsyl' },
  ],

  // 153690768-350458 (1 products)
  '153690768-350458': [
    { id: '68be85b8094d08828def6880', name: 'Uv Soft - Runt läpp cerat med UV skydd' },
  ],

  // 442699922-944055 (1 products)
  '442699922-944055': [
    { id: '68be85b8094d08828def6881', name: 'Balm - Veganskt läppbalsam i burk' },
  ],

  // 52732722-83778 (1 products)
  '52732722-83778': [
    { id: '68be85b8094d08828def6882', name: 'Lippo cerat med tryck' },
  ],

  // 138596388-948513 (1 products)
  '138596388-948513': [
    { id: '68be85b8094d08828def6883', name: 'Cerat med solskyddsfaktor' },
  ],

  // 140864612-662451 (1 products)
  '140864612-662451': [
    { id: '68be85b8094d08828def6884', name: 'Läppbalsam med tryck' },
  ],

  // 195507662-639405 (1 products)
  '195507662-639405': [
    { id: '68be85b8094d08828def6885', name: 'JOLIE. Lypsyl i PS och PP' },
  ],

  // 140865774-662458 (1 products)
  '140865774-662458': [
    { id: '68be85b8094d08828def6887', name: 'Cerat i boll med tryck' },
  ],

  // 191754402-668885 (1 products)
  '191754402-668885': [
    { id: '68be85b8094d08828def6888', name: 'Lipbalm Glossy läppbalsam' },
  ],

  // 284693486-639430 (1 products)
  '284693486-639430': [
    { id: '68be85b8094d08828def6889', name: 'SCARLETT. ABS Lypsyl' },
  ],

  // 555002574-1608388 (1 products)
  '555002574-1608388': [
    { id: '68be85b8094d08828def688c', name: 'PP-ask läppbalsam Kimberly' },
  ],

  // 110005378-223861 (1 products)
  '110005378-223861': [
    { id: '68be85b8094d08828def688f', name: 'Isskrapa med Handske' },
  ],

  // 187042492-428991 (1 products)
  '187042492-428991': [
    { id: '68be85b8094d08828def6894', name: 'Färgad Isskrapa med tryck' },
  ],

  // 187051788-428996 (1 products)
  '187051788-428996': [
    { id: '68be85b8094d08828def6895', name: 'Transpararent isskrapa med tryck' },
  ],

  // 140919226-662649 (1 products)
  '140919226-662649': [
    { id: '68be85b8094d08828def6896', name: 'Isskrapa med logo' },
  ],

  // 140920388-662652 (1 products)
  '140920388-662652': [
    { id: '68be85b8094d08828def6897', name: 'Isskrapa med Handtag' },
  ],

  // 140918064-662647 (1 products)
  '140918064-662647': [
    { id: '68be85b8094d08828def6898', name: 'Trekantig isskrapa' },
  ],

  // 140916902-662643 (1 products)
  '140916902-662643': [
    { id: '68be85b8094d08828def6899', name: 'Isskrapa med mjukt handtag' },
  ],

  // 141091202-663072 (1 products)
  '141091202-663072': [
    { id: '68be85b8094d08828def689b', name: 'Isskrapa Flipper' },
  ],

  // 191769508-669039 (1 products)
  '191769508-669039': [
    { id: '68be85b8094d08828def689c', name: 'Stor isskrapa med tryck' },
  ],

  // 137821334-947700 (1 products)
  '137821334-947700': [
    { id: '68be85b8094d08828def689d', name: 'Isskrapa i plast med handtag' },
  ],

  // 24002272-42588 (1 products)
  '24002272-42588': [
    { id: '68be85b8094d08828def68a1', name: 'Profilerbar kyl med egen design' },
  ],

  // 109936820-223716 (1 products)
  '109936820-223716': [
    { id: '68be85b8094d08828def68c6', name: 'Nyckelband med avtagbart spänne' },
  ],

  // 164650752-376060 (1 products)
  '164650752-376060': [
    { id: '68be85b8094d08828def68c9', name: 'Logoband säkerhetsspänne med tryck' },
  ],

  // 153356112-349692 (1 products)
  '153356112-349692': [
    { id: '68be85b8094d08828def68ca', name: 'Billigt Nyckelband med tryck' },
  ],

  // 152940116-348685 (1 products)
  '152940116-348685': [
    { id: '68be85b8094d08828def68cb', name: 'Logoband med metallkrok' },
  ],

  // 177257290-416694 (1 products)
  '177257290-416694': [
    { id: '68be85b8094d08828def68cc', name: 'Wide Lany - Logoband med metallkrok 25 mm' },
  ],

  // 205743720-479094 (1 products)
  '205743720-479094': [
    { id: '68be85b8094d08828def68cd', name: 'Zip Lanyard - Logoband med Jojohållare' },
  ],

  // 442582560-943873 (1 products)
  '442582560-943873': [
    { id: '68be85b8094d08828def68ce', name: 'Lannycot - Logoband bomull 20 mm' },
  ],

  // 442580236-943853 (1 products)
  '442580236-943853': [
    { id: '68be85b8094d08828def68cf', name: 'Fiesta - RPET festival armband' },
  ],

  // 527439934-1483761 (1 products)
  '527439934-1483761': [
    { id: '68be85b8094d08828def68d0', name: 'Pulric - Korthållare jojo' },
  ],

  // 109897312-223613 (1 products)
  '109897312-223613': [
    { id: '68be85b8094d08828def68d4', name: 'Regnponcho i påse med tryck' },
  ],

  // 152154604-347151 (1 products)
  '152154604-347151': [
    { id: '68be85b8094d08828def68d6', name: 'Sprinkle - Engångs regnponcho' },
  ],

  // 152582220-347980 (1 products)
  '152582220-347980': [
    { id: '68be85b8094d08828def68d7', name: 'Nimbus - Regnponcho i rund behållare' },
  ],

  // 141734950-310560 (1 products)
  '141734950-310560': [
    { id: '68be85b8094d08828def68d8', name: 'Regnponcho med tryck' },
  ],

  // 138583606-948502 (1 products)
  '138583606-948502': [
    { id: '68be85b8094d08828def68d9', name: 'Regnponcho i plastboll med tryck' },
  ],

  // 191530136-821708 (1 products)
  '191530136-821708': [
    { id: '68be85b8094d08828def68dc', name: 'Clear regnponcho' },
  ],

  // 140855316-662416 (1 products)
  '140855316-662416': [
    { id: '68be85b8094d08828def68de', name: 'Regnponcho i boll med tryck' },
  ],

  // 175680456-403602 (1 products)
  '175680456-403602': [
    { id: '68be85b8094d08828def68e0', name: 'Aegis poncho nyckelring' },
  ],

  // 175683942-403614 (1 products)
  '175683942-403614': [
    { id: '68be85b8094d08828def68e1', name: 'Stormy poncho' },
  ],

  // 139555038-717507 (1 products)
  '139555038-717507': [
    { id: '68be85b8094d08828def6904', name: 'Sadelskydd reflex med tryck' },
  ],

  // 371448406-782969 (1 products)
  '371448406-782969': [
    { id: '68be85b8094d08828def6927', name: 'Läppbalsam' },
  ],

  // 371298508-782908 (1 products)
  '371298508-782908': [
    { id: '68be85b8094d08828def6928', name: 'Läppbalsam spf20' },
  ],

  // 291558582-603561 (1 products)
  '291558582-603561': [
    { id: '68be85b8094d08828def6929', name: 'Liplox Läppbalsam' },
  ],

  // 531365170-1512121 (1 products)
  '531365170-1512121': [
    { id: '68be85b8094d08828def6938', name: 'Tublox Läppbalsam' },
  ],

  // 531488342-1512409 (1 products)
  '531488342-1512409': [
    { id: '68be85b8094d08828def6939', name: 'Labicor Läppbalsam' },
  ],

  // 531361684-1512107 (1 products)
  '531361684-1512107': [
    { id: '68be85b8094d08828def693a', name: 'Lippa Läppbalsam' },
  ],

  // 140922712-662659 (1 products)
  '140922712-662659': [
    { id: '68be85b8094d08828def6948', name: 'Isskrapa med handske och tryck' },
  ],

  // 192345860-670789 (1 products)
  '192345860-670789': [
    { id: '68be85b8094d08828def6950', name: 'Isskrapa med fodrad handske' },
  ],

  // 387449146-925933 (1 products)
  '387449146-925933': [
    { id: '68be85b8094d08828def6951', name: 'Plastic Bank Recycled Ice Scraper isskrapa' },
  ],

  // 488600084-1146428 (1 products)
  '488600084-1146428': [
    { id: '68be85b8094d08828def6953', name: 'Oslo Ice Scraper' },
  ],

  // 499422952-1215266 (1 products)
  '499422952-1215266': [
    { id: '68be85b8094d08828def6954', name: 'Isskrapa Bambu & R-PP' },
  ],

  // 530465782-1499757 (1 products)
  '530465782-1499757': [
    { id: '68be85b8094d08828def695a', name: 'Mini isskrapa "Cold nights"' },
  ],

  // 175202874-402077 (1 products)
  '175202874-402077': [
    { id: '68be85b8094d08828def695b', name: 'Plastisskrapa med Handtag' },
  ],

  // 181607818-720703 (1 products)
  '181607818-720703': [
    { id: '68be85b8094d08828def695e', name: 'Logoband Screentryckta' },
  ],

  // 205606604-671150 (1 products)
  '205606604-671150': [
    { id: '68be85b8094d08828def6960', name: 'Lanyard Safety  RPET 2 cm nyckelband' },
  ],

  // 137626118-947445 (1 products)
  '137626118-947445': [
    { id: '68be85b8094d08828def6962', name: 'Nyckelband med nyckelhållare' },
  ],

  // 141450260-664371 (1 products)
  '141450260-664371': [
    { id: '68be85b8094d08828def6963', name: 'Nyckelband Flätat med tryck' },
  ],

  // 192338888-670778 (1 products)
  '192338888-670778': [
    { id: '68be85b8094d08828def6964', name: 'KeyCord 2 cm nyckelband' },
  ],

  // 192532942-671106 (1 products)
  '192532942-671106': [
    { id: '68be85b8094d08828def6965', name: 'KeyCord Budget 2 cm nyckelband' },
  ],

  // 192333078-670758 (1 products)
  '192333078-670758': [
    { id: '68be85b8094d08828def6968', name: 'KeyCordSafety 2,4 cm nyckelband' },
  ],

  // 192530618-671093 (1 products)
  '192530618-671093': [
    { id: '68be85b8094d08828def6969', name: 'KeyCord Budget Safety 2 cm nyckelband' },
  ],

  // 182947604-879211 (1 products)
  '182947604-879211': [
    { id: '68be85b8094d08828def696a', name: 'Logoband i bomull' },
  ],

  // 182945280-879204 (1 products)
  '182945280-879204': [
    { id: '68be85b8094d08828def696b', name: 'Logoband Bambu' },
  ],

  // 451067484-963854 (1 products)
  '451067484-963854': [
    { id: '68be85b8094d08828def696c', name: '75090. Lanyard Tube Short Set. Standard modeller' },
  ],

  // 451070970-963923 (1 products)
  '451070970-963923': [
    { id: '68be85b8094d08828def696d', name: '75093. Lanyard Tube Long Set I. Standard modeller' },
  ],

  // 353740688-763295 (1 products)
  '353740688-763295': [
    { id: '68be85b8094d08828def69ac', name: 'DomeBadge Magnetiskt Badge' },
  ],

  // 153239912-349441 (1 products)
  '153239912-349441': [
    { id: '68be85b8094d08828def69e2', name: 'Festivalarmband med eget tryck' },
  ],

  // 138905480-716657 (1 products)
  '138905480-716657': [
    { id: '68be85b8094d08828def69e3', name: 'Festivalband PVC med tryck' },
  ],

  // 535146318-1517521 (1 products)
  '535146318-1517521': [
    { id: '68be85b8094d08828def69f0', name: 'Vital 50 cl' },
  ],

  // 535153290-1517534 (1 products)
  '535153290-1517534': [
    { id: '68be85b8094d08828def69f1', name: 'Flexi 33 cl' },
  ],

  // 535152128-1517532 (1 products)
  '535152128-1517532': [
    { id: '68be85b8094d08828def69f2', name: 'Flexi 50 cl' },
  ],

  // 535149804-1517529 (1 products)
  '535149804-1517529': [
    { id: '68be85b8094d08828def69f3', name: 'Mini 33 cl' },
  ],

  // 535148642-1517525 (1 products)
  '535148642-1517525': [
    { id: '68be85b8094d08828def69f4', name: 'Clear 50 cl' },
  ],

  // 535147480-1517523 (1 products)
  '535147480-1517523': [
    { id: '68be85b8094d08828def69f5', name: 'Junior 30 cl' },
  ],

  // 535154452-1517536 (1 products)
  '535154452-1517536': [
    { id: '68be85b8094d08828def69f6', name: 'Rapid 50 cl' },
  ],

  // 195422836-639105 (1 products)
  '195422836-639105': [
    { id: '68be85b8094d08828def69f7', name: 'NICOLAUS. Korthållare med smartphone hållare' },
  ],

  // 181606656-720706 (1 products)
  '181606656-720706': [
    { id: '68be85b8094d08828def69f8', name: 'Logoband (Lagervara)' },
  ],

  // 182944118-879201 (1 products)
  '182944118-879201': [
    { id: '68be85b8094d08828def69fa', name: 'Logoband PET' },
  ],

  // 283920756-1223597 (1 products)
  '283920756-1223597': [
    { id: '68be85b8094d08828def69fd', name: 'BIC® 4 Colours Glacé with Lanyard' },
  ],

  // 448920108-958692 (1 products)
  '448920108-958692': [
    { id: '68be85b8094d08828def69fe', name: 'Festival - Festivalband' },
  ],

  // 109946116-223733 (1 products)
  '109946116-223733': [
    { id: '68be85b8094d08828def6a0a', name: 'Logoband med tryck' },
  ],

  // 157478888-358489 (1 products)
  '157478888-358489': [
    { id: '68be85b8094d08828def6a0b', name: 'Nyckelband med praktisk krok' },
  ],

  // 109936820-223718 (1 products)
  '109936820-223718': [
    { id: '68be85b8094d08828def6a0c', name: 'Nyckelband med avtagbart spänne' },
  ],

  // 164650752-376059 (1 products)
  '164650752-376059': [
    { id: '68be85b8094d08828def6a0e', name: 'Logoband säkerhetsspänne med tryck' },
  ],

  // 152940116-348688 (1 products)
  '152940116-348688': [
    { id: '68be85b8094d08828def6a0f', name: 'Logoband med metallkrok' },
  ],

  // 442580236-943857 (1 products)
  '442580236-943857': [
    { id: '68be85b8094d08828def6a10', name: 'Fiesta - RPET festival armband' },
  ],

  // 23999948-461559 (1 products)
  '23999948-461559': [
    { id: '68be85b8094d08828def6a13', name: 'Julmust med egen etikett' },
  ],

  // 378292586-1223655 (1 products)
  '378292586-1223655': [
    { id: '68be85b8094d08828def6a8b', name: 'BIC® 4 Colours Soft with Lanyard' },
  ],

  // 378293748-1223659 (1 products)
  '378293748-1223659': [
    { id: '68be85b8094d08828def6a8c', name: 'BIC® 4 Colours Wood Style with Lanyard' },
  ],

  // 451068646-963875 (1 products)
  '451068646-963875': [
    { id: '68be85b8094d08828def6a8d', name: '75091. Lanyard Nautic Long Set. Standard modeller' },
  ],

  // 451069808-963884 (1 products)
  '451069808-963884': [
    { id: '68be85b8094d08828def6a8e', name: '75092. Lanyard Nautic Short Set. Standard modeller' },
  ],

  // 451066322-963801 (1 products)
  '451066322-963801': [
    { id: '68be85b8094d08828def6a8f', name: '75089. Lanyard Tube Long Set II. Standard modeller' },
  ],

  // 500207302-1220087 (1 products)
  '500207302-1220087': [
    { id: '68be85b8094d08828def6a90', name: 'Lanyard Tube Long Set I. Standard modeller' },
  ],

  // 500204978-1220053 (1 products)
  '500204978-1220053': [
    { id: '68be85b8094d08828def6a91', name: 'Lanyard Tube Long Set II. Standard modeller' },
  ],

  // 488035352-1142859 (1 products)
  '488035352-1142859': [
    { id: '68be85b8094d08828def6a92', name: 'Passerkortshållare Exklusiv' },
  ],

  // 475753012-1080141 (1 products)
  '475753012-1080141': [
    { id: '68be85b8094d08828def6a93', name: 'Passerkortshållare (pull reel)' },
  ],

  // 553892864-1619403 (1 products)
  '553892864-1619403': [
    { id: '68be85b8094d08828def6a94', name: 'Lanyard NAUTIC Long Set I. Standard modeller' },
  ],

  // 553890540-1619385 (1 products)
  '553890540-1619385': [
    { id: '68be85b8094d08828def6a95', name: 'Lanyard NAUTIC Long Set II. Standard modeller' },
  ],

  // 553891702-1619396 (1 products)
  '553891702-1619396': [
    { id: '68be85b8094d08828def6a96', name: 'Lanyard NAUTIC Short Set. Standard modeller' },
  ],

  // 181607818-720697 (1 products)
  '181607818-720697': [
    { id: '68be85b8094d08828def6a97', name: 'Logoband Screentryckta' },
  ],

  // 205606604-798909 (1 products)
  '205606604-798909': [
    { id: '68be85b8094d08828def6a99', name: 'Lanyard Safety  RPET 2 cm nyckelband' },
  ],

  // 137626118-947444 (1 products)
  '137626118-947444': [
    { id: '68be85b8094d08828def6a9b', name: 'Nyckelband med nyckelhållare' },
  ],

  // 192338888-670772 (1 products)
  '192338888-670772': [
    { id: '68be85b8094d08828def6a9c', name: 'KeyCord 2 cm nyckelband' },
  ],

  // 192532942-674944 (1 products)
  '192532942-674944': [
    { id: '68be85b8094d08828def6a9d', name: 'KeyCord Budget 2 cm nyckelband' },
  ],

  // 192333078-670763 (1 products)
  '192333078-670763': [
    { id: '68be85b8094d08828def6a9e', name: 'KeyCordSafety 2,4 cm nyckelband' },
  ],

  // 192530618-671096 (1 products)
  '192530618-671096': [
    { id: '68be85b8094d08828def6a9f', name: 'KeyCord Budget Safety 2 cm nyckelband' },
  ],

  // 182947604-879212 (1 products)
  '182947604-879212': [
    { id: '68be85b8094d08828def6aa0', name: 'Logoband i bomull' },
  ],

  // 451067484-963852 (1 products)
  '451067484-963852': [
    { id: '68be85b8094d08828def6aa1', name: '75090. Lanyard Tube Short Set. Standard modeller' },
  ],

  // 182946442-879208 (1 products)
  '182946442-879208': [
    { id: '68be85b8094d08828def6aa2', name: 'Logoband Majs' },
  ],

  // 195422836-639100 (1 products)
  '195422836-639100': [
    { id: '68be85b8094d08828def6aa3', name: 'NICOLAUS. Korthållare med smartphone hållare' },
  ],

  // 174331374-399786 (1 products)
  '174331374-399786': [
    { id: '68be85b8094d08828def6b3f', name: 'Event nyckelband' },
  ],

  // 174333698-399805 (1 products)
  '174333698-399805': [
    { id: '68be85b8094d08828def6b40', name: 'Ballek' },
  ],

  // 174334860-399808 (1 products)
  '174334860-399808': [
    { id: '68be85b8094d08828def6b41', name: 'Bahhol Badgehållare' },
  ],

  // 257962838-547669 (1 products)
  '257962838-547669': [
    { id: '68be85b8094d08828def6b42', name: 'Devent nyckelband' },
  ],

  // 451070970-963896 (1 products)
  '451070970-963896': [
    { id: '68be85b8094d08828def6b50', name: '75093. Lanyard Tube Long Set I. Standard modeller' },
  ],

  // 181606656-720707 (1 products)
  '181606656-720707': [
    { id: '68be85b8094d08828def6b51', name: 'Logoband (Lagervara)' },
  ],

  // 284330942-636756 (1 products)
  '284330942-636756': [
    { id: '68be85b8094d08828def6b52', name: 'YEATS. Utdragbar brick hållare' },
  ],

  // 283920756-1223601 (1 products)
  '283920756-1223601': [
    { id: '68be85b8094d08828def6b55', name: 'BIC® 4 Colours Glacé with Lanyard' },
  ],

  // 448920108-958688 (1 products)
  '448920108-958688': [
    { id: '68be85b8094d08828def6b56', name: 'Festival - Festivalband' },
  ],

  // 535146318-1517519 (1 products)
  '535146318-1517519': [
    { id: '68be85b8094d08828def6b57', name: 'Vital 50 cl' },
  ],

  // 535153290-1517535 (1 products)
  '535153290-1517535': [
    { id: '68be85b8094d08828def6b58', name: 'Flexi 33 cl' },
  ],

  // 535149804-1517528 (1 products)
  '535149804-1517528': [
    { id: '68be85b8094d08828def6b59', name: 'Mini 33 cl' },
  ],

  // 448606368-958160 (1 products)
  '448606368-958160': [
    { id: '68be85b8094d08828def6bee', name: 'Larpet nyckelband' },
  ],

  // 435228262-949922 (1 products)
  '435228262-949922': [
    { id: '68be85b8094d08828def6bef', name: 'Nyckelring i metall,  i metall, Lionel' },
  ],

  // 524110804-1438511 (1 products)
  '524110804-1438511': [
    { id: '68be85b8094d08828def6bf3', name: 'Nyckelring med flasköppnare' },
  ],

  // 111018642-226354 (1 products)
  '111018642-226354': [
    { id: '68be85b8094d08828def6bf5', name: 'Serenity öronproppar i etui' },
  ],

  // 378292586-1223652 (1 products)
  '378292586-1223652': [
    { id: '68be85b8094d08828def6c05', name: 'BIC® 4 Colours Soft with Lanyard' },
  ],

  // 378293748-1223658 (1 products)
  '378293748-1223658': [
    { id: '68be85b8094d08828def6c06', name: 'BIC® 4 Colours Wood Style with Lanyard' },
  ],

  // 451068646-963868 (1 products)
  '451068646-963868': [
    { id: '68be85b8094d08828def6c07', name: '75091. Lanyard Nautic Long Set. Standard modeller' },
  ],

  // 451069808-963886 (1 products)
  '451069808-963886': [
    { id: '68be85b8094d08828def6c08', name: '75092. Lanyard Nautic Short Set. Standard modeller' },
  ],

  // 451066322-963816 (1 products)
  '451066322-963816': [
    { id: '68be85b8094d08828def6c09', name: '75089. Lanyard Tube Long Set II. Standard modeller' },
  ],

  // 557261502-1613364 (1 products)
  '557261502-1613364': [
    { id: '68be85b8094d08828def6c0a', name: 'Nyckelband R-PET' },
  ],

  // 500207302-1220076 (1 products)
  '500207302-1220076': [
    { id: '68be85b8094d08828def6c0b', name: 'Lanyard Tube Long Set I. Standard modeller' },
  ],

  // 500206140-1220060 (1 products)
  '500206140-1220060': [
    { id: '68be85b8094d08828def6c0c', name: 'Lanyard Tube Short Set. Standard modeller' },
  ],

  // 488035352-1142855 (1 products)
  '488035352-1142855': [
    { id: '68be85b8094d08828def6c0d', name: 'Passerkortshållare Exklusiv' },
  ],

  // 553892864-1619409 (1 products)
  '553892864-1619409': [
    { id: '68be85b8094d08828def6c0e', name: 'Lanyard NAUTIC Long Set I. Standard modeller' },
  ],

  // 553890540-1619379 (1 products)
  '553890540-1619379': [
    { id: '68be85b8094d08828def6c0f', name: 'Lanyard NAUTIC Long Set II. Standard modeller' },
  ],

  // 553891702-1619390 (1 products)
  '553891702-1619390': [
    { id: '68be85b8094d08828def6c10', name: 'Lanyard NAUTIC Short Set. Standard modeller' },
  ],

  // 153113254-349145 (1 products)
  '153113254-349145': [
    { id: '68be85b9094d08828def6c6c', name: 'Paper Large - Papperspåse stor 150 gr/m²' },
  ],

  // 553236334-1600731 (1 products)
  '553236334-1600731': [
    { id: '68be85b9094d08828def6ce0', name: 'Revent RPET nyckelband' },
  ],

  // 448635418-958220 (1 products)
  '448635418-958220': [
    { id: '68be85b9094d08828def6ce1', name: 'Subiner YoYo RPET Nyckelring' },
  ],

  // 553098056-1600378 (1 products)
  '553098056-1600378': [
    { id: '68be85b9094d08828def6ce2', name: 'Revent Call RPET nyckelband för mobilhållare' },
  ],

  // 500845240-1225674 (1 products)
  '500845240-1225674': [
    { id: '68be85b9094d08828def6ce3', name: 'Refek RPET nyckelring' },
  ],

  // 553237496-1600740 (1 products)
  '553237496-1600740': [
    { id: '68be85b9094d08828def6ce4', name: 'Corphon RPET nyckelband för mobilhållare' },
  ],

  // 568818754-1661516 (1 products)
  '568818754-1661516': [
    { id: '68be85b9094d08828def6ce5', name: 'Kapsylöppnare i Aluminium med nyckelring' },
  ],

  // 568815268-1661502 (1 products)
  '568815268-1661502': [
    { id: '68be85b9094d08828def6ce8', name: 'Kapsylöppnare i Aluminium med nyckelring' },
  ],

  // 568817592-1661515 (1 products)
  '568817592-1661515': [
    { id: '68be85b9094d08828def6ce9', name: 'Kapsylöppnare i Aluminium med nyckelring' },
  ],

  // 568819916-1661526 (1 products)
  '568819916-1661526': [
    { id: '68be85b9094d08828def6cea', name: 'Kapsylöppnare design likt en kanna' },
  ],

  // 568822240-1661536 (1 products)
  '568822240-1661536': [
    { id: '68be85b9094d08828def6ceb', name: 'Kapsylöppnare i Aluminium med nyckelring' },
  ],

  // 174331374-399784 (1 products)
  '174331374-399784': [
    { id: '68be85b9094d08828def6d05', name: 'Event nyckelband' },
  ],

  // 174325564-399762 (1 products)
  '174325564-399762': [
    { id: '68be85b9094d08828def6d06', name: 'Savent nyckelband' },
  ],

  // 174334860-399806 (1 products)
  '174334860-399806': [
    { id: '68be85b9094d08828def6d07', name: 'Bahhol Badgehållare' },
  ],

  // 257962838-547670 (1 products)
  '257962838-547670': [
    { id: '68be85b9094d08828def6d08', name: 'Devent nyckelband' },
  ],

  // 448606368-958158 (1 products)
  '448606368-958158': [
    { id: '68be85b9094d08828def6d98', name: 'Larpet nyckelband' },
  ],

  // 376798254-1129227 (1 products)
  '376798254-1129227': [
    { id: '68be85b9094d08828def6e21', name: 'Restry M produktpåse' },
  ],

  // 553236334-1600734 (1 products)
  '553236334-1600734': [
    { id: '68be85ba094d08828def707b', name: 'Revent RPET nyckelband' },
  ],

  // 448635418-958217 (1 products)
  '448635418-958217': [
    { id: '68be85ba094d08828def707c', name: 'Subiner YoYo RPET Nyckelring' },
  ],

  // 553232848-1600694 (1 products)
  '553232848-1600694': [
    { id: '68be85ba094d08828def707d', name: 'Revent Plus RPET nyckelband' },
  ],

  // 553098056-1600374 (1 products)
  '553098056-1600374': [
    { id: '68be85ba094d08828def707e', name: 'Revent Call RPET nyckelband för mobilhållare' },
  ],

  // 553237496-1600738 (1 products)
  '553237496-1600738': [
    { id: '68be85ba094d08828def707f', name: 'Corphon RPET nyckelband för mobilhållare' },
  ],

  // 205190608-477768 (1 products)
  '205190608-477768': [
    { id: '68be85ba094d08828def708f', name: 'Seabeck Polo Men' },
  ],

  // 205191770-477773 (1 products)
  '205191770-477773': [
    { id: '68be85ba094d08828def7093', name: 'Seabeck Polo Women' },
  ],

  // 446318390-1616729 (1 products)
  '446318390-1616729': [
    { id: '68be85ba094d08828def70e5', name: 'Cray drycool polo' },
  ],

  // 446263776-1616708 (1 products)
  '446263776-1616708': [
    { id: '68be85ba094d08828def70e6', name: 'Cray drycool polo' },
  ],

  // 554146180-1604520 (1 products)
  '554146180-1604520': [
    { id: '68be85ba094d08828def70e9', name: 'Puma funktions piké' },
  ],

  // 446264938-954272 (1 products)
  '446264938-954272': [
    { id: '68be85ba094d08828def70ed', name: 'Cray sleeveless' },
  ],

  // 446253318-954235 (1 products)
  '446253318-954235': [
    { id: '68be85ba094d08828def70f1', name: 'Lytham softshell vest' },
  ],

  // 446320714-954423 (1 products)
  '446320714-954423': [
    { id: '68be85ba094d08828def714b', name: 'Loop t-shirt' },
  ],

  // 139380738-717256 (1 products)
  '139380738-717256': [
    { id: '68be85ba094d08828def7155', name: 'Korthållare silikon med putsduk' },
  ],

  // 414043840-883087 (1 products)
  '414043840-883087': [
    { id: '68be85bb094d08828def722b', name: 'Hako - Presentkortslåda' },
  ],

  // 511649516-1323100 (1 products)
  '511649516-1323100': [
    { id: '68be85bb094d08828def722e', name: 'Gift Bag Recycled S' },
  ],

  // 512367632-1331143 (1 products)
  '512367632-1331143': [
    { id: '68be85bb094d08828def722f', name: 'Gift Bag Recycled L' },
  ],

  // 379662584-802237 (1 products)
  '379662584-802237': [
    { id: '68be85bb094d08828def728c', name: 'Bill - Bomullspåse - 110 g/m²' },
  ],

  // 461449954-991480 (1 products)
  '461449954-991480': [
    { id: '68be85bb094d08828def728d', name: 'Presentband' },
  ],

  // 461455764-991494 (1 products)
  '461455764-991494': [
    { id: '68be85bb094d08828def728e', name: 'Presentband' },
  ],

  // 418885894-892111 (1 products)
  '418885894-892111': [
    { id: '68be85bb094d08828def728f', name: 'GIBRALTAR. Återvunnen presentväska av bomull (70%), polyester (30% rPET) (140 g/m²)' },
  ],

  // 446513606-1693754 (1 products)
  '446513606-1693754': [
    { id: '68be85bb094d08828def7290', name: 'Skräddarsydda presentförpackning för muggar' },
  ],

  // 446511282-955098 (1 products)
  '446511282-955098': [
    { id: '68be85bb094d08828def7291', name: 'Skräddarsydda presentförpackning för små flaskor' },
  ],

  // 446512444-1693753 (1 products)
  '446512444-1693753': [
    { id: '68be85bb094d08828def7292', name: 'Skräddarsydda presentförpackning för medium flaskor' },
  ],

  // 376799416-793563 (1 products)
  '376799416-793563': [
    { id: '68be85bb094d08828def72f1', name: 'Restry L produktpåse' },
  ],

  // 378292586-1223654 (1 products)
  '378292586-1223654': [
    { id: '68be85bb094d08828def74a7', name: 'BIC® 4 Colours Soft with Lanyard' },
  ],

  // 477436750-1087807 (1 products)
  '477436750-1087807': [
    { id: '68be85bc094d08828def76cf', name: 'SuboGift L presentpåse med tryck, stor' },
  ],

  // 477433264-1087796 (1 products)
  '477433264-1087796': [
    { id: '68be85bc094d08828def76d0', name: 'SuboGift M presentpåse med tryck, medium' },
  ],

  // 109897312-223610 (1 products)
  '109897312-223610': [
    { id: '68be85bc094d08828def77f9', name: 'Regnponcho i påse med tryck' },
  ],

  // 152370736-347561 (1 products)
  '152370736-347561': [
    { id: '68be85bc094d08828def77fb', name: 'Blado - Regnkappa med kapuchong' },
  ],

  // 152153442-347146 (1 products)
  '152153442-347146': [
    { id: '68be85bc094d08828def77fc', name: 'Regal - Regnponcho' },
  ],

  // 138583606-948503 (1 products)
  '138583606-948503': [
    { id: '68be85bc094d08828def77fd', name: 'Regnponcho i plastboll med tryck' },
  ],

  // 138592902-948506 (1 products)
  '138592902-948506': [
    { id: '68be85bc094d08828def77fe', name: 'Billig regnponcho med tryck' },
  ],

  // 191530136-946335 (1 products)
  '191530136-946335': [
    { id: '68be85bc094d08828def77ff', name: 'Clear regnponcho' },
  ],

  // 499591442-1215659 (1 products)
  '499591442-1215659': [
    { id: '68be85bc094d08828def7801', name: 'Vallen - Regnponcho' },
  ],

  // 140855316-662417 (1 products)
  '140855316-662417': [
    { id: '68be85bc094d08828def7802', name: 'Regnponcho i boll med tryck' },
  ],

  // 175680456-403599 (1 products)
  '175680456-403599': [
    { id: '68be85bc094d08828def7803', name: 'Aegis poncho nyckelring' },
  ],

  // 175683942-403615 (1 products)
  '175683942-403615': [
    { id: '68be85bc094d08828def7804', name: 'Stormy poncho' },
  ],

  // 140839048-662372 (1 products)
  '140839048-662372': [
    { id: '68be85bd094d08828def7b4b', name: 'Handgel med tryck' },
  ],

  // 109964708-223795 (1 products)
  '109964708-223795': [
    { id: '68be85bd094d08828def7b79', name: 'Billigt cerat med tryck' },
  ],

  // 495512822-1194517 (1 products)
  '495512822-1194517': [
    { id: '68be85bd094d08828def7b7a', name: 'Adony läppbalsam' },
  ],

  // 548379174-1578774 (1 products)
  '548379174-1578774': [
    { id: '68be85bd094d08828def7b7c', name: 'Ero läppbalsam' },
  ],

  // 568613080-1660947 (1 products)
  '568613080-1660947': [
    { id: '68be85bd094d08828def7b7e', name: 'Eden läppbalsam med vanilj' },
  ],

  // 152195274-347254 (1 products)
  '152195274-347254': [
    { id: '68be85bd094d08828def7b7f', name: 'Gloss - Läppbalsam' },
  ],

  // 153727952-350520 (1 products)
  '153727952-350520': [
    { id: '68be85bd094d08828def7b80', name: 'Uv Gloss - Läppcerat/balsam med UV skydd' },
  ],

  // 153690768-350460 (1 products)
  '153690768-350460': [
    { id: '68be85bd094d08828def7b81', name: 'Uv Soft - Runt läpp cerat med UV skydd' },
  ],

  // 153691930-350464 (1 products)
  '153691930-350464': [
    { id: '68be85bd094d08828def7b82', name: 'Duo Mirror - läppcerat med spegel' },
  ],

  // 442699922-944053 (1 products)
  '442699922-944053': [
    { id: '68be85bd094d08828def7b83', name: 'Balm - Veganskt läppbalsam i burk' },
  ],

  // 549743362-1586411 (1 products)
  '549743362-1586411': [
    { id: '68be85bd094d08828def7b84', name: 'Ezra - Veganskt läppbalsam' },
  ],

  // 52732722-83783 (1 products)
  '52732722-83783': [
    { id: '68be85bd094d08828def7b85', name: 'Lippo cerat med tryck' },
  ],

  // 138596388-948514 (1 products)
  '138596388-948514': [
    { id: '68be85bd094d08828def7b86', name: 'Cerat med solskyddsfaktor' },
  ],

  // 140864612-662455 (1 products)
  '140864612-662455': [
    { id: '68be85bd094d08828def7b87', name: 'Läppbalsam med tryck' },
  ],

  // 195507662-639410 (1 products)
  '195507662-639410': [
    { id: '68be85bd094d08828def7b88', name: 'JOLIE. Lypsyl i PS och PP' },
  ],

  // 191754402-668886 (1 products)
  '191754402-668886': [
    { id: '68be85bd094d08828def7b89', name: 'Lipbalm Glossy läppbalsam' },
  ],

  // 555002574-1608390 (1 products)
  '555002574-1608390': [
    { id: '68be85bd094d08828def7b8b', name: 'PP-ask läppbalsam Kimberly' },
  ],

  // 140839048-662369 (1 products)
  '140839048-662369': [
    { id: '68be85bd094d08828def7bbb', name: 'Handgel med tryck' },
  ],

  // 371448406-782976 (1 products)
  '371448406-782976': [
    { id: '68be85be094d08828def7c21', name: 'Läppbalsam' },
  ],

  // 371298508-782812 (1 products)
  '371298508-782812': [
    { id: '68be85be094d08828def7c22', name: 'Läppbalsam spf20' },
  ],

  // 291558582-1114252 (1 products)
  '291558582-1114252': [
    { id: '68be85be094d08828def7c23', name: 'Liplox Läppbalsam' },
  ],

  // 531488342-1512407 (1 products)
  '531488342-1512407': [
    { id: '68be85be094d08828def7c25', name: 'Labicor Läppbalsam' },
  ],

  // 531365170-1512120 (1 products)
  '531365170-1512120': [
    { id: '68be85be094d08828def7c26', name: 'Tublox Läppbalsam' },
  ],

  // 531361684-1512111 (1 products)
  '531361684-1512111': [
    { id: '68be85be094d08828def7c27', name: 'Lippa Läppbalsam' },
  ],

  // 109931010-223703 (1 products)
  '109931010-223703': [
    { id: '68be85be094d08828def7dab', name: 'Antistressboll med tryck' },
  ],

  // 137587772-947359 (1 products)
  '137587772-947359': [
    { id: '68be85be094d08828def7db3', name: 'Billig Stressboll med tryck' },
  ],

  // 137586610-947354 (1 products)
  '137586610-947354': [
    { id: '68be85be094d08828def7db5', name: 'Jonglerboll med logo' },
  ],

  // 139069322-716704 (1 products)
  '139069322-716704': [
    { id: '68be85c0094d08828def879e', name: 'Sytt Sadelskydd med tryck' },
  ],

  // 139555038-717500 (1 products)
  '139555038-717500': [
    { id: '68be85c0094d08828def879f', name: 'Sadelskydd reflex med tryck' },
  ],

  // 139075132-716770 (1 products)
  '139075132-716770': [
    { id: '68be85c0094d08828def87a0', name: 'Sadelskydd PU med tryck' },
  ],

  // 139072808-716745 (1 products)
  '139072808-716745': [
    { id: '68be85c1094d08828def87a2', name: 'Sadelskydd Nylon med tryck' },
  ],

  // 339434144-731732 (1 products)
  '339434144-731732': [
    { id: '68be85c1094d08828def88b9', name: 'Women´s Polo' },
  ],

  // 495939276-1198181 (1 products)
  '495939276-1198181': [
    { id: '68be85c1094d08828def8a7c', name: 'Identifieringsväst "Leipzig"' },
  ],

  // 496025264-1198555 (1 products)
  '496025264-1198555': [
    { id: '68be85c1094d08828def8adb', name: 'Hi-Vis Vändbar Softshell Bodywarmer "Elbrus"' },
  ],

  // 585082106-1766647 (1 products)
  '585082106-1766647': [
    { id: '68be85c1094d08828def8ae1', name: 'WV84 - LIGHT FLEECE VEST' },
  ],

  // 585079782-1766643 (1 products)
  '585079782-1766643': [
    { id: '68be85c1094d08828def8ae2', name: 'FV84 - LIGHT FLEECE VEST' },
  ],

  // 495939276-1198185 (1 products)
  '495939276-1198185': [
    { id: '68be85c2094d08828def8c2d', name: 'Identifieringsväst "Leipzig"' },
  ],

  // 496039208-1198580 (1 products)
  '496039208-1198580': [
    { id: '68be85c2094d08828def8c32', name: 'Promo Specialväst "Sylt"' },
  ],

  // blockomslag (1 products)
  'blockomslag': [
    { id: '68be85c3094d08828def9051', name: 'Blockomslag PP A6, svart' },
  ],

  // fotoalbum-och-tillbehor (1 products)
  'fotoalbum-och-tillbehor': [
    { id: '68be85c3094d08828def907d', name: 'Fotohörn 250/fp' },
  ],

  // sittbollar (1 products)
  'sittbollar': [
    { id: '68be85c4094d08828def94eb', name: 'Sittboll JOBOUT Ø65' },
  ],

  // visitkortsetiketter (1 products)
  'visitkortsetiketter': [
    { id: '68be85c4094d08828def961f', name: 'Visitkort AVERY laser 85x54 satin 250/fp' },
  ],

  // plastregister-instick (1 products)
  'plastregister-instick': [
    { id: '68be85c5094d08828def97b7', name: 'Instick ELBA till hängmapp 80st/fp' },
  ],

  // kosystem-och-biljetter (1 products)
  'kosystem-och-biljetter': [
    { id: '68be85c6094d08828def9edc', name: 'Könummerlapp Nemo-Q 53,7x76,2mm' },
  ],

  // ovriga-butiksmaterial (1 products)
  'ovriga-butiksmaterial': [
    { id: '68be85c6094d08828def9f2f', name: 'Kassalåda SAFESCAN LD-4141' },
  ],

  // textilband (1 products)
  'textilband': [
    { id: '68be85c6094d08828def9fb1', name: 'Korthållare CardKeep Excellent 10/fp' },
  ],

  // 487562418-1137517 (1 products)
  '487562418-1137517': [
    { id: '68be85c9094d08828defa705', name: 'Merch Set Happy Cheers gåvoset' },
  ],

  // 499461298-1215377 (1 products)
  '499461298-1215377': [
    { id: '68be85c9094d08828defa88c', name: 'Underlägg och kapsylöppnare i bambu' },
  ],

  // 474728128-1069644 (1 products)
  '474728128-1069644': [
    { id: '68be85ca094d08828defa8e4', name: 'Presentkartong' },
  ],

  // 586325446-1775273 (1 products)
  '586325446-1775273': [
    { id: '68be85ca094d08828defa927', name: 'Bagageetikett, Bagagetag, i återvunnen PU, Isen' },
  ],

  // 506972466-1305591 (1 products)
  '506972466-1305591': [
    { id: '68be85cb094d08828defacd2', name: 'T-shirt SXT 4 Dallas (120 g) Dam EU' },
  ],

  // 474857110-1071386 (1 products)
  '474857110-1071386': [
    { id: '68be85cb094d08828defacf2', name: 'MJUK MORGONROCK I VELOUR' },
  ],

  // 333835628-1126314 (1 products)
  '333835628-1126314': [
    { id: '68be85cb094d08828defacf3', name: 'Mockatofflor från Ylleverket' },
  ],

  // 506980600-1305596 (1 products)
  '506980600-1305596': [
    { id: '68be85cb094d08828defad80', name: 'T-shirt SXT 4 Dallas (120 g) Herr EU' },
  ],

  // 506970142-1305589 (1 products)
  '506970142-1305589': [
    { id: '68be85cb094d08828defad89', name: 'T-shirt SXT 2 (135 g) Herr EU' },
  ],

  // 554904966-1608236 (1 products)
  '554904966-1608236': [
    { id: '68be85cc094d08828defb0d4', name: 'ABS isskrapa Doug' },
  ],

  // 500841754-1225670 (1 products)
  '500841754-1225670': [
    { id: '68be85cc094d08828defb174', name: 'SuboRing RPET-nyckelring med tryck' },
  ],

  // 553000448-1600206 (1 products)
  '553000448-1600206': [
    { id: '68be85cd094d08828defb506', name: 'BBQlight kökständare' },
  ],

  // 258508978-549849 (1 products)
  '258508978-549849': [
    { id: '68be85cd094d08828defba62', name: 'All day Sverige T-Shirt' },
  ],

  // cyklar (1 products)
  'cyklar': [
    { id: '68be85cd094d08828defba63', name: 'Företagscykel Egen Design' },
  ],

  // 531445348-1512280 (1 products)
  '531445348-1512280': [
    { id: '68be85cd094d08828defbcca', name: 'MagBadge Square nålknapp kylskåpsmagnet' },
  ],

  // 501122958-1226227 (1 products)
  '501122958-1226227': [
    { id: '68be85cd094d08828defbe26', name: 'Jakarta bagagetagg' },
  ],

  // 496184458-1199985 (1 products)
  '496184458-1199985': [
    { id: '68be85ce094d08828defc2bd', name: 'Bagagetag i kork Makai' },
  ],

  // 476545496-1084238 (1 products)
  '476545496-1084238': [
    { id: '68be85ce094d08828defc2cb', name: 'Adressbricka av bambu Shawn' },
  ],

  // 570682602-1672802 (1 products)
  '570682602-1672802': [
    { id: '68be85ce094d08828defc425', name: 'Flasköppnare av kork Ophelie' },
  ],

  // 530706316-1500671 (1 products)
  '530706316-1500671': [
    { id: '68be85ce094d08828defc429', name: 'Logoband i bomull med dragsko Lucia' },
  ],

  // 501125282-1226230 (1 products)
  '501125282-1226230': [
    { id: '68be85ce094d08828defc543', name: 'Luton Bagagetag' },
  ],

  // 464551332-998075 (1 products)
  '464551332-998075': [
    { id: '68be85ce094d08828defc54b', name: 'Magnet, pappersmagnet 0,8 mm tjock' },
  ],

  // 506958522-1272937 (1 products)
  '506958522-1272937': [
    { id: '68be85ce094d08828defc553', name: 'Poncho Delux EU' },
  ],

  // 552999286-1600205 (1 products)
  '552999286-1600205': [
    { id: '68be85cf094d08828defc635', name: 'Gasolight bensintändare' },
  ],

  // 468116348-1092711 (1 products)
  '468116348-1092711': [
    { id: '68be85cf094d08828defc636', name: 'CreaSleeve Kraft 563' },
  ],

  // 468115186-1092710 (1 products)
  '468115186-1092710': [
    { id: '68be85cf094d08828defc649', name: 'CreaSleeve 563' },
  ],

  // 506959684-1272938 (1 products)
  '506959684-1272938': [
    { id: '68be85cf094d08828defc67c', name: 'Poncho Classic EU' },
  ],

  // 583136918-1758024 (1 products)
  '583136918-1758024': [
    { id: '68be85cf094d08828defc6bb', name: 'Moomin Rooibos Red Berries Tin Refil' },
  ],

  // 583140404-1758027 (1 products)
  '583140404-1758027': [
    { id: '68be85cf094d08828defc6be', name: 'Moomin Papa Grey Tin Refil' },
  ],

  // 583139242-1758026 (1 products)
  '583139242-1758026': [
    { id: '68be85cf094d08828defc6c0', name: 'Moomin Mama Quince Tin Refil' },
  ],

  // 471608158-1051152 (1 products)
  '471608158-1051152': [
    { id: '68be85cf094d08828defc7b8', name: 'Bao Medium - Presentpapperspåse medium' },
  ],

  // 464550170-998074 (1 products)
  '464550170-998074': [
    { id: '68be85cf094d08828defc7c2', name: 'Magnet, pappersmagnet 2,0 mm tjock' },
  ],

  // 500928904-1225864 (1 products)
  '500928904-1225864': [
    { id: '68be85cf094d08828defc7e4', name: 'Subyard Mobile Safe RPET mobilhållare nyckelband med tryck' },
  ],

  // 583138080-1758025 (1 products)
  '583138080-1758025': [
    { id: '68be85cf094d08828defc7f3', name: 'Moomin Little My Lemon Tin Refil' },
  ],

  // 475979602-1081301 (1 products)
  '475979602-1081301': [
    { id: '68be85cf094d08828defc7fa', name: 'Glögg norrsken' },
  ],

  // 583164806-1758048 (1 products)
  '583164806-1758048': [
    { id: '68be85cf094d08828defc7fb', name: 'Oeno Motion Black' },
  ],

  // 476530390-1084204 (1 products)
  '476530390-1084204': [
    { id: '68be85d0094d08828defc93a', name: 'Ishink av järn och aluminium Corey' },
  ],

  // 422827398-901312 (1 products)
  '422827398-901312': [
    { id: '68be85d0094d08828defc9a4', name: 'CreaBox PB-376' },
  ],

  // 583141566-1758028 (1 products)
  '583141566-1758028': [
    { id: '68be85d0094d08828defc9b9', name: 'Adventskalender Moomin' },
  ],

  // 527373700-1483640 (1 products)
  '527373700-1483640': [
    { id: '68be85d0094d08828defcabf', name: 'Notle - Kapsylöppnare Julmotiv' },
  ],

  // 583142728-1758029 (1 products)
  '583142728-1758029': [
    { id: '68be85d0094d08828defcb3b', name: 'Adventskalender Teministeriet Signature' },
  ],

  // 477634290-1088169 (1 products)
  '477634290-1088169': [
    { id: '68be85d0094d08828defcb7a', name: 'CreaFelt Tag RPET-bagagetagg med tryck' },
  ],

  // 527432962-1483735 (1 products)
  '527432962-1483735': [
    { id: '68be85d0094d08828defcc58', name: 'Wool - 3 i 1 kapsylöppnare i bambu.' },
  ],

  // 496115900-1198728 (1 products)
  '496115900-1198728': [
    { id: '68be85d0094d08828defcc7a', name: '270 Green Island Rose - Tin' },
  ],

  // 496114738-1198727 (1 products)
  '496114738-1198727': [
    { id: '68be85d0094d08828defcc87', name: '262 Green Northern Berries - Tin' },
  ],

  // 549960656-1589993 (1 products)
  '549960656-1589993': [
    { id: '68be85d0094d08828defcc96', name: 'Kapsylöppnare le Brasseur' },
  ],

  // 496119386-1198731 (1 products)
  '496119386-1198731': [
    { id: '68be85d0094d08828defcc9a', name: '730 Rooibos Coconut Ginger - Tin' },
  ],

  // 448724892-958364 (1 products)
  '448724892-958364': [
    { id: '68be85d0094d08828defcd57', name: 'Scrawy isskrapa' },
  ],

  // 496118224-1198730 (1 products)
  '496118224-1198730': [
    { id: '68be85d0094d08828defcd5d', name: '580 Black Earl Grey Organic - Tin' },
  ],

  // 558594316-1616722 (1 products)
  '558594316-1616722': [
    { id: '68be85d0094d08828defcdc7', name: 'Jr Grove hybrid vest' },
  ],

  // 115858372-238697 (1 products)
  '115858372-238697': [
    { id: '68be85d1094d08828defcec4', name: 'Logoband Invävd logo' },
  ],

  // 115861858-238700 (1 products)
  '115861858-238700': [
    { id: '68be85d1094d08828defcec8', name: 'Sverigelogoband' },
  ],

  // 115894394-238734 (1 products)
  '115894394-238734': [
    { id: '68be85d1094d08828defceca', name: 'Logobandstillbehör Flasköppnare' },
  ],

  // 115910662-238748 (1 products)
  '115910662-238748': [
    { id: '68be85d1094d08828defcecb', name: 'Logoband kork med tryck' },
  ],

  // 115897880-238737 (1 products)
  '115897880-238737': [
    { id: '68be85d1094d08828defcecd', name: 'Logobandstillbehör Mountain hook' },
  ],

  // 115909500-238747 (1 products)
  '115909500-238747': [
    { id: '68be85d1094d08828defced0', name: 'Logoband Runt med tryck' },
  ],

  // 115902528-238741 (1 products)
  '115902528-238741': [
    { id: '68be85d1094d08828defced1', name: 'Mobilsnöre till Nyckelband' },
  ],

  // 115895556-238735 (1 products)
  '115895556-238735': [
    { id: '68be85d1094d08828defced2', name: 'Logobandstillbehör Kraftig karbinhake' },
  ],

  // 115867668-238710 (1 products)
  '115867668-238710': [
    { id: '68be85d1094d08828defced3', name: 'Logoband Express' },
  ],

  // 115903690-238742 (1 products)
  '115903690-238742': [
    { id: '68be85d1094d08828defced6', name: 'Avtagbart Mobilsnöre till Nyckelband' },
  ],

  // 115908338-238746 (1 products)
  '115908338-238746': [
    { id: '68be85d1094d08828defced7', name: 'Logobandstillbehör Reflexband' },
  ],

  // 527448068-1483786 (1 products)
  '527448068-1483786': [
    { id: '68be85d1094d08828defcedc', name: 'Icehand - Isskrapa med handske' },
  ],

  // 496117062-1198729 (1 products)
  '496117062-1198729': [
    { id: '68be85d1094d08828defcefa', name: '535 Stockholm Breakfast - Tin' },
  ],

  // 496108928-1198722 (1 products)
  '496108928-1198722': [
    { id: '68be85d1094d08828defcf00', name: 'Moomin Rooibos Red Berries Tin' },
  ],

  // 496111252-1198724 (1 products)
  '496111252-1198724': [
    { id: '68be85d1094d08828defcf03', name: 'Moomin Mama Quince Tin' },
  ],

  // 496110090-1198723 (1 products)
  '496110090-1198723': [
    { id: '68be85d1094d08828defcf04', name: 'Moomin Little My Lemon Tin' },
  ],

  // 496112414-1198725 (1 products)
  '496112414-1198725': [
    { id: '68be85d1094d08828defcf0f', name: 'Moomin Papa Grey Tin' },
  ],

  // 476538524-1084224 (1 products)
  '476538524-1084224': [
    { id: '68be85d1094d08828defcf39', name: 'Magnet av bambu med kapsylöppare Ace' },
  ],

  // 115892070-238732 (1 products)
  '115892070-238732': [
    { id: '68be85d1094d08828defcf6c', name: 'Tubvävt Logoband i egen färg' },
  ],

  // 115907176-238745 (1 products)
  '115907176-238745': [
    { id: '68be85d1094d08828defcf6f', name: 'Logobandstillbehör Jojo' },
  ],

  // 165209674-377844 (1 products)
  '165209674-377844': [
    { id: '68be85d1094d08828defcf70', name: 'Bagagetag 3D med logo' },
  ],

  // 115901366-238740 (1 products)
  '115901366-238740': [
    { id: '68be85d1094d08828defcf72', name: 'Logobandstillbehör Plastficka Stor stående' },
  ],

  // 115896718-238736 (1 products)
  '115896718-238736': [
    { id: '68be85d1094d08828defcf73', name: 'Logobandstillbehör Extra soft band' },
  ],

  // 165208512-377843 (1 products)
  '165208512-377843': [
    { id: '68be85d1094d08828defcf74', name: 'Bagagebricka 3D med logo' },
  ],

  // 115889746-238730 (1 products)
  '115889746-238730': [
    { id: '68be85d1094d08828defcf75', name: 'Logoband i egen färg med tryck' },
  ],

  // 493665242-1185877 (1 products)
  '493665242-1185877': [
    { id: '68be85d1094d08828defcf9a', name: 'Ball - Läppbalsam fotboll' },
  ],

  // 493703588-1185936 (1 products)
  '493703588-1185936': [
    { id: '68be85d1094d08828defcf9e', name: 'Blancos - Sneakers i PU storlek 47' },
  ],

  // 471544248-1051080 (1 products)
  '471544248-1051080': [
    { id: '68be85d1094d08828defcfa7', name: 'Bossa Small - Presentpåse, 23 cm hög' },
  ],

  // 416916304-888269 (1 products)
  '416916304-888269': [
    { id: '68be85d1094d08828defcfd3', name: 'soluppgång Mousserande Cider' },
  ],

  // 496107766-1198721 (1 products)
  '496107766-1198721': [
    { id: '68be85d1094d08828defcfd5', name: 'Moomin Rooibos Cranberry Tin' },
  ],

  // 185667846-890625 (1 products)
  '185667846-890625': [
    { id: '68be85d1094d08828defcfe4', name: 'Vepa till Kyltunna TK65' },
  ],

  // 185665522-553908 (1 products)
  '185665522-553908': [
    { id: '68be85d1094d08828defcfe7', name: 'Profilerad PET-flaska 33cl' },
  ],

  // 477598268-1088103 (1 products)
  '477598268-1088103': [
    { id: '68be85d1094d08828defcfeb', name: 'Subyard Mobile RPET RPET mobilhållare nyckelband med tryck' },
  ],

  // 448337946-957681 (1 products)
  '448337946-957681': [
    { id: '68be85d1094d08828defcfec', name: 'CreaBox Pillow Lock M kuddbox' },
  ],

  // 448342594-957688 (1 products)
  '448342594-957688': [
    { id: '68be85d1094d08828defcfee', name: 'CreaBox HexaCord S sexkantig presentförpackning' },
  ],

  // 435376998-950156 (1 products)
  '435376998-950156': [
    { id: '68be85d1094d08828defd00e', name: 'Kyparkniv i bambu Lenny' },
  ],

  // 495012000-1191368 (1 products)
  '495012000-1191368': [
    { id: '68be85d1094d08828defd01e', name: 'THC RUN WH. Sportstrumpa' },
  ],

  // 549686424-1586292 (1 products)
  '549686424-1586292': [
    { id: '68be85d1094d08828defd048', name: 'Buper - Kapsylöppnare i bambu' },
  ],

  // 471546572-1051082 (1 products)
  '471546572-1051082': [
    { id: '68be85d1094d08828defd050', name: 'Bossa Large - Presentpåse, 36 cm hög' },
  ],

  // 471609320-1051153 (1 products)
  '471609320-1051153': [
    { id: '68be85d1094d08828defd057', name: 'Bao Large - Presentpapperspåse stor' },
  ],

  // 435213156-949893 (1 products)
  '435213156-949893': [
    { id: '68be85d1094d08828defd0ea', name: 'Flasköppnare, av trä, Travis' },
  ],

  // 165690742-1633332 (1 products)
  '165690742-1633332': [
    { id: '68be85d1094d08828defd0fd', name: 'Påskmust med egen etikett' },
  ],

  // 493702426-1185935 (1 products)
  '493702426-1185935': [
    { id: '68be85d1094d08828defd12c', name: 'Blancos - Sneakers i PU storlek 46' },
  ],

  // 493667566-1185879 (1 products)
  '493667566-1185879': [
    { id: '68be85d1094d08828defd12d', name: 'Golf - Läppbalsam golfboll' },
  ],

  // 448588938-958138 (1 products)
  '448588938-958138': [
    { id: '68be85d1094d08828defd13b', name: 'Avelox Läppbalsam' },
  ],

  // 422784404-957656 (1 products)
  '422784404-957656': [
    { id: '68be85d1094d08828defd13f', name: 'CreaBox EF-360' },
  ],

  // 448671440-958282 (1 products)
  '448671440-958282': [
    { id: '68be85d1094d08828defd144', name: 'CreaBox Specialtillverkat Penfodral' },
  ],

  // 422891308-957666 (1 products)
  '422891308-957666': [
    { id: '68be85d1094d08828defd145', name: 'CreaSleeve 519' },
  ],

  // 437366342-950507 (1 products)
  '437366342-950507': [
    { id: '68be85d1094d08828defd1a5', name: 'Flasköppnare i bambu Sherry' },
  ],

  // 448672602-958283 (1 products)
  '448672602-958283': [
    { id: '68be85d2094d08828defd1f1', name: 'CreaBox Pillow Pennask' },
  ],

  // 423058636-957679 (1 products)
  '423058636-957679': [
    { id: '68be85d2094d08828defd1f5', name: 'CreaSleeve 517' },
  ],

  // 422890146-957665 (1 products)
  '422890146-957665': [
    { id: '68be85d2094d08828defd1fb', name: 'CreaSleeve Kraft 518' },
  ],

  // 423038882-957674 (1 products)
  '423038882-957674': [
    { id: '68be85d2094d08828defd1fc', name: 'CreaBox PB-426' },
  ],

  // 423034234-957670 (1 products)
  '423034234-957670': [
    { id: '68be85d2094d08828defd26f', name: 'CreaBox PB-422' },
  ],

  // 448340270-957686 (1 products)
  '448340270-957686': [
    { id: '68be85d2094d08828defd271', name: 'CreaBox Pillow Lock S kuddbox' },
  ],

  // 423059798-957680 (1 products)
  '423059798-957680': [
    { id: '68be85d2094d08828defd272', name: 'CreaSleeve Kraft 517' },
  ],

  // 448341432-957687 (1 products)
  '448341432-957687': [
    { id: '68be85d2094d08828defd274', name: 'CreaBox HexaCord M sexkantig presentförpackning' },
  ],

  // 422897118-957669 (1 products)
  '422897118-957669': [
    { id: '68be85d2094d08828defd27d', name: 'CreaSleeve Kraft 520' },
  ],

  // 435546650-950513 (1 products)
  '435546650-950513': [
    { id: '68be85d2094d08828defd28c', name: 'Morgonrock fleece (210 gr/m²) Derek' },
  ],

  // 181613628-879078 (1 products)
  '181613628-879078': [
    { id: '68be85d2094d08828defd29d', name: 'Logoband Dubbelvävt' },
  ],

  // 181614790-879079 (1 products)
  '181614790-879079': [
    { id: '68be85d2094d08828defd29e', name: 'Logoband Linking' },
  ],

  // 195674990-639796 (1 products)
  '195674990-639796': [
    { id: '68be85d2094d08828defd2ce', name: 'EMIL. Aluminiumidentifierare' },
  ],

  // saker-i-bilen (1 products)
  'saker-i-bilen': [
    { id: '68be85d2094d08828defd306', name: 'Lustre - 3 i 1 nödhammar' },
  ],

  // 472990938-1057572 (1 products)
  '472990938-1057572': [
    { id: '68be85d2094d08828defd316', name: 'Blancos - Sneakers i PU stl 37' },
  ],

  // 422780918-957655 (1 products)
  '422780918-957655': [
    { id: '68be85d2094d08828defd325', name: 'CreaBox PB-366' },
  ],

  // 422796024-957660 (1 products)
  '422796024-957660': [
    { id: '68be85d2094d08828defd326', name: 'CreaBox PB-368' },
  ],

  // 423057474-957678 (1 products)
  '423057474-957678': [
    { id: '68be85d2094d08828defd32b', name: 'CreaSleeve Kraft 516' },
  ],

  // 422786728-957657 (1 products)
  '422786728-957657': [
    { id: '68be85d2094d08828defd32c', name: 'CreaBox PB-367' },
  ],

  // 422804158-957663 (1 products)
  '422804158-957663': [
    { id: '68be85d2094d08828defd32e', name: 'CreaBox PB-371' },
  ],

  // 423035396-957671 (1 products)
  '423035396-957671': [
    { id: '68be85d2094d08828defd331', name: 'CreaBox PB-423' },
  ],

  // 423037720-957673 (1 products)
  '423037720-957673': [
    { id: '68be85d2094d08828defd335', name: 'CreaBox PB-425' },
  ],

  // 486421334-1132695 (1 products)
  '486421334-1132695': [
    { id: '68be85d2094d08828defd336', name: 'X200 Low Shoe' },
  ],

  // 583709784-1761242 (1 products)
  '583709784-1761242': [
    { id: '68be85d2094d08828defd338', name: 'Classic LT Shoe' },
  ],

  // 583710946-1761243 (1 products)
  '583710946-1761243': [
    { id: '68be85d2094d08828defd339', name: 'Classic LT Shoe' },
  ],

  // 554098538-1604451 (1 products)
  '554098538-1604451': [
    { id: '68be85d2094d08828defd33c', name: 'T3110 Shoe w' },
  ],

  // 554113644-1604465 (1 products)
  '554113644-1604465': [
    { id: '68be85d2094d08828defd33f', name: 'R1300 Shoe w' },
  ],

  // 554097376-1604450 (1 products)
  '554097376-1604450': [
    { id: '68be85d2094d08828defd340', name: 'SL100 Suede Shoe' },
  ],

  // 554096214-1604449 (1 products)
  '554096214-1604449': [
    { id: '68be85d2094d08828defd344', name: 'SL110 Shoe' },
  ],

  // 486635142-1133324 (1 products)
  '486635142-1133324': [
    { id: '68be85d2094d08828defd345', name: 'SL100 Shoe w' },
  ],

  // 486428306-1132702 (1 products)
  '486428306-1132702': [
    { id: '68be85d2094d08828defd347', name: 'X600 Shoe' },
  ],

  // 486424820-1132698 (1 products)
  '486424820-1132698': [
    { id: '68be85d2094d08828defd349', name: 'T305 Shoe w' },
  ],

  // 138862486-716643 (1 products)
  '138862486-716643': [
    { id: '68be85d2094d08828defd359', name: 'Logoband God Jul' },
  ],

  // 586222028-1774500 (1 products)
  '586222028-1774500': [
    { id: '68be85d2094d08828defd371', name: 'Morgonrock' },
  ],

  // 423056312-957677 (1 products)
  '423056312-957677': [
    { id: '68be85d2094d08828defd402', name: 'CreaSleeve 516' },
  ],

  // 422888984-957664 (1 products)
  '422888984-957664': [
    { id: '68be85d2094d08828defd403', name: 'CreaSleeve 518' },
  ],

  // 423048178-909047 (1 products)
  '423048178-909047': [
    { id: '68be85d2094d08828defd405', name: 'CreaSleeve Kraft 512' },
  ],

  // 423052826-909051 (1 products)
  '423052826-909051': [
    { id: '68be85d2094d08828defd407', name: 'CreaSleeve Kraft 514' },
  ],

  // 423040044-957675 (1 products)
  '423040044-957675': [
    { id: '68be85d2094d08828defd40b', name: 'CreaBox EF-409' },
  ],

  // 422845990-901328 (1 products)
  '422845990-901328': [
    { id: '68be85d2094d08828defd40d', name: 'CreaSleeve 437' },
  ],

  // 422893632-957667 (1 products)
  '422893632-957667': [
    { id: '68be85d2094d08828defd40f', name: 'CreaSleeve Kraft 519' },
  ],

  // 422771622-957652 (1 products)
  '422771622-957652': [
    { id: '68be85d2094d08828defd410', name: 'CreaBox PB-363' },
  ],

  // 422798348-957661 (1 products)
  '422798348-957661': [
    { id: '68be85d2094d08828defd411', name: 'CreaBox PB-369' },
  ],

  // 422873878-901349 (1 products)
  '422873878-901349': [
    { id: '68be85d2094d08828defd412', name: 'CreaSleeve Kraft 493' },
  ],

  // 423053988-909052 (1 products)
  '423053988-909052': [
    { id: '68be85d2094d08828defd413', name: 'CreaSleeve 515' },
  ],

  // 422935464-901396 (1 products)
  '422935464-901396': [
    { id: '68be85d2094d08828defd414', name: 'CreaSleeve Kraft 483' },
  ],

  // 422837856-901321 (1 products)
  '422837856-901321': [
    { id: '68be85d2094d08828defd416', name: 'Crea Sleeve Kraftpapper 433' },
  ],

  // 138855514-716637 (1 products)
  '138855514-716637': [
    { id: '68be85d2094d08828defd42c', name: 'Logoband Reflex med tryck' },
  ],

  // 138859000-716640 (1 products)
  '138859000-716640': [
    { id: '68be85d2094d08828defd438', name: 'Logoband Svensk fotboll' },
  ],

  // 138867134-716647 (1 products)
  '138867134-716647': [
    { id: '68be85d2094d08828defd43c', name: 'Logoband Danmark' },
  ],

  // 138865972-716646 (1 products)
  '138865972-716646': [
    { id: '68be85d2094d08828defd446', name: 'Logoband Norge' },
  ],

  // 138510400-948329 (1 products)
  '138510400-948329': [
    { id: '68be85d2094d08828defd448', name: 'Antistress fotboll med tryck' },
  ],

  // 284633062-639016 (1 products)
  '284633062-639016': [
    { id: '68be85d2094d08828defd45d', name: 'HOLZ. Flaska öppnare av metall och trä' },
  ],

  // 447158516-956140 (1 products)
  '447158516-956140': [
    { id: '68be85d2094d08828defd45f', name: 'THC FAIR WH. T-shirt i 100% bomull. vit färg' },
  ],

  // 472994424-1057575 (1 products)
  '472994424-1057575': [
    { id: '68be85d2094d08828defd4b7', name: 'Blancos - Sneakers i PU stl 40' },
  ],

  // 461453440-991487 (1 products)
  '461453440-991487': [
    { id: '68be85d2094d08828defd4f0', name: 'Presentband' },
  ],

  // 461454602-991488 (1 products)
  '461454602-991488': [
    { id: '68be85d2094d08828defd4f2', name: 'Presentband' },
  ],

  // 461452278-991486 (1 products)
  '461452278-991486': [
    { id: '68be85d2094d08828defd4f4', name: 'Presentband' },
  ],

  // 447170136-956170 (1 products)
  '447170136-956170': [
    { id: '68be85d2094d08828defd552', name: 'THC FAIR SMALL WH. T-shirt i bomull för barn' },
  ],

  // 447155030-956129 (1 products)
  '447155030-956129': [
    { id: '68be85d2094d08828defd554', name: 'THC MOVE KIDS WH. T-shirt för barn' },
  ],

  // 375995312-843278 (1 products)
  '375995312-843278': [
    { id: '68be85d2094d08828defd555', name: 'THC MONACO WOMEN WH. Kortärmad pikétröja för kvinnor i kardad bomull' },
  ],

  // 447159678-956141 (1 products)
  '447159678-956141': [
    { id: '68be85d2094d08828defd559', name: 'FAIR 3XL WH. T-shirt i 100 % bomull' },
  ],

  // 376002284-843307 (1 products)
  '376002284-843307': [
    { id: '68be85d2094d08828defd563', name: 'THC BERLIN WH 3XL. Herr pikétröja' },
  ],

  // 422911062-901375 (1 products)
  '422911062-901375': [
    { id: '68be85d2094d08828defd567', name: 'CreaSleeve 472' },
  ],

  // 422892470-901362 (1 products)
  '422892470-901362': [
    { id: '68be85d2094d08828defd568', name: 'CreaSleeve Kraft 445' },
  ],

  // 422844828-901327 (1 products)
  '422844828-901327': [
    { id: '68be85d2094d08828defd569', name: 'CreaSleeve Kraft 436' },
  ],

  // 422777432-957654 (1 products)
  '422777432-957654': [
    { id: '68be85d2094d08828defd56a', name: 'CreaBox PB-365' },
  ],

  // 423045854-909045 (1 products)
  '423045854-909045': [
    { id: '68be85d2094d08828defd56b', name: 'CreaSleeve Kraft 511' },
  ],

  // 423036558-957672 (1 products)
  '423036558-957672': [
    { id: '68be85d2094d08828defd56c', name: 'CreaBox PB-424' },
  ],

  // 423008670-901459 (1 products)
  '423008670-901459': [
    { id: '68be85d2094d08828defd56d', name: 'CreaSleeve Kraft 509' },
  ],

  // 422912224-901376 (1 products)
  '422912224-901376': [
    { id: '68be85d2094d08828defd56e', name: 'CreaSleeve Kraft 472' },
  ],

  // 422764650-901270 (1 products)
  '422764650-901270': [
    { id: '68be85d2094d08828defd56f', name: 'CreaBox PB-360' },
  ],

  // 422776270-901278 (1 products)
  '422776270-901278': [
    { id: '68be85d2094d08828defd570', name: 'CreaSleeve 452' },
  ],

  // 422927330-901389 (1 products)
  '422927330-901389': [
    { id: '68be85d2094d08828defd571', name: 'CreaSleeve 480' },
  ],

  // 422900604-901366 (1 products)
  '422900604-901366': [
    { id: '68be85d2094d08828defd572', name: 'CreaSleeve Kraft 447' },
  ],

  // 422984268-901438 (1 products)
  '422984268-901438': [
    { id: '68be85d2094d08828defd573', name: 'CreaSleeve 498' },
  ],

  // 422884336-901358 (1 products)
  '422884336-901358': [
    { id: '68be85d2094d08828defd574', name: 'CreaSleeve Kraft 443' },
  ],

  // 422850638-901332 (1 products)
  '422850638-901332': [
    { id: '68be85d2094d08828defd575', name: 'CreaSleeve 439' },
  ],

  // 422820426-901306 (1 products)
  '422820426-901306': [
    { id: '68be85d2094d08828defd578', name: 'CreaSleeve 465' },
  ],

  // 422921520-901384 (1 products)
  '422921520-901384': [
    { id: '68be85d2094d08828defd579', name: 'CreaSleeve Kraft 476' },
  ],

  // 423015642-909026 (1 products)
  '423015642-909026': [
    { id: '68be85d2094d08828defd57b', name: 'CreaBox PB-417' },
  ],

  // 422930816-901392 (1 products)
  '422930816-901392': [
    { id: '68be85d2094d08828defd57c', name: 'CreaSleeve Kraft 481' },
  ],

  // 422976134-901431 (1 products)
  '422976134-901431': [
    { id: '68be85d2094d08828defd57d', name: 'CreaSleeve Kraft 494' },
  ],

  // 422914548-901378 (1 products)
  '422914548-901378': [
    { id: '68be85d2094d08828defd57e', name: 'CreaSleeve Kraft 473' },
  ],

  // 422985430-901439 (1 products)
  '422985430-901439': [
    { id: '68be85d2094d08828defd57f', name: 'CreaSleeve Kraft 498' },
  ],

  // 422849476-901331 (1 products)
  '422849476-901331': [
    { id: '68be85d2094d08828defd581', name: 'CreaSleeve Kraft 438' },
  ],

  // 181615952-879080 (1 products)
  '181615952-879080': [
    { id: '68be85d2094d08828defd58d', name: 'Logoband HD-vävt' },
  ],

  // 138869458-878586 (1 products)
  '138869458-878586': [
    { id: '68be85d2094d08828defd58f', name: 'Logoband Sverige (Lagervara)' },
  ],

  // 472997910-1057578 (1 products)
  '472997910-1057578': [
    { id: '68be85d2094d08828defd5c5', name: 'Blancos - Skor i PU stl 43' },
  ],

  // 61624346-98585 (1 products)
  '61624346-98585': [
    { id: '68be85d2094d08828defd5d5', name: 'Applådstavar Tryckta 2-pack - Standard' },
  ],

  // 447152706-956119 (1 products)
  '447152706-956119': [
    { id: '68be85d2094d08828defd613', name: 'THC MOVE WH. Teknisk kortärmad tröja' },
  ],

  // 375997636-843290 (1 products)
  '375997636-843290': [
    { id: '68be85d2094d08828defd617', name: 'THC BERLIN WOMEN WH. Kortärmad pikétröja för kvinnor' },
  ],

  // 422928492-901390 (1 products)
  '422928492-901390': [
    { id: '68be85d2094d08828defd630', name: 'CreaSleeve Kraft 480' },
  ],

  // 422836694-901320 (1 products)
  '422836694-901320': [
    { id: '68be85d2094d08828defd631', name: 'Crea Sleeve 433' },
  ],

  // 423044692-909044 (1 products)
  '423044692-909044': [
    { id: '68be85d2094d08828defd632', name: 'CreaSleeve 511' },
  ],

  // 422847152-901329 (1 products)
  '422847152-901329': [
    { id: '68be85d2094d08828defd633', name: 'CreaSleeve Kraft 437' },
  ],

  // 448605206-958152 (1 products)
  '448605206-958152': [
    { id: '68be85d2094d08828defd634', name: 'Strico nyckelband' },
  ],

  // 422944760-901404 (1 products)
  '422944760-901404': [
    { id: '68be85d2094d08828defd635', name: 'CreaSleeve Kraft 487' },
  ],

  // 423047016-909046 (1 products)
  '423047016-909046': [
    { id: '68be85d2094d08828defd636', name: 'CreaSleeve 512' },
  ],

  // 423001698-901453 (1 products)
  '423001698-901453': [
    { id: '68be85d2094d08828defd637', name: 'CreaSleeve Kraft 506' },
  ],

  // 422870392-901346 (1 products)
  '422870392-901346': [
    { id: '68be85d2094d08828defd638', name: 'CreaSleeve 492' },
  ],

  // 422916872-901380 (1 products)
  '422916872-901380': [
    { id: '68be85d2094d08828defd639', name: 'CreaSleeve Kraft 474' },
  ],

  // 422981944-901436 (1 products)
  '422981944-901436': [
    { id: '68be85d2094d08828defd63a', name: 'CreaSleeve 497' },
  ],

  // 422887822-901361 (1 products)
  '422887822-901361': [
    { id: '68be85d2094d08828defd63b', name: 'CreaSleeve 445' },
  ],

  // 422843666-901326 (1 products)
  '422843666-901326': [
    { id: '68be85d2094d08828defd63c', name: 'CreaSleeve 436' },
  ],

  // 423055150-909053 (1 products)
  '423055150-909053': [
    { id: '68be85d2094d08828defd63d', name: 'CreaSleeve Kraft 515' },
  ],

  // 422937788-901398 (1 products)
  '422937788-901398': [
    { id: '68be85d2094d08828defd63e', name: 'CreaSleeve Kraft 484' },
  ],

  // 422934302-901395 (1 products)
  '422934302-901395': [
    { id: '68be85d2094d08828defd63f', name: 'CreaSleeve 483' },
  ],

  // 423005184-901456 (1 products)
  '423005184-901456': [
    { id: '68be85d2094d08828defd640', name: 'CreaSleeve 508' },
  ],

  // 422929654-901391 (1 products)
  '422929654-901391': [
    { id: '68be85d2094d08828defd641', name: 'CreaSleeve 481' },
  ],

  // 422802996-901292 (1 products)
  '422802996-901292': [
    { id: '68be85d2094d08828defd642', name: 'CreaSleeve 459' },
  ],

  // 423049340-909048 (1 products)
  '423049340-909048': [
    { id: '68be85d2094d08828defd643', name: 'CreaSleeve 513' },
  ],

  // 422986592-901440 (1 products)
  '422986592-901440': [
    { id: '68be85d2094d08828defd644', name: 'CreaSleeve 500' },
  ],

  // 422931978-901393 (1 products)
  '422931978-901393': [
    { id: '68be85d2094d08828defd645', name: 'CreaSleeve 482' },
  ],

  // 422990078-901443 (1 products)
  '422990078-901443': [
    { id: '68be85d2094d08828defd646', name: 'CreaSleeve Kraft 501' },
  ],

  // 422882012-901356 (1 products)
  '422882012-901356': [
    { id: '68be85d2094d08828defd647', name: 'CreaSleeve Kraft 442' },
  ],

  // 423051664-909050 (1 products)
  '423051664-909050': [
    { id: '68be85d2094d08828defd648', name: 'CreaSleeve 514' },
  ],

  // 501000948-1225990 (1 products)
  '501000948-1225990': [
    { id: '68be85d2094d08828defd649', name: 'Wegix kapsylöppnare' },
  ],

  // 422978458-901433 (1 products)
  '422978458-901433': [
    { id: '68be85d2094d08828defd64a', name: 'CreaSleeve Kraft 495' },
  ],

  // 422894794-901363 (1 products)
  '422894794-901363': [
    { id: '68be85d2094d08828defd64b', name: 'CreaSleeve 446' },
  ],

  // 442634850-943956 (1 products)
  '442634850-943956': [
    { id: '68be85d2094d08828defd67d', name: 'Soft Lux - Lypsyl i rund bambuaskrin' },
  ],

  // 442633688-943955 (1 products)
  '442633688-943955': [
    { id: '68be85d2094d08828defd686', name: 'Gloss Lux - Lypsyl i bamburör' },
  ],

  // 59703560-96108 (1 products)
  '59703560-96108': [
    { id: '68be85d2094d08828defd699', name: 'Guldhatt' },
  ],

  // 451011708-963733 (1 products)
  '451011708-963733': [
    { id: '68be85d2094d08828defd6f1', name: 'BOXIE WOOD L. Trälåda' },
  ],

  // 422779756-901280 (1 products)
  '422779756-901280': [
    { id: '68be85d2094d08828defd6fb', name: 'CreaSleeve 453' },
  ],

  // 422904090-901369 (1 products)
  '422904090-901369': [
    { id: '68be85d2094d08828defd6fc', name: 'CreaSleeve 449' },
  ],

  // 422919196-901382 (1 products)
  '422919196-901382': [
    { id: '68be85d2094d08828defd6fd', name: 'CreaSleeve Kraft 475' },
  ],

  // 422819264-901305 (1 products)
  '422819264-901305': [
    { id: '68be85d2094d08828defd6fe', name: 'CreaBox PB-373' },
  ],

  // 422832046-901316 (1 products)
  '422832046-901316': [
    { id: '68be85d2094d08828defd6ff', name: 'CreaSleeve 468' },
  ],

  // 422898280-901364 (1 products)
  '422898280-901364': [
    { id: '68be85d2094d08828defd700', name: 'CreaSleeve Kraft 446' },
  ],

  // 422835532-901319 (1 products)
  '422835532-901319': [
    { id: '68be85d2094d08828defd701', name: 'CreaSleeve 469' },
  ],

  // 422915710-901379 (1 products)
  '422915710-901379': [
    { id: '68be85d2094d08828defd702', name: 'CreaSleeve 474' },
  ],

  // 422808806-901296 (1 products)
  '422808806-901296': [
    { id: '68be85d2094d08828defd703', name: 'CreaSleeve 461' },
  ],

  // 422871554-901347 (1 products)
  '422871554-901347': [
    { id: '68be85d2094d08828defd704', name: 'CreaSleeve Kraft 492' },
  ],

  // 422806482-901294 (1 products)
  '422806482-901294': [
    { id: '68be85d2094d08828defd705', name: 'CreaSleeve 460' },
  ],

  // 422988916-901442 (1 products)
  '422988916-901442': [
    { id: '68be85d2094d08828defd707', name: 'CreaSleeve 501' },
  ],

  // 422909900-901374 (1 products)
  '422909900-901374': [
    { id: '68be85d2094d08828defd708', name: 'CreaSleeve Kraft 471' },
  ],

  // 422799510-901290 (1 products)
  '422799510-901290': [
    { id: '68be85d2094d08828defd709', name: 'CreaSleeve 458' },
  ],

  // 422848314-901330 (1 products)
  '422848314-901330': [
    { id: '68be85d2094d08828defd70a', name: 'CreaSleeve 438' },
  ],

  // 422913386-901377 (1 products)
  '422913386-901377': [
    { id: '68be85d2094d08828defd70b', name: 'CreaSleeve 473' },
  ],

  // 422993564-901446 (1 products)
  '422993564-901446': [
    { id: '68be85d2094d08828defd70c', name: 'CreaSleeve 503' },
  ],

  // 422794862-901288 (1 products)
  '422794862-901288': [
    { id: '68be85d2094d08828defd70d', name: 'CreaSleeve 457' },
  ],

  // 422938950-901399 (1 products)
  '422938950-901399': [
    { id: '68be85d2094d08828defd70e', name: 'CreaSleeve 485' },
  ],

  // 422901766-901367 (1 products)
  '422901766-901367': [
    { id: '68be85d2094d08828defd70f', name: 'CreaSleeve 448' },
  ],

  // 423010994-909022 (1 products)
  '423010994-909022': [
    { id: '68be85d2094d08828defd710', name: 'CreaBox PB-413' },
  ],

  // 422987754-901441 (1 products)
  '422987754-901441': [
    { id: '68be85d2094d08828defd711', name: 'CreaSleeve Kraft 500' },
  ],

  // 423017966-909028 (1 products)
  '423017966-909028': [
    { id: '68be85d2094d08828defd712', name: 'CreaBox PB-419' },
  ],

  // 422942436-901402 (1 products)
  '422942436-901402': [
    { id: '68be85d2094d08828defd713', name: 'CreaSleeve Kraft 486' },
  ],

  // 448429744-957870 (1 products)
  '448429744-957870': [
    { id: '68be85d2094d08828defd714', name: 'Haneda bagagetagg' },
  ],

  // 472992100-1057573 (1 products)
  '472992100-1057573': [
    { id: '68be85d2094d08828defd71a', name: 'Blancos - Sneakers i PU stl 38' },
  ],

  // 473000234-1057580 (1 products)
  '473000234-1057580': [
    { id: '68be85d2094d08828defd71d', name: 'Blancos - Skor i PU stl 45' },
  ],

  // 451072132-963929 (1 products)
  '451072132-963929': [
    { id: '68be85d2094d08828defd776', name: '75096. Lanyard Cork Long Set. Standard modeller' },
  ],

  // 451015194-963742 (1 products)
  '451015194-963742': [
    { id: '68be85d2094d08828defd777', name: 'BOXIE CLEAR L. Trälåda' },
  ],

  // 422977296-901432 (1 products)
  '422977296-901432': [
    { id: '68be85d2094d08828defd7a3', name: 'CreaSleeve 495' },
  ],

  // 422768136-901273 (1 products)
  '422768136-901273': [
    { id: '68be85d2094d08828defd7a4', name: 'CreaBox PB-362' },
  ],

  // 423024938-909034 (1 products)
  '423024938-909034': [
    { id: '68be85d2094d08828defd7a6', name: 'CreaBox EF-350' },
  ],

  // 422821588-901307 (1 products)
  '422821588-901307': [
    { id: '68be85d2094d08828defd7a7', name: 'CreaBox PB-374' },
  ],

  // 422906414-901371 (1 products)
  '422906414-901371': [
    { id: '68be85d2094d08828defd7a8', name: 'CreaSleeve 470' },
  ],

  // 422787890-901284 (1 products)
  '422787890-901284': [
    { id: '68be85d2094d08828defd7a9', name: 'CreaSleeve 455' },
  ],

  // 423002860-901454 (1 products)
  '423002860-901454': [
    { id: '68be85d2094d08828defd7aa', name: 'CreaSleeve 507' },
  ],

  // 423014480-909025 (1 products)
  '423014480-909025': [
    { id: '68be85d2094d08828defd7ac', name: 'CreaBox PB-416' },
  ],

  // 422992402-901445 (1 products)
  '422992402-901445': [
    { id: '68be85d2094d08828defd7ad', name: 'CreaSleeve Kraft 502' },
  ],

  // 423029586-909038 (1 products)
  '423029586-909038': [
    { id: '68be85d2094d08828defd7ae', name: 'CreaBox EF-356' },
  ],

  // 423006346-901457 (1 products)
  '423006346-901457': [
    { id: '68be85d2094d08828defd7af', name: 'CreaSleeve Kraft 508' },
  ],

  // 423000536-901452 (1 products)
  '423000536-901452': [
    { id: '68be85d2094d08828defd7b0', name: 'CreaSleeve 506' },
  ],

  // 422864582-901341 (1 products)
  '422864582-901341': [
    { id: '68be85d2094d08828defd7b1', name: 'CreaSleeve Kraft 488' },
  ],

  // 423004022-901455 (1 products)
  '423004022-901455': [
    { id: '68be85d2094d08828defd7b2', name: 'CreaSleeve Kraft 507' },
  ],

  // 422905252-901370 (1 products)
  '422905252-901370': [
    { id: '68be85d2094d08828defd7b3', name: 'CreaSleeve Kraft 469' },
  ],

  // 422842504-901325 (1 products)
  '422842504-901325': [
    { id: '68be85d2094d08828defd7b4', name: 'CreaSleeve Kraft 435' },
  ],

  // 423019128-909029 (1 products)
  '423019128-909029': [
    { id: '68be85d2094d08828defd7b5', name: 'CreaBox PB-420' },
  ],

  // 423031910-909040 (1 products)
  '423031910-909040': [
    { id: '68be85d3094d08828defd7b6', name: 'CreaBox EF-358' },
  ],

  // 422966838-901423 (1 products)
  '422966838-901423': [
    { id: '68be85d3094d08828defd7b8', name: 'CreaBox PB-395' },
  ],

  // 422956380-901414 (1 products)
  '422956380-901414': [
    { id: '68be85d3094d08828defd7b9', name: 'CreaBox PB-386' },
  ],

  // 448377454-957755 (1 products)
  '448377454-957755': [
    { id: '68be85d3094d08828defd7bb', name: 'Maderia kapsylöppnare' },
  ],

  // 422790214-957658 (1 products)
  '422790214-957658': [
    { id: '68be85d3094d08828defd7bc', name: 'CreaBox EF-361' },
  ],

  // 422955218-901413 (1 products)
  '422955218-901413': [
    { id: '68be85d3094d08828defd7bd', name: 'CreaBox PB-385' },
  ],

  // 423042368-909042 (1 products)
  '423042368-909042': [
    { id: '68be85d3094d08828defd7be', name: 'CreaSleeve 510' },
  ],

  // 422782080-901281 (1 products)
  '422782080-901281': [
    { id: '68be85d3094d08828defd7bf', name: 'CreaSleeve Kraft 453' },
  ],

  // 422839018-901322 (1 products)
  '422839018-901322': [
    { id: '68be85d3094d08828defd7c1', name: 'CreaSleeve 434' },
  ],

  // 422933140-901394 (1 products)
  '422933140-901394': [
    { id: '68be85d3094d08828defd7c2', name: 'CreaSleeve Kraft 482' },
  ],

  // 422772784-901276 (1 products)
  '422772784-901276': [
    { id: '68be85d3094d08828defd7c3', name: 'CreaSleeve 451' },
  ],

  // 422854124-909019 (1 products)
  '422854124-909019': [
    { id: '68be85d3094d08828defd7c4', name: 'CreaBox EF-404' },
  ],

  // 181617114-879083 (1 products)
  '181617114-879083': [
    { id: '68be85d3094d08828defd7fa', name: 'Logoband Vävt Monolayer' },
  ],

  // 472993262-1057574 (1 products)
  '472993262-1057574': [
    { id: '68be85d3094d08828defd822', name: 'Blancos - Sneakers i PU stl 39' },
  ],

  // 472996748-1057577 (1 products)
  '472996748-1057577': [
    { id: '68be85d3094d08828defd828', name: 'Blancos - Skor i PU stl 42' },
  ],

  // 486679298-1133587 (1 products)
  '486679298-1133587': [
    { id: '68be85d3094d08828defd878', name: 'Top Summer Socks' },
  ],

  // 422923844-901386 (1 products)
  '422923844-901386': [
    { id: '68be85d3094d08828defd87c', name: 'CreaSleeve Kraft 477' },
  ],

  // 423043530-909043 (1 products)
  '423043530-909043': [
    { id: '68be85d3094d08828defd87e', name: 'CreaSleeve Kraft 510' },
  ],

  // 422769298-901274 (1 products)
  '422769298-901274': [
    { id: '68be85d3094d08828defd87f', name: 'CreaSleeve 450' },
  ],

  // 422908738-901373 (1 products)
  '422908738-901373': [
    { id: '68be85d3094d08828defd882', name: 'CreaSleeve 471' },
  ],

  // 422775108-957653 (1 products)
  '422775108-957653': [
    { id: '68be85d3094d08828defd883', name: 'CreaBox PB-364' },
  ],

  // 422997050-901449 (1 products)
  '422997050-901449': [
    { id: '68be85d3094d08828defd884', name: 'CreaSleeve Kraft 504' },
  ],

  // 422979620-901434 (1 products)
  '422979620-901434': [
    { id: '68be85d3094d08828defd885', name: 'CreaSleeve 496' },
  ],

  // 423023776-909033 (1 products)
  '423023776-909033': [
    { id: '68be85d3094d08828defd887', name: 'CreaBox EF-349' },
  ],

  // 422883174-901357 (1 products)
  '422883174-901357': [
    { id: '68be85d3094d08828defd889', name: 'CreaSleeve 443' },
  ],

  // 422825074-901310 (1 products)
  '422825074-901310': [
    { id: '68be85d3094d08828defd88a', name: 'CreaSleeve 466' },
  ],

  // 422922682-901385 (1 products)
  '422922682-901385': [
    { id: '68be85d3094d08828defd88c', name: 'CreaSleeve 477' },
  ],

  // 422815778-901302 (1 products)
  '422815778-901302': [
    { id: '68be85d3094d08828defd88d', name: 'CreaBox PB-372' },
  ],

  // 423027262-909036 (1 products)
  '423027262-909036': [
    { id: '68be85d3094d08828defd88e', name: 'CreaBox EF-352' },
  ],

  // 422999374-901451 (1 products)
  '422999374-901451': [
    { id: '68be85d3094d08828defd88f', name: 'CreaSleeve Kraft 505' },
  ],

  // 422792538-957659 (1 products)
  '422792538-957659': [
    { id: '68be85d3094d08828defd890', name: 'CreaBox EF-362' },
  ],

  // 422907576-901372 (1 products)
  '422907576-901372': [
    { id: '68be85d3094d08828defd892', name: 'CreaSleeve Kraft 470' },
  ],

  // 422980782-901435 (1 products)
  '422980782-901435': [
    { id: '68be85d3094d08828defd893', name: 'CreaSleeve Kraft 496' },
  ],

  // 422791376-901286 (1 products)
  '422791376-901286': [
    { id: '68be85d3094d08828defd895', name: 'CreaSleeve 456' },
  ],

  // 422869230-901345 (1 products)
  '422869230-901345': [
    { id: '68be85d3094d08828defd896', name: 'CreaSleeve Kraft 491' },
  ],

  // 422840180-901323 (1 products)
  '422840180-901323': [
    { id: '68be85d3094d08828defd897', name: 'CreaSleeve Kraft 434' },
  ],

  // 138863648-716644 (1 products)
  '138863648-716644': [
    { id: '68be85d3094d08828defd8c0', name: 'Nyckelband Glad Påsk' },
  ],

  // 194537392-636550 (1 products)
  '194537392-636550': [
    { id: '68be85d3094d08828defd8ce', name: 'THC BERLIN WH. Kortärmad pikétröja för män. vit färg' },
  ],

  // 376058060-791867 (1 products)
  '376058060-791867': [
    { id: '68be85d3094d08828defd8d4', name: 'BALLINA. Loggoband i 100% bomull med karbinhake i metall' },
  ],

  // 194493236-636401 (1 products)
  '194493236-636401': [
    { id: '68be85d3094d08828defd8d8', name: 'THC ROME WH. Tvåfärgad bomullspikétröja för män. vit färg' },
  ],

  // 194576900-636614 (1 products)
  '194576900-636614': [
    { id: '68be85d3094d08828defd8dd', name: 'THC DHAKA WH. Herr pikétröja' },
  ],

  // 194486264-636357 (1 products)
  '194486264-636357': [
    { id: '68be85d3094d08828defd8e2', name: 'THC ADAM WH. Kortärmad bomullspikétröja för män. vit färg' },
  ],

  // 194551336-636585 (1 products)
  '194551336-636585': [
    { id: '68be85d3094d08828defd8e3', name: 'THC MONACO WH. Kortärmad herrpikétröja i kardad bomull' },
  ],

  // 194497884-636417 (1 products)
  '194497884-636417': [
    { id: '68be85d3094d08828defd8e4', name: 'THC BERN WH. Långärmad bomullspikétröja för män' },
  ],

  // 310159878-653635 (1 products)
  '310159878-653635': [
    { id: '68be85d3094d08828defd8e5', name: 'THC BERN WH 3XL. Herr långärmad pikétröja' },
  ],

  // 310157554-653609 (1 products)
  '310157554-653609': [
    { id: '68be85d3094d08828defd8e7', name: 'THC ADAM 3XL WH. Herr pikétröja' },
  ],

  // 422793700-901287 (1 products)
  '422793700-901287': [
    { id: '68be85d3094d08828defd8e9', name: 'CreaSleeve Kraft 456' },
  ],

  // 422983106-901437 (1 products)
  '422983106-901437': [
    { id: '68be85d3094d08828defd8ea', name: 'CreaSleeve Kraft 497' },
  ],

  // 422918034-901381 (1 products)
  '422918034-901381': [
    { id: '68be85d3094d08828defd8ec', name: 'CreaSleeve 475' },
  ],

  // 422902928-901368 (1 products)
  '422902928-901368': [
    { id: '68be85d3094d08828defd8ed', name: 'CreaSleeve Kraft 448' },
  ],

  // 422936626-901397 (1 products)
  '422936626-901397': [
    { id: '68be85d3094d08828defd8ef', name: 'CreaSleeve 484' },
  ],

  // 422823912-901309 (1 products)
  '422823912-901309': [
    { id: '68be85d3094d08828defd8f1', name: 'CreaBox PB-375' },
  ],

  // 422797186-901289 (1 products)
  '422797186-901289': [
    { id: '68be85d3094d08828defd8f2', name: 'CreaSleeve Kraft 457' },
  ],

  // 422943598-901403 (1 products)
  '422943598-901403': [
    { id: '68be85d3094d08828defd8f3', name: 'CreaSleeve 487' },
  ],

  // 422878526-901353 (1 products)
  '422878526-901353': [
    { id: '68be85d3094d08828defd8f4', name: 'CreaSleeve 441' },
  ],

  // 422785566-901283 (1 products)
  '422785566-901283': [
    { id: '68be85d3094d08828defd8f5', name: 'CreaSleeve Kraft 454' },
  ],

  // 422973810-901429 (1 products)
  '422973810-901429': [
    { id: '68be85d3094d08828defd8f6', name: 'CreaBox EF-401' },
  ],

  // 422811130-901298 (1 products)
  '422811130-901298': [
    { id: '68be85d3094d08828defd8f7', name: 'CreaSleeve 462' },
  ],

  // 422828560-901313 (1 products)
  '422828560-901313': [
    { id: '68be85d3094d08828defd8f8', name: 'CreaSleeve 467' },
  ],

  // 422926168-901388 (1 products)
  '422926168-901388': [
    { id: '68be85d3094d08828defd8f9', name: 'CreaSleeve Kraft 479' },
  ],

  // 423020290-909030 (1 products)
  '423020290-909030': [
    { id: '68be85d3094d08828defd8fa', name: 'CreaBox PB-421' },
  ],

  // 422877364-901352 (1 products)
  '422877364-901352': [
    { id: '68be85d3094d08828defd8fb', name: 'CreaSleeve Kraft 440' },
  ],

  // 423016804-909027 (1 products)
  '423016804-909027': [
    { id: '68be85d3094d08828defd8fc', name: 'CreaBox PB-418' },
  ],

  // 423021452-909031 (1 products)
  '423021452-909031': [
    { id: '68be85d3094d08828defd8fd', name: 'CreaBox EF-347' },
  ],

  // 422866906-901343 (1 products)
  '422866906-901343': [
    { id: '68be85d3094d08828defd8fe', name: 'CreaSleeve Kraft 490' },
  ],

  // 422880850-901355 (1 products)
  '422880850-901355': [
    { id: '68be85d3094d08828defd8ff', name: 'CreaSleeve 442' },
  ],

  // 422868068-901344 (1 products)
  '422868068-901344': [
    { id: '68be85d3094d08828defd900', name: 'CreaSleeve 491' },
  ],

  // 422969162-901425 (1 products)
  '422969162-901425': [
    { id: '68be85d3094d08828defd901', name: 'CreaBox EF-397' },
  ],

  // 422834370-901318 (1 products)
  '422834370-901318': [
    { id: '68be85d3094d08828defd903', name: 'Crea Sleeve Kraftpapper 432' },
  ],

  // 422863420-901340 (1 products)
  '422863420-901340': [
    { id: '68be85d3094d08828defd904', name: 'CreaSleeve 488' },
  ],

  // 422783242-901282 (1 products)
  '422783242-901282': [
    { id: '68be85d3094d08828defd905', name: 'CreaSleeve 454' },
  ],

  // 422862258-901339 (1 products)
  '422862258-901339': [
    { id: '68be85d3094d08828defd906', name: 'CreaBox PB-411' },
  ],

  // 137543616-947293 (1 products)
  '137543616-947293': [
    { id: '68be85d3094d08828defd91a', name: 'Antistress Tärning med tryck' },
  ],

  // 138856676-716638 (1 products)
  '138856676-716638': [
    { id: '68be85d3094d08828defd920', name: 'Logoband Spöke' },
  ],

  // 138861324-716642 (1 products)
  '138861324-716642': [
    { id: '68be85d3094d08828defd925', name: 'Logoband Kräftskiva' },
  ],

  // 310155230-653595 (1 products)
  '310155230-653595': [
    { id: '68be85d3094d08828defd940', name: 'THC ANKARA 3XL WH. Herr t-shirt' },
  ],

  // 194479292-636330 (1 products)
  '194479292-636330': [
    { id: '68be85d3094d08828defd94f', name: 'THC BUCHAREST WH. Långärmad T-shirt i bomull för män' },
  ],

  // 194463024-636279 (1 products)
  '194463024-636279': [
    { id: '68be85d3094d08828defd953', name: 'THC ANKARA WH. Herr t-shirt' },
  ],

  // 194469996-636302 (1 products)
  '194469996-636302': [
    { id: '68be85d3094d08828defd959', name: 'THC ATHENS WH. Herr t-shirt' },
  ],

  // 194490912-636383 (1 products)
  '194490912-636383': [
    { id: '68be85d3094d08828defd95a', name: 'THC EVE WH. Kortärmad pikétröja för dam i kardad bomull' },
  ],

  // 310150582-653548 (1 products)
  '310150582-653548': [
    { id: '68be85d3094d08828defd95c', name: 'THC LUANDA WH 3XL. Herr t-shirt' },
  ],

  // 194495560-636410 (1 products)
  '194495560-636410': [
    { id: '68be85d3094d08828defd961', name: 'THC ROME WOMEN WH. Tvåfärgad bomullspikétröja för kvinnor' },
  ],

  // 422940112-901400 (1 products)
  '422940112-901400': [
    { id: '68be85d3094d08828defd976', name: 'CreaSleeve Kraft 485' },
  ],

  // 422875040-901350 (1 products)
  '422875040-901350': [
    { id: '68be85d3094d08828defd977', name: 'CreaSleeve Kraft 439' },
  ],

  // 422763488-901269 (1 products)
  '422763488-901269': [
    { id: '68be85d3094d08828defd978', name: 'CreaBox PB-359' },
  ],

  // 423013318-909024 (1 products)
  '423013318-909024': [
    { id: '68be85d3094d08828defd979', name: 'CreaBox PB-415' },
  ],

  // 423033072-909041 (1 products)
  '423033072-909041': [
    { id: '68be85d3094d08828defd97a', name: 'CreaBox EF-359' },
  ],

  // 422964514-901421 (1 products)
  '422964514-901421': [
    { id: '68be85d3094d08828defd97b', name: 'CreaBox EF-393' },
  ],

  // 422994726-901447 (1 products)
  '422994726-901447': [
    { id: '68be85d3094d08828defd97c', name: 'CreaSleeve Kraft 503' },
  ],

  // 422945922-901405 (1 products)
  '422945922-901405': [
    { id: '68be85d3094d08828defd97d', name: 'CreaBox PB-377' },
  ],

  // 422829722-901314 (1 products)
  '422829722-901314': [
    { id: '68be85d3094d08828defd97e', name: 'CreaSleeve Kraft 467' },
  ],

  // 422809968-901297 (1 products)
  '422809968-901297': [
    { id: '68be85d3094d08828defd97f', name: 'CreaSleeve Kraft 461' },
  ],

  // 422816940-901303 (1 products)
  '422816940-901303': [
    { id: '68be85d3094d08828defd980', name: 'CreaSleeve 464' },
  ],

  // 422885498-901359 (1 products)
  '422885498-901359': [
    { id: '68be85d3094d08828defd981', name: 'CreaSleeve 444' },
  ],

  // 422971486-901427 (1 products)
  '422971486-901427': [
    { id: '68be85d3094d08828defd982', name: 'CreaBox EF-399' },
  ],

  // 422833208-901317 (1 products)
  '422833208-901317': [
    { id: '68be85d3094d08828defd983', name: 'CreaSleeve Kraft 468' },
  ],

  // 422995888-901448 (1 products)
  '422995888-901448': [
    { id: '68be85d3094d08828defd985', name: 'CreaSleeve 504' },
  ],

  // 422954056-901412 (1 products)
  '422954056-901412': [
    { id: '68be85d3094d08828defd986', name: 'CreaBox EF-384' },
  ],

  // 422947084-901406 (1 products)
  '422947084-901406': [
    { id: '68be85d3094d08828defd989', name: 'CreaBox PB-378' },
  ],

  // 422805320-901293 (1 products)
  '422805320-901293': [
    { id: '68be85d3094d08828defd98a', name: 'CreaSleeve Kraft 459' },
  ],

  // 423041206-957676 (1 products)
  '423041206-957676': [
    { id: '68be85d3094d08828defd98b', name: 'CreaBox EF-410' },
  ],

  // 422841342-901324 (1 products)
  '422841342-901324': [
    { id: '68be85d3094d08828defd98c', name: 'CreaSleeve 435' },
  ],

  // 422899442-901365 (1 products)
  '422899442-901365': [
    { id: '68be85d3094d08828defd98e', name: 'CreaSleeve 447' },
  ],

  // 442724324-944094 (1 products)
  '442724324-944094': [
    { id: '68be85d3094d08828defd9a6', name: 'Kara - Logoband i bomull' },
  ],

  // 194476968-636323 (1 products)
  '194476968-636323': [
    { id: '68be85d3094d08828defda00', name: 'THC IBIZA WH. T-shirt i bomull med delad ärm för män' },
  ],

  // 422961028-901418 (1 products)
  '422961028-901418': [
    { id: '68be85d3094d08828defda1c', name: 'CreaBox PB-390' },
  ],

  // 422765812-901271 (1 products)
  '422765812-901271': [
    { id: '68be85d3094d08828defda1d', name: 'CreaBox PB-361' },
  ],

  // 422941274-901401 (1 products)
  '422941274-901401': [
    { id: '68be85d3094d08828defda1e', name: 'CreaSleeve 486' },
  ],

  // 422959866-901417 (1 products)
  '422959866-901417': [
    { id: '68be85d3094d08828defda20', name: 'CreaBox PB-389' },
  ],

  // 422859934-901337 (1 products)
  '422859934-901337': [
    { id: '68be85d3094d08828defda21', name: 'CreaBox PB-409' },
  ],

  // 422950570-901409 (1 products)
  '422950570-901409': [
    { id: '68be85d3094d08828defda23', name: 'CreaBox PB-381' },
  ],

  // 422951732-901410 (1 products)
  '422951732-901410': [
    { id: '68be85d3094d08828defda24', name: 'CreaBox PB-382' },
  ],

  // 422778594-901279 (1 products)
  '422778594-901279': [
    { id: '68be85d3094d08828defda25', name: 'CreaSleeve Kraft 452' },
  ],

  // 422822750-901308 (1 products)
  '422822750-901308': [
    { id: '68be85d3094d08828defda26', name: 'CreaSleeve Kraft 465' },
  ],

  // 422789052-901285 (1 products)
  '422789052-901285': [
    { id: '68be85d3094d08828defda27', name: 'CreaSleeve Kraft 455' },
  ],

  // 422770460-901275 (1 products)
  '422770460-901275': [
    { id: '68be85d3094d08828defda28', name: 'CreaSleeve Kraft 450' },
  ],

  // 422812292-901299 (1 products)
  '422812292-901299': [
    { id: '68be85d3094d08828defda29', name: 'CreaSleeve Kraft 462' },
  ],

  // 422972648-901428 (1 products)
  '422972648-901428': [
    { id: '68be85d3094d08828defda2a', name: 'CreaBox EF-400' },
  ],

  // 422813454-901300 (1 products)
  '422813454-901300': [
    { id: '68be85d3094d08828defda2b', name: 'CreaSleeve 463' },
  ],

  // 422949408-901408 (1 products)
  '422949408-901408': [
    { id: '68be85d3094d08828defda2d', name: 'CreaBox PB-380' },
  ],

  // 423012156-909023 (1 products)
  '423012156-909023': [
    { id: '68be85d3094d08828defda2f', name: 'CreaBox PB-414' },
  ],

  // 422851800-901333 (1 products)
  '422851800-901333': [
    { id: '68be85d3094d08828defda30', name: 'CreaBox EF-402' },
  ],

  // 422762326-901268 (1 products)
  '422762326-901268': [
    { id: '68be85d3094d08828defda31', name: 'CreaBox PB-358' },
  ],

  // 422758840-901265 (1 products)
  '422758840-901265': [
    { id: '68be85d3094d08828defda33', name: 'CreaBox PB-355' },
  ],

  // 422814616-901301 (1 products)
  '422814616-901301': [
    { id: '68be85d3094d08828defda35', name: 'CreaSleeve Kraft 463' },
  ],

  // 422766974-901272 (1 products)
  '422766974-901272': [
    { id: '68be85d3094d08828defda36', name: 'CreaSleeve Kraft 449' },
  ],

  // 422925006-901387 (1 products)
  '422925006-901387': [
    { id: '68be85d3094d08828defda37', name: 'CreaSleeve 479' },
  ],

  // 414011304-883044 (1 products)
  '414011304-883044': [
    { id: '68be85d3094d08828defdac3', name: 'Amber Large - Stor påse i ekologisk bomull' },
  ],

  // 414010142-883043 (1 products)
  '414010142-883043': [
    { id: '68be85d3094d08828defdac6', name: 'Amber Medium - Medium påse i ekologisk bomull' },
  ],

  // 138497618-949668 (1 products)
  '138497618-949668': [
    { id: '68be85d3094d08828defdade', name: 'Antistressfigur Hus med tryck' },
  ],

  // 181619438-879085 (1 products)
  '181619438-879085': [
    { id: '68be85d3094d08828defdaed', name: 'Logoband med tryckt satinband' },
  ],

  // 194502532-636428 (1 products)
  '194502532-636428': [
    { id: '68be85d3094d08828defdb11', name: 'THC BERN WOMEN WH. Långärmad pikétröja för kvinnor i kardad bomull' },
  ],

  // 422957542-901415 (1 products)
  '422957542-901415': [
    { id: '68be85d3094d08828defdb24', name: 'CreaBox PB-387' },
  ],

  // 422886660-901360 (1 products)
  '422886660-901360': [
    { id: '68be85d3094d08828defdb28', name: 'CreaSleeve Kraft 444' },
  ],

  // 422958704-901416 (1 products)
  '422958704-901416': [
    { id: '68be85d3094d08828defdb29', name: 'CreaBox PB-388' },
  ],

  // 422858772-901336 (1 products)
  '422858772-901336': [
    { id: '68be85d3094d08828defdb2b', name: 'CreaBox EF-408' },
  ],

  // 422952894-901411 (1 products)
  '422952894-901411': [
    { id: '68be85d3094d08828defdb2c', name: 'CreaBox PB-383' },
  ],

  // 423030748-909039 (1 products)
  '423030748-909039': [
    { id: '68be85d3094d08828defdb2f', name: 'CreaBox EF-357' },
  ],

  // 422761164-901267 (1 products)
  '422761164-901267': [
    { id: '68be85d3094d08828defdb30', name: 'CreaBox PB-357' },
  ],

  // 422773946-901277 (1 products)
  '422773946-901277': [
    { id: '68be85d3094d08828defdb31', name: 'CreaSleeve Kraft 451' },
  ],

  // 422965676-901422 (1 products)
  '422965676-901422': [
    { id: '68be85d3094d08828defdb33', name: 'CreaBox PB-394' },
  ],

  // 423007508-901458 (1 products)
  '423007508-901458': [
    { id: '68be85d3094d08828defdb36', name: 'CreaSleeve 509' },
  ],

  // 422861096-901338 (1 products)
  '422861096-901338': [
    { id: '68be85d3094d08828defdb37', name: 'CreaBox PB-410' },
  ],

  // 422818102-901304 (1 products)
  '422818102-901304': [
    { id: '68be85d3094d08828defdb38', name: 'CreaSleeve Kraft 464' },
  ],

  // 448376292-957754 (1 products)
  '448376292-957754': [
    { id: '68be85d3094d08828defdb39', name: 'Algarve kapsylöppnare' },
  ],

  // 415899554-885810 (1 products)
  '415899554-885810': [
    { id: '68be85d3094d08828defdb3b', name: 'Meaboo flasköppnare måttband' },
  ],

  // 422970324-901426 (1 products)
  '422970324-901426': [
    { id: '68be85d3094d08828defdb3d', name: 'CreaBox EF-398' },
  ],

  // 423022614-909032 (1 products)
  '423022614-909032': [
    { id: '68be85d3094d08828defdb3f', name: 'CreaBox EF-348' },
  ],

  // 413942746-882952 (1 products)
  '413942746-882952': [
    { id: '68be85d3094d08828defdb6d', name: 'Canichie L - Toffelstrumpor L' },
  ],

  // 422948246-901407 (1 products)
  '422948246-901407': [
    { id: '68be85d3094d08828defdb8e', name: 'CreaBox PB-379' },
  ],

  // 422865744-901342 (1 products)
  '422865744-901342': [
    { id: '68be85d3094d08828defdb8f', name: 'CreaSleeve 490' },
  ],

  // 422876202-901351 (1 products)
  '422876202-901351': [
    { id: '68be85d3094d08828defdb91', name: 'CreaSleeve 440' },
  ],

  // 422807644-901295 (1 products)
  '422807644-901295': [
    { id: '68be85d3094d08828defdb92', name: 'CreaSleeve Kraft 460' },
  ],

  // 423028424-909037 (1 products)
  '423028424-909037': [
    { id: '68be85d3094d08828defdb93', name: 'CreaBox EF-355' },
  ],

  // 422991240-901444 (1 products)
  '422991240-901444': [
    { id: '68be85d3094d08828defdb98', name: 'CreaSleeve 502' },
  ],

  // 422968000-901424 (1 products)
  '422968000-901424': [
    { id: '68be85d3094d08828defdb9a', name: 'CreaBox EF-396' },
  ],

  // 422852962-909018 (1 products)
  '422852962-909018': [
    { id: '68be85d4094d08828defdba5', name: 'CreaBox EF-403' },
  ],

  // 376059222-791868 (1 products)
  '376059222-791868': [
    { id: '68be85d4094d08828defdbbf', name: 'HEATHROW. Loggoband i 100% bomull' },
  ],

  // 138353530-948244 (1 products)
  '138353530-948244': [
    { id: '68be85d4094d08828defdc0c', name: 'Anti-stressfigur Läkare med logo' },
  ],

  // 422801834-901291 (1 products)
  '422801834-901291': [
    { id: '68be85d4094d08828defdc3a', name: 'CreaSleeve Kraft 458' },
  ],

  // 422962190-901419 (1 products)
  '422962190-901419': [
    { id: '68be85d4094d08828defdc3b', name: 'CreaBox EF-391' },
  ],

  // 423026100-909035 (1 products)
  '423026100-909035': [
    { id: '68be85d4094d08828defdc41', name: 'CreaBox EF-351' },
  ],

  // 422826236-901311 (1 products)
  '422826236-901311': [
    { id: '68be85d4094d08828defdc44', name: 'CreaSleeve Kraft 466' },
  ],

  // 422760002-901266 (1 products)
  '422760002-901266': [
    { id: '68be85d4094d08828defdc46', name: 'CreaBox PB-356' },
  ],

  // 138343072-948240 (1 products)
  '138343072-948240': [
    { id: '68be85d4094d08828defdce9', name: 'Nyckelring med anti-stress figur Earl' },
  ],

  // 422856448-901334 (1 products)
  '422856448-901334': [
    { id: '68be85d4094d08828defdd1a', name: 'CreaBox EF-406' },
  ],

  // 416006458-885971 (1 products)
  '416006458-885971': [
    { id: '68be85d4094d08828defdd1e', name: 'CreaBox Pillow Carry S kuddbox' },
  ],

  // 416007620-885972 (1 products)
  '416007620-885972': [
    { id: '68be85d4094d08828defdd21', name: 'CreaBox Pillow Carry M kuddbox' },
  ],

  // 533443988-1510221 (1 products)
  '533443988-1510221': [
    { id: '68be85d4094d08828defdd66', name: 'Janni - Julstrumpor' },
  ],

  // 532141386-1506022 (1 products)
  '532141386-1506022': [
    { id: '68be85d4094d08828defdd6b', name: 'Gruvan - Bagagebricka' },
  ],

  // 376861002-793643 (1 products)
  '376861002-793643': [
    { id: '68be85d4094d08828defdd9c', name: 'Roonito kapsylöppnare' },
  ],

  // 195683124-639803 (1 products)
  '195683124-639803': [
    { id: '68be85d4094d08828defddc2', name: 'SOLDEU. Isskrapa med skyddshandske' },
  ],

  // 333756612-710939 (1 products)
  '333756612-710939': [
    { id: '68be85d4094d08828defdde0', name: 'Scratchy - Isskrapa i bambu' },
  ],

  // 195163710-638482 (1 products)
  '195163710-638482': [
    { id: '68be85d4094d08828defde39', name: 'WHITMAN. Vertikal märkeshållare i PVC' },
  ],

  // 448918946-958684 (1 products)
  '448918946-958684': [
    { id: '68be85d4094d08828defde93', name: 'Vide- Nyckelband' },
  ],

  // strumpor (1 products)
  'strumpor': [
    { id: '68be85d4094d08828defdeac', name: 'Caro - Herrstrumpa Ferraghini' },
  ],

  // 137544778-947295 (1 products)
  '137544778-947295': [
    { id: '68be85d4094d08828defdf03', name: 'Antistress Tärning med logo' },
  ],

  // 138836922-878584 (1 products)
  '138836922-878584': [
    { id: '68be85d4094d08828defdf11', name: 'Logoband Rundvävt' },
  ],

  // 316670564-675815 (1 products)
  '316670564-675815': [
    { id: '68be85d4094d08828defdf63', name: 'SuboProduce Mesh Produktpåse' },
  ],

  // 448921270-958693 (1 products)
  '448921270-958693': [
    { id: '68be85d4094d08828defdf6c', name: 'Nisa - Nyckelband' },
  ],

  // 181618276-879084 (1 products)
  '181618276-879084': [
    { id: '68be85d4094d08828defdfa4', name: 'Logoband med vävd etikett' },
  ],

  // 485492896-1128950 (1 products)
  '485492896-1128950': [
    { id: '68be85d4094d08828defe068', name: 'MASCOT® FOOTWEAR ORIGINALS' },
  ],

  // 485491734-1128949 (1 products)
  '485491734-1128949': [
    { id: '68be85d4094d08828defe06b', name: 'MASCOT® FOOTWEAR ORIGINALS' },
  ],

  // 568616566-1660956 (1 products)
  '568616566-1660956': [
    { id: '68be85d4094d08828defe0f1', name: 'Tie bagagebricka' },
  ],

  // 138857838-716639 (1 products)
  '138857838-716639': [
    { id: '68be85d4094d08828defe110', name: 'Nyckelband Läder' },
  ],

  // 138835760-879082 (1 products)
  '138835760-879082': [
    { id: '68be85d4094d08828defe111', name: 'Kort Logoband med tryck' },
  ],

  // kameralinser (1 products)
  'kameralinser': [
    { id: '68be85d4094d08828defe118', name: 'Kamerablixt för smartphone' },
  ],

  // 379640506-802109 (1 products)
  '379640506-802109': [
    { id: '68be85d4094d08828defe137', name: 'Rami - Flasköppnare' },
  ],

  // 562124472-1632297 (1 products)
  '562124472-1632297': [
    { id: '68be85d4094d08828defe143', name: 'Track Walk Long Distance Shoe' },
  ],

  // 562119824-1632293 (1 products)
  '562119824-1632293': [
    { id: '68be85d4094d08828defe145', name: 'Easy Walk Weekend Shoe' },
  ],

  // 562120986-1632294 (1 products)
  '562120986-1632294': [
    { id: '68be85d4094d08828defe146', name: 'Easy Walk Weekend Shoe' },
  ],

  // 562125634-1632298 (1 products)
  '562125634-1632298': [
    { id: '68be85d4094d08828defe147', name: 'Track Walk Long Distance Shoe' },
  ],

  // 562122148-1632295 (1 products)
  '562122148-1632295': [
    { id: '68be85d4094d08828defe148', name: 'Easy Walk Weekend Shoe' },
  ],

  // 562123310-1632296 (1 products)
  '562123310-1632296': [
    { id: '68be85d4094d08828defe14a', name: 'Track Walk Long Distance Shoe' },
  ],

  // 375743158-790091 (1 products)
  '375743158-790091': [
    { id: '68be85d4094d08828defe151', name: 'Glovii uppvärmd universell väst. Svart' },
  ],

  // 375729214-790079 (1 products)
  '375729214-790079': [
    { id: '68be85d4094d08828defe154', name: 'Glovii uppvärmda strumpor med fjärrkontroll L. Svart' },
  ],

  // 514051370-1348361 (1 products)
  '514051370-1348361': [
    { id: '68be85d4094d08828defe158', name: 'Glovii uppvärmd nackvärmare. Svart' },
  ],

  // 514050208-1348360 (1 products)
  '514050208-1348360': [
    { id: '68be85d4094d08828defe15a', name: 'Glovii Power Bank 2500mAh för strumpor och tofflor' },
  ],

  // 513911930-1348240 (1 products)
  '513911930-1348240': [
    { id: '68be85d4094d08828defe15c', name: 'Glovii uppvärmda strumpor med fjärrkontroll M. Röd' },
  ],

  // 375751292-790098 (1 products)
  '375751292-790098': [
    { id: '68be85d4094d08828defe15f', name: 'Glovii Power Bank för uppvärmda strumpor' },
  ],

  // 472995586-1057576 (1 products)
  '472995586-1057576': [
    { id: '68be85d5094d08828defe18c', name: 'Blancos - Sneakers i PU stl 41' },
  ],

  // 472999072-1057579 (1 products)
  '472999072-1057579': [
    { id: '68be85d5094d08828defe197', name: 'Blancos - Skor i PU stl 44' },
  ],

  // 423050502-909049 (1 products)
  '423050502-909049': [
    { id: '68be85d5094d08828defe21d', name: 'CreaSleeve Kraft 513' },
  ],

  // 422895956-957668 (1 products)
  '422895956-957668': [
    { id: '68be85d5094d08828defe21e', name: 'CreaSleeve 520' },
  ],

  // 422974972-901430 (1 products)
  '422974972-901430': [
    { id: '68be85d5094d08828defe21f', name: 'CreaSleeve 494' },
  ],

  // 422920358-901383 (1 products)
  '422920358-901383': [
    { id: '68be85d5094d08828defe22f', name: 'CreaSleeve 476' },
  ],

  // 422830884-901315 (1 products)
  '422830884-901315': [
    { id: '68be85d5094d08828defe230', name: 'Crea Sleeve 432' },
  ],

  // 422998212-901450 (1 products)
  '422998212-901450': [
    { id: '68be85d5094d08828defe231', name: 'CreaSleeve 505' },
  ],

  // 422879688-901354 (1 products)
  '422879688-901354': [
    { id: '68be85d5094d08828defe232', name: 'CreaSleeve Kraft 441' },
  ],

  // 422872716-901348 (1 products)
  '422872716-901348': [
    { id: '68be85d5094d08828defe233', name: 'CreaSleeve 493' },
  ],

  // 423009832-909021 (1 products)
  '423009832-909021': [
    { id: '68be85d5094d08828defe234', name: 'CreaBox PB-412' },
  ],

  // 422800672-957662 (1 products)
  '422800672-957662': [
    { id: '68be85d5094d08828defe235', name: 'CreaBox PB-370' },
  ],

  // usb-pennor (1 products)
  'usb-pennor': [
    { id: '68be85d5094d08828defe27c', name: 'Usbnote - A5-anteckningsbok med USB' },
  ],

  // 422963352-901420 (1 products)
  '422963352-901420': [
    { id: '68be85d5094d08828defe293', name: 'CreaBox EF-392' },
  ],

  // 582871982-1754099 (1 products)
  '582871982-1754099': [
    { id: '68be85d5094d08828defe2ba', name: 'Opinel Presentförpackning Large' },
  ],

  // 582870820-1754098 (1 products)
  '582870820-1754098': [
    { id: '68be85d5094d08828defe2bb', name: 'Opinel Presentförpackning Small' },
  ],

  // 378310016-798832 (1 products)
  '378310016-798832': [
    { id: '68be85d5094d08828defe2bc', name: 'Presentask/fraktlåda' },
  ],

  // 535171882-1517800 (1 products)
  '535171882-1517800': [
    { id: '68be85d5094d08828defe2bd', name: 'Gift Pouch Naturel GRS Recycled Cotton (150 g/m²) L' },
  ],

  // 467404042-1018400 (1 products)
  '467404042-1018400': [
    { id: '68be85d5094d08828defe2ce', name: 'Presentkartong Mönstrad 34x32x9' },
  ],

  // 467402880-1018399 (1 products)
  '467402880-1018399': [
    { id: '68be85d5094d08828defe2cf', name: 'Presentkartong Mönstrad 49x33x11' },
  ],

  // 467401718-1018398 (1 products)
  '467401718-1018398': [
    { id: '68be85d5094d08828defe2d0', name: 'Presentkartong' },
  ],

  // 446556600-955149 (1 products)
  '446556600-955149': [
    { id: '68be85d5094d08828defe2d1', name: 'Box väska 32x16x24cm' },
  ],

  // 474728128-1069643 (1 products)
  '474728128-1069643': [
    { id: '68be85d5094d08828defe2d2', name: 'Presentkartong' },
  ],

  // 306001080-633514 (1 products)
  '306001080-633514': [
    { id: '68be85d5094d08828defe2f9', name: 'Linnepåse' },
  ],

  // 174337184-399814 (1 products)
  '174337184-399814': [
    { id: '68be85d5094d08828defe476', name: 'Hissol Badgehållare' },
  ],

  // 138834598-879081 (1 products)
  '138834598-879081': [
    { id: '68be85d5094d08828defe48d', name: 'Flytande Logoband med tryck' },
  ],

  // 192150644-670153 (1 products)
  '192150644-670153': [
    { id: '68be85d5094d08828defe48e', name: 'LanyardBadge namnkortshållare' },
  ],

  // 192327268-670743 (1 products)
  '192327268-670743': [
    { id: '68be85d5094d08828defe48f', name: 'Transparent korthållare' },
  ],

  // 535155614-1517538 (1 products)
  '535155614-1517538': [
    { id: '68be85d5094d08828defe490', name: 'Exklusiv 33 cl' },
  ],

  // 535159100-1517541 (1 products)
  '535159100-1517541': [
    { id: '68be85d5094d08828defe491', name: 'Ice Coffe 25 cl' },
  ],

  // 535150966-1517531 (1 products)
  '535150966-1517531': [
    { id: '68be85d5094d08828defe492', name: 'Unik 43 cl' },
  ],

  // 535160262-1533958 (1 products)
  '535160262-1533958': [
    { id: '68be85d5094d08828defe495', name: 'Ingefärashot 65 ml' },
  ],

  // 583135756-1758023 (1 products)
  '583135756-1758023': [
    { id: '68be85d5094d08828defe496', name: 'Moomin Rooibos Cranberry Tin Refil' },
  ],

  // 543846212-1554870 (1 products)
  '543846212-1554870': [
    { id: '68be85d5094d08828defe4a3', name: 'Nyckelband 20 mm' },
  ],

  // 477472772-1087876 (1 products)
  '477472772-1087876': [
    { id: '68be85d5094d08828defe4a5', name: 'Shubo RABS isskrapa' },
  ],

  // 448721406-958361 (1 products)
  '448721406-958361': [
    { id: '68be85d5094d08828defe4a6', name: 'CreaScrape Isskrapa med tryck' },
  ],

  // 530466944-1499759 (1 products)
  '530466944-1499759': [
    { id: '68be85d5094d08828defe4ad', name: 'Isskrapa "Arrival"' },
  ],

  // 481837244-1109825 (1 products)
  '481837244-1109825': [
    { id: '68be85d5094d08828defe4b3', name: 'We Love The Planet Giftset Care' },
  ],

  // 110006540-223862 (1 products)
  '110006540-223862': [
    { id: '68be85d5094d08828defe4ba', name: 'Isskrapa 5-i-1 Multifunktion' },
  ],

  // 192145996-670145 (1 products)
  '192145996-670145': [
    { id: '68be85d5094d08828defe4bd', name: 'Loupe Creditcard förstoringsglas' },
  ],

  // 192118108-670073 (1 products)
  '192118108-670073': [
    { id: '68be85d5094d08828defe4be', name: 'Loupe Compact förstoringsglas' },
  ],

  // 138228034-948174 (1 products)
  '138228034-948174': [
    { id: '68be85d5094d08828defe4bf', name: 'Förstoringsglas med tryck' },
  ],

  // 552998124-1600204 (1 products)
  '552998124-1600204': [
    { id: '68be85d5094d08828defe4c0', name: 'Longlight kökständare' },
  ],

  // 514884524-1351637 (1 products)
  '514884524-1351637': [
    { id: '68be85d5094d08828defe4c1', name: 'Eltändare' },
  ],

  // 281317876-1223518 (1 products)
  '281317876-1223518': [
    { id: '68be85d5094d08828defe4c2', name: 'BIC® J25 All Black tändare' },
  ],

  // 378314664-798846 (1 products)
  '378314664-798846': [
    { id: '68be85d5094d08828defe4c4', name: 'FireLight tändare' },
  ],

  // 138496456-948320 (1 products)
  '138496456-948320': [
    { id: '68be85d5094d08828defe4cb', name: 'Antistressboll Jorden med tryck' },
  ],

  // 137547102-947302 (1 products)
  '137547102-947302': [
    { id: '68be85d5094d08828defe4cc', name: 'Antistressfigur Lastbil med tryck' },
  ],

  // 500854536-1225685 (1 products)
  '500854536-1225685': [
    { id: '68be85d5094d08828defe4d8', name: 'Bubly nyckelring med flasköppnare' },
  ],

  // 506971304-1305590 (1 products)
  '506971304-1305590': [
    { id: '68be85d5094d08828defe4db', name: 'T-shirt SXT 3 Teardrop (135 g) Herr EU' },
  ],

  // 506960846-1305584 (1 products)
  '506960846-1305584': [
    { id: '68be85d5094d08828defe4dc', name: 'T-shirt SXT 2 (135 g) Dam EU' },
  ],

  // 582796452-1751386 (1 products)
  '582796452-1751386': [
    { id: '68be85d5094d08828defe4e9', name: 'Brabantia Tasty+ Flasköppnare' },
  ],

  // 568804810-1661478 (1 products)
  '568804810-1661478': [
    { id: '68be85d5094d08828defe4ec', name: 'Kapsylöppnare i Bambu och Metall' },
  ],

  // 568789704-1661460 (1 products)
  '568789704-1661460': [
    { id: '68be85d5094d08828defe4ee', name: 'Kapsylöppnare med utskuret handtag' },
  ],

  // 568802486-1661476 (1 products)
  '568802486-1661476': [
    { id: '68be85d5094d08828defe4f2', name: 'Kapsyl-och knivöppare i Bambu' },
  ],

  // 568792028-1661462 (1 products)
  '568792028-1661462': [
    { id: '68be85d5094d08828defe4f4', name: 'Kapsylöppnare Magnetisk i Trä' },
  ],

  // 568788542-1661459 (1 products)
  '568788542-1661459': [
    { id: '68be85d5094d08828defe4f5', name: 'Kapsylöppnare Bokträ' },
  ],

  // 568794352-1661464 (1 products)
  '568794352-1661464': [
    { id: '68be85d5094d08828defe4f6', name: 'Kapsylöppnare Bambu och Metall' },
  ],

  // 521262742-1438500 (1 products)
  '521262742-1438500': [
    { id: '68be85d5094d08828defe4f7', name: 'Nyckelring Flasköppnare' },
  ],

  // 332348268-708603 (1 products)
  '332348268-708603': [
    { id: '68be85d5094d08828defe4ff', name: 'Amigo flasköppnare' },
  ],

  // 205543856-668932 (1 products)
  '205543856-668932': [
    { id: '68be85d5094d08828defe500', name: 'Butler Bamboo servitörskniv' },
  ],

  // 192350508-670794 (1 products)
  '192350508-670794': [
    { id: '68be85d5094d08828defe502', name: 'Carrera öppnare / nyckelring' },
  ],

  // 311795974-684591 (1 products)
  '311795974-684591': [
    { id: '68be85d5094d08828defe50b', name: 'Flasköppnare mekanisk (12) Mörkgrå' },
  ],

  // 316730988-675890 (1 products)
  '316730988-675890': [
    { id: '68be85d6094d08828defe590', name: 'Washington' },
  ],

  // 586287100-1775194 (1 products)
  '586287100-1775194': [
    { id: '68be85d6094d08828defe591', name: 'Bagagebricka, Återvunnet PU, Kaia' },
  ],

  // 534766344-1516355 (1 products)
  '534766344-1516355': [
    { id: '68be85d6094d08828defe592', name: 'Bagagetagg Traveller' },
  ],

  // 534764020-1516353 (1 products)
  '534764020-1516353': [
    { id: '68be85d6094d08828defe594', name: 'Bagagetagg' },
  ],

  // 137456466-947183 (1 products)
  '137456466-947183': [
    { id: '68be85d6094d08828defe5c0', name: 'Bagagebricka med gravyr' },
  ],

  // 585087916-1766683 (1 products)
  '585087916-1766683': [
    { id: '68be85d6094d08828defe5c1', name: 'LifeTag Dual Luggage Tag' },
  ],

  // 495782406-1196382 (1 products)
  '495782406-1196382': [
    { id: '68be85d6094d08828defe5c2', name: 'Klänning Ruby' },
  ],

  // 333835628-1126318 (1 products)
  '333835628-1126318': [
    { id: '68be85d6094d08828defe5c5', name: 'Mockatofflor från Ylleverket' },
  ],

  // 568436456-1659847 (1 products)
  '568436456-1659847': [
    { id: '68be85d6094d08828defe623', name: 'Flipflop' },
  ],

  // 568442266-1659865 (1 products)
  '568442266-1659865': [
    { id: '68be85d6094d08828defe624', name: 'Flipflop' },
  ],

  // 568441104-1659864 (1 products)
  '568441104-1659864': [
    { id: '68be85d6094d08828defe625', name: 'Flipflop' },
  ],

  // 333835628-1126316 (1 products)
  '333835628-1126316': [
    { id: '68be85d6094d08828defe670', name: 'Mockatofflor från Ylleverket' },
  ],

  // 562100070-1632273 (1 products)
  '562100070-1632273': [
    { id: '68be85d6094d08828defe6a4', name: 'Shoe Brush Wood Shoe Care' },
  ],

  // 562102394-1632275 (1 products)
  '562102394-1632275': [
    { id: '68be85d6094d08828defe6a5', name: 'Measuring Stick Inner Size Shoe Care' },
  ],

  // 562110528-1632282 (1 products)
  '562110528-1632282': [
    { id: '68be85d6094d08828defe6a7', name: 'Polish Sponge Shoe Care' },
  ],

  // 562108204-1632280 (1 products)
  '562108204-1632280': [
    { id: '68be85d6094d08828defe6a8', name: 'Shoecream Shoe Care' },
  ],

  // 562104718-1632277 (1 products)
  '562104718-1632277': [
    { id: '68be85d6094d08828defe6a9', name: 'Filtsula Insole' },
  ],

  // 562107042-1632279 (1 products)
  '562107042-1632279': [
    { id: '68be85d6094d08828defe6aa', name: 'Lammull sula Insole' },
  ],

  // 562101232-1632274 (1 products)
  '562101232-1632274': [
    { id: '68be85d6094d08828defe6ab', name: 'Shoe Brush Suede Shoe Care' },
  ],

  // 562098908-1632272 (1 products)
  '562098908-1632272': [
    { id: '68be85d6094d08828defe6ad', name: 'Yocoair Shoe Care' },
  ],

  // 562105880-1632278 (1 products)
  '562105880-1632278': [
    { id: '68be85d6094d08828defe6ae', name: 'Sportsula Insole' },
  ],

  // 562111690-1632283 (1 products)
  '562111690-1632283': [
    { id: '68be85d6094d08828defe6af', name: 'Ouraline Saphir Shoe Care' },
  ],

  // 584205958-1767816 (1 products)
  '584205958-1767816': [
    { id: '68be85d6094d08828defe6c3', name: '4-Pack Socks' },
  ],

  // 421749062-898864 (1 products)
  '421749062-898864': [
    { id: '68be85d6094d08828defe6e7', name: 'Untitled Product' },
  ],

  // 421179682-897566 (1 products)
  '421179682-897566': [
    { id: '68be85d6094d08828defe6e8', name: 'Löpar-/träningsstrumpa' },
  ],

  // 564977182-1185332 (1 products)
  '564977182-1185332': [
    { id: '68be85d6094d08828defe6e9', name: 'Slitstarke strumpor' },
  ],

  // 139506234-717437 (1 products)
  '139506234-717437': [
    { id: '68be85de094d08828df00706', name: 'Reflexknapp 3M med tryck' },
  ],

  // 140403298-717023 (1 products)
  '140403298-717023': [
    { id: '68be85de094d08828df00707', name: 'Knappar Kampanjknappar (25 mm Ø)' },
  ],

  // 205606604-678665 (1 products)
  '205606604-678665': [
    { id: '68be85de094d08828df0085d', name: 'Lanyard Safety  RPET 2 cm nyckelband' },
  ],

  // 387449146-925932 (1 products)
  '387449146-925932': [
    { id: '68be85de094d08828df0094a', name: 'Plastic Bank Recycled Ice Scraper isskrapa' },
  ],

  // 441321790-941749 (1 products)
  '441321790-941749': [
    { id: '68be85de094d08828df00955', name: 'Honestly Made Recycled Softshell B/W' },
  ],

  // 291537666-603523 (1 products)
  '291537666-603523': [
    { id: '68be85de094d08828df00a05', name: 'Subiner RPET anpassad nyckelring' },
  ],

  // 496682956-1204122 (1 products)
  '496682956-1204122': [
    { id: '68be85df094d08828df00b09', name: 'Breda kortärmad T-shirt ekologisk bomull herr' },
  ],

  // powerbank-tradlosa (1 products)
  'powerbank-tradlosa': [
    { id: '68be85df094d08828df00bc3', name: 'Energizer 15W Magnetisk Trådlös Power Bank. Svart' },
  ],

  // 496685280-1204152 (1 products)
  '496685280-1204152': [
    { id: '68be85df094d08828df00c58', name: 'Breda kortärmad T-shirt ekologisk bomull dam' },
  ],

  // 182944118-879203 (1 products)
  '182944118-879203': [
    { id: '68be85e0094d08828df00cae', name: 'Logoband PET' },
  ],

  // 379662584-802236 (1 products)
  '379662584-802236': [
    { id: '68be85e0094d08828df00d64', name: 'Bill - Bomullspåse - 110 g/m²' },
  ],

  // 379663746-802238 (1 products)
  '379663746-802238': [
    { id: '68be85e0094d08828df00d68', name: 'Dino -  Bomullspåse -110 g/m²' },
  ],

  // 319045692-681903 (1 products)
  '319045692-681903': [
    { id: '68be85e0094d08828df00d7d', name: 'Summer Ii - SUMMER II HERR Pique 170g' },
  ],

  // 319048016-1186194 (1 products)
  '319048016-1186194': [
    { id: '68be85e0094d08828df00d87', name: 'Perfect Men - PERFECT HERR Poique 180g' },
  ],

  // 319050340-681121 (1 products)
  '319050340-681121': [
    { id: '68be85e0094d08828df00d8a', name: 'Spring Ii - SPRING II HERR Pique 210g' },
  ],

  // 319044530-681071 (1 products)
  '319044530-681071': [
    { id: '68be85e0094d08828df00d8c', name: 'Passion - PASSION DAM POLO PIQUE 170g' },
  ],

  // 319013156-680936 (1 products)
  '319013156-680936': [
    { id: '68be85e0094d08828df00d8e', name: 'Regent Fit - REGENT F HERR T-SHIRT 150g' },
  ],

  // 411652444-871079 (1 products)
  '411652444-871079': [
    { id: '68be85e0094d08828df00e19', name: 'RPET Felt GRS Luggage Tag resbagagelapp' },
  ],

  // 376799416-1129231 (1 products)
  '376799416-1129231': [
    { id: '68be85e0094d08828df00e4d', name: 'Restry L produktpåse' },
  ],

  // 376798254-793560 (1 products)
  '376798254-793560': [
    { id: '68be85e0094d08828df00e4f', name: 'Restry M produktpåse' },
  ],

  // 319035234-1186088 (1 products)
  '319035234-1186088': [
    { id: '68be85e0094d08828df00e87', name: 'Planet Women - PLANET DAM Polo 170g' },
  ],

  // 319043368-681068 (1 products)
  '319043368-681068': [
    { id: '68be85e0094d08828df00e89', name: 'People - PEOPLE DAM POLO PIQUE 210g' },
  ],

  // 319034072-1186075 (1 products)
  '319034072-1186075': [
    { id: '68be85e0094d08828df00e90', name: 'Planet Men - PLANET HERR Pique 170g' },
  ],

  // 319049178-681114 (1 products)
  '319049178-681114': [
    { id: '68be85e0094d08828df00e94', name: 'Perfect Women - PERFECT DAM POLO PIQUE 180g' },
  ],

  // 333835628-1126313 (1 products)
  '333835628-1126313': [
    { id: '68be85e0094d08828df00ee8', name: 'Mockatofflor från Ylleverket' },
  ],

  // 52732722-83773 (1 products)
  '52732722-83773': [
    { id: '68be85e0094d08828df00ef3', name: 'Lippo cerat med tryck' },
  ],

  // 141734950-310561 (1 products)
  '141734950-310561': [
    { id: '68be85e0094d08828df00ef6', name: 'Regnponcho med tryck' },
  ],

  // 52719940-83750 (1 products)
  '52719940-83750': [
    { id: '68be85e0094d08828df00ef8', name: 'De Luxe Kapsylöppnare med tryck' },
  ],

  // 52722264-83755 (1 products)
  '52722264-83755': [
    { id: '68be85e0094d08828df00efb', name: 'Kapsylöppnare med nyckelring' },
  ],

  // 437121160-935369 (1 products)
  '437121160-935369': [
    { id: '68be85e0094d08828df00f6b', name: 'Odyssey - ODYSSEY RPET t-shirt' },
  ],

  // 205606604-671147 (1 products)
  '205606604-671147': [
    { id: '68be85e0094d08828df00fb2', name: 'Lanyard Safety  RPET 2 cm nyckelband' },
  ],

  // 56741622-94709 (1 products)
  '56741622-94709': [
    { id: '68be85e0094d08828df00fd2', name: 'Billig Skoputs med tryck' },
  ],

  // 52711806-966697 (1 products)
  '52711806-966697': [
    { id: '68be85e0094d08828df00fd8', name: 'Microfiberduk i ask med tryck' },
  ],

  // 265536754-567281 (1 products)
  '265536754-567281': [
    { id: '68be85e1094d08828df0110f', name: 'Neutral - Recycled Performance T-shirt' },
  ],

  // 488600084-1146429 (1 products)
  '488600084-1146429': [
    { id: '68be85e2094d08828df012b1', name: 'Oslo Ice Scraper' },
  ],

  // 486455032-1132729 (1 products)
  '486455032-1132729': [
    { id: '68be85e2094d08828df012d5', name: 'Charged Breeze Shoe' },
  ],

  // 415520742-885094 (1 products)
  '415520742-885094': [
    { id: '68be85e2094d08828df0134d', name: 'Unisex t-shirt 155 gsm' },
  ],

  // 207740036-566654 (1 products)
  '207740036-566654': [
    { id: '68be85e2094d08828df0134e', name: 'B&C #INSPIRE E150' },
  ],

  // 524687156-1465228 (1 products)
  '524687156-1465228': [
    { id: '68be85e2094d08828df0136d', name: 'Vegan Pineapple Leather Luggage Tag' },
  ],

  // 141450260-664370 (1 products)
  '141450260-664370': [
    { id: '68be85e2094d08828df01392', name: 'Nyckelband Flätat med tryck' },
  ],

  // 140864612-662453 (1 products)
  '140864612-662453': [
    { id: '68be85e2094d08828df013a4', name: 'Läppbalsam med tryck' },
  ],

  // 305859316-633255 (1 products)
  '305859316-633255': [
    { id: '68be85e2094d08828df0146a', name: 'Classic OC-T' },
  ],

  // 196258314-1691167 (1 products)
  '196258314-1691167': [
    { id: '68be85e2094d08828df0146d', name: 'Basic-T Bio, herr' },
  ],

  // 140883204-662518 (1 products)
  '140883204-662518': [
    { id: '68be85e2094d08828df0149d', name: 'Tändare Polo med tryck' },
  ],

  // 140937818-662712 (1 products)
  '140937818-662712': [
    { id: '68be85e2094d08828df014a2', name: 'Elektronisk Tändare med Kapsylöppnare' },
  ],

  // 140919226-662650 (1 products)
  '140919226-662650': [
    { id: '68be85e2094d08828df014a4', name: 'Isskrapa med logo' },
  ],

  // 140918064-662646 (1 products)
  '140918064-662646': [
    { id: '68be85e2094d08828df014a9', name: 'Trekantig isskrapa' },
  ],

  // 140920388-662654 (1 products)
  '140920388-662654': [
    { id: '68be85e2094d08828df014ac', name: 'Isskrapa med Handtag' },
  ],

  // 210119812-662598 (1 products)
  '210119812-662598': [
    { id: '68be85e2094d08828df014ae', name: 'Tändare kapsylöppnare' },
  ],

  // 140893662-662565 (1 products)
  '140893662-662565': [
    { id: '68be85e2094d08828df014b5', name: 'Tändare med logo' },
  ],

  // 561417976-1628836 (1 products)
  '561417976-1628836': [
    { id: '68be85e2094d08828df014e1', name: 'Seger Basic Cotton 5-pack' },
  ],

  // 561416814-1628835 (1 products)
  '561416814-1628835': [
    { id: '68be85e2094d08828df014e2', name: 'Seger Basic Cotton Ribbed 3-pack' },
  ],

  // 561419138-1628839 (1 products)
  '561419138-1628839': [
    { id: '68be85e2094d08828df014e3', name: 'Seger Basic Cotton low 5-pack' },
  ],

  // 305860478-633272 (1 products)
  '305860478-633272': [
    { id: '68be85e2094d08828df0153d', name: 'Classic OC-T Women' },
  ],

  // 480569502-1104332 (1 products)
  '480569502-1104332': [
    { id: '68be85e2094d08828df01555', name: 'Exclusive Business Vest' },
  ],

  // 140916902-662642 (1 products)
  '140916902-662642': [
    { id: '68be85e2094d08828df01569', name: 'Isskrapa med mjukt handtag' },
  ],

  // 140887852-662532 (1 products)
  '140887852-662532': [
    { id: '68be85e2094d08828df01578', name: 'Elektronisk Tändare med tryck' },
  ],

  // 141115604-663106 (1 products)
  '141115604-663106': [
    { id: '68be85e2094d08828df0157b', name: 'Handklappare' },
  ],

  // 395735368-840013 (1 products)
  '395735368-840013': [
    { id: '68be85e2094d08828df015e8', name: 'Sparock 220g' },
  ],

  // 395728396-840000 (1 products)
  '395728396-840000': [
    { id: '68be85e2094d08828df015ed', name: 'Frottérock 360g' },
  ],

  // 313353054-662592 (1 products)
  '313353054-662592': [
    { id: '68be85e2094d08828df0160d', name: 'Turbotändare' },
  ],

  // 140934332-662707 (1 products)
  '140934332-662707': [
    { id: '68be85e2094d08828df0161b', name: 'Tändare med fullfärgstryck' },
  ],

  // 140865774-662460 (1 products)
  '140865774-662460': [
    { id: '68be85e2094d08828df01621', name: 'Cerat i boll med tryck' },
  ],

  // 165178300-377919 (1 products)
  '165178300-377919': [
    { id: '68be85e3094d08828df01666', name: 'Klänning Lena' },
  ],

  // 336100366-715913 (1 products)
  '336100366-715913': [
    { id: '68be85e3094d08828df0166f', name: 'Printer PRIME - Prime T' },
  ],

  // 336102690-715925 (1 products)
  '336102690-715925': [
    { id: '68be85e3094d08828df01672', name: 'Printer PRIME - Prime Polo' },
  ],

  // 140921550-662656 (1 products)
  '140921550-662656': [
    { id: '68be85e3094d08828df016b4', name: 'Isskrapa-Handske' },
  ],

  // 140884366-662524 (1 products)
  '140884366-662524': [
    { id: '68be85e3094d08828df016b5', name: 'Transparent Tändare med tryck' },
  ],

  // 140882042-662512 (1 products)
  '140882042-662512': [
    { id: '68be85e3094d08828df016c0', name: 'Tändare Cricket 90 med tryck' },
  ],

  // 141165570-663224 (1 products)
  '141165570-663224': [
    { id: '68be85e3094d08828df016c2', name: 'Rund Skoputs med tryck' },
  ],

  // 140922712-662660 (1 products)
  '140922712-662660': [
    { id: '68be85e3094d08828df016ce', name: 'Isskrapa med handske och tryck' },
  ],

  // 210118650-662585 (1 products)
  '210118650-662585': [
    { id: '68be85e3094d08828df0174a', name: 'Turbotändare Adventure' },
  ],

  // 140859964-662430 (1 products)
  '140859964-662430': [
    { id: '68be85e3094d08828df0174c', name: 'Stor Kylskåpsmagnet med tryck' },
  ],

  // 140858802-662427 (1 products)
  '140858802-662427': [
    { id: '68be85e3094d08828df01751', name: 'Rektangulär Kylskåpsmagnet med tryck' },
  ],

  // 378741118-799747 (1 products)
  '378741118-799747': [
    { id: '68be85e3094d08828df01778', name: 'Printer - Surf Pro L/s' },
  ],

  // 147852880-338895 (1 products)
  '147852880-338895': [
    { id: '68be85e3094d08828df01780', name: 'Långt Skohorn med tryck' },
  ],

  // 147744814-338602 (1 products)
  '147744814-338602': [
    { id: '68be85e3094d08828df0178a', name: 'Skoputs med tryck' },
  ],

  // 147747138-338605 (1 products)
  '147747138-338605': [
    { id: '68be85e3094d08828df0178b', name: 'Putshorn med tryck' },
  ],

  // 147854042-338900 (1 products)
  '147854042-338900': [
    { id: '68be85e3094d08828df0178f', name: 'Extra Långt Skohorn med tryck' },
  ],

  // 544276152-1557836 (1 products)
  '544276152-1557836': [
    { id: '68be85e3094d08828df0181f', name: 'Heavy Cotton? Adult T-Shirt' },
  ],

  // 544271504-1557734 (1 products)
  '544271504-1557734': [
    { id: '68be85e4094d08828df0182d', name: 'Ultra Cotton? Adult T-Shirt' },
  ],

  // 336103852-715929 (1 products)
  '336103852-715929': [
    { id: '68be85e4094d08828df018d5', name: 'Printer PRIME - Prime Polo Lady' },
  ],

  // 544280800-1557929 (1 products)
  '544280800-1557929': [
    { id: '68be85e4094d08828df018d7', name: 'Softstyle® Adult T- Shirt' },
  ],

  // 324422266-700809 (1 products)
  '324422266-700809': [
    { id: '68be85e4094d08828df018da', name: 'Mens long sleeve Anthem t-shirt' },
  ],

  // 336545412-723262 (1 products)
  '336545412-723262': [
    { id: '68be85e4094d08828df018dd', name: 'Men´s Golden Organic T-Shirt' },
  ],

  // 313350730-662567 (1 products)
  '313350730-662567': [
    { id: '68be85e4094d08828df01936', name: 'Tändare Torpedo metall' },
  ],

  // 446440400-954769 (1 products)
  '446440400-954769': [
    { id: '68be85e4094d08828df0198d', name: 'Kavaj Dam' },
  ],

  // 486341156-1132617 (1 products)
  '486341156-1132617': [
    { id: '68be85e4094d08828df019ae', name: 'Sure Track Erath Work Shoe w' },
  ],

  // 486344642-1132621 (1 products)
  '486344642-1132621': [
    { id: '68be85e4094d08828df019af', name: 'Relaxed Fit Flex Advantage Bendon Work Shoe' },
  ],

  // 486337670-1132613 (1 products)
  '486337670-1132613': [
    { id: '68be85e4094d08828df019b0', name: 'Max Cushioning Work Shoe w' },
  ],

  // 486522428-1132910 (1 products)
  '486522428-1132910': [
    { id: '68be85e4094d08828df019b1', name: 'Bregman Shoe' },
  ],

  // 486631656-1133310 (1 products)
  '486631656-1133310': [
    { id: '68be85e4094d08828df019b2', name: 'Max Cushioning Delta Shoe w' },
  ],

  // 486346966-1568331 (1 products)
  '486346966-1568331': [
    { id: '68be85e4094d08828df019b3', name: 'Max Cushioning Delta Shoe' },
  ],

  // 495703390-1232022 (1 products)
  '495703390-1232022': [
    { id: '68be85e4094d08828df019b6', name: 'Max cushioning Premier Slip In Shoe' },
  ],

  // 554111320-1604462 (1 products)
  '554111320-1604462': [
    { id: '68be85e4094d08828df019b8', name: 'Max Cushioning Exciton Endeavour Slip ins Shoe' },
  ],

  // 336546574-723268 (1 products)
  '336546574-723268': [
    { id: '68be85e4094d08828df019e1', name: 'Women´s Golden Organic T-Shirt' },
  ],

  // 446439238-954763 (1 products)
  '446439238-954763': [
    { id: '68be85e4094d08828df019e7', name: 'Kavaj Herr' },
  ],

  // 267914206-570152 (1 products)
  '267914206-570152': [
    { id: '68be85e4094d08828df019ef', name: 'SEVEN SEAS polo shirt | dam' },
  ],

  // 267922340-570158 (1 products)
  '267922340-570158': [
    { id: '68be85e4094d08828df019f5', name: 'SEVEN SEAS T-shirt | o-neck' },
  ],

  // 436422798-930089 (1 products)
  '436422798-930089': [
    { id: '68be85e4094d08828df01a6d', name: 'Men"s lightweight recycled padded bodywarmer' },
  ],

  // 423449068-907980 (1 products)
  '423449068-907980': [
    { id: '68be85e4094d08828df01a6f', name: 'Eco-friendly Mens Oversize T-shirt' },
  ],

  // 446434590-954750 (1 products)
  '446434590-954750': [
    { id: '68be85e4094d08828df01a73', name: 'Klänning stretch' },
  ],

  // 436423960-930091 (1 products)
  '436423960-930091': [
    { id: '68be85e4094d08828df01a79', name: 'Ladies lightweight recycled padded bodywarmer' },
  ],

  // 423445582-907968 (1 products)
  '423445582-907968': [
    { id: '68be85e4094d08828df01a7e', name: 'Unisex Faded T-shirt 165gsm' },
  ],

  // 496675984-1204024 (1 products)
  '496675984-1204024': [
    { id: '68be85e4094d08828df01ac6', name: 'Bahrain kortärmad funktions T-shirt för barn' },
  ],

  // 496679470-1204090 (1 products)
  '496679470-1204090': [
    { id: '68be85e4094d08828df01ac8', name: 'Beagle kortärmad T-shirt för herr' },
  ],

  // 496736408-1204579 (1 products)
  '496736408-1204579': [
    { id: '68be85e4094d08828df01ac9', name: 'Stafford kortärmad T-shirt för herr' },
  ],

  // 496686442-1204172 (1 products)
  '496686442-1204172': [
    { id: '68be85e4094d08828df01acc', name: 'Capri kortärmad T-shirt för dam' },
  ],

  // 496705034-1204327 (1 products)
  '496705034-1204327': [
    { id: '68be85e4094d08828df01acd', name: 'Imola kortärmad funktions T-shirt för herr' },
  ],

  // 496680632-1204109 (1 products)
  '496680632-1204109': [
    { id: '68be85e4094d08828df01ace', name: 'Beagle kortärmad T-shirt för barn' },
  ],

  // 496724788-1204504 (1 products)
  '496724788-1204504': [
    { id: '68be85e4094d08828df01ad1', name: 'Oslo väst herr' },
  ],

  // 496708520-1204384 (1 products)
  '496708520-1204384': [
    { id: '68be85e4094d08828df01ad2', name: 'Jamaica kortärmad T-shirt för dam' },
  ],

  // 496716654-1204451 (1 products)
  '496716654-1204451': [
    { id: '68be85e4094d08828df01ad3', name: 'Monzha kortärmad funktionspikétröja för herr' },
  ],

  // 496682956-1204120 (1 products)
  '496682956-1204120': [
    { id: '68be85e4094d08828df01ad4', name: 'Breda kortärmad T-shirt ekologisk bomull herr' },
  ],

  // 529654706-1493226 (1 products)
  '529654706-1493226': [
    { id: '68be85e4094d08828df01ad5', name: 'Dogo Premium kortärmad T-shirt för herr' },
  ],

  // 496707358-1204363 (1 products)
  '496707358-1204363': [
    { id: '68be85e4094d08828df01ad7', name: 'Imola kortärmad funktions T-shirt för dam' },
  ],

  // 496685280-1517972 (1 products)
  '496685280-1517972': [
    { id: '68be85e4094d08828df01ad9', name: 'Breda kortärmad T-shirt ekologisk bomull dam' },
  ],

  // 496725950-1204505 (1 products)
  '496725950-1204505': [
    { id: '68be85e4094d08828df01adb', name: 'Oslo väst dam' },
  ],

  // 496721302-1204486 (1 products)
  '496721302-1204486': [
    { id: '68be85e4094d08828df01adc', name: 'Nevada unisex softshellväst' },
  ],

  // 496718978-1204483 (1 products)
  '496718978-1204483': [
    { id: '68be85e4094d08828df01ae0', name: 'Monzha kortärmad funktionspikétröja för dam' },
  ],

  // 496692252-1204237 (1 products)
  '496692252-1204237': [
    { id: '68be85e4094d08828df01ae3', name: 'Estrella långärmad pikétröja för herr' },
  ],

  // 496673660-1203989 (1 products)
  '496673660-1203989': [
    { id: '68be85e4094d08828df01ae4', name: 'Austral kortärmad unisex pikétröja' },
  ],

  // 496693414-1204257 (1 products)
  '496693414-1204257': [
    { id: '68be85e4094d08828df01ae5', name: 'Estrella långärmad pikétröja för dam' },
  ],

  // 496696900-1204276 (1 products)
  '496696900-1204276': [
    { id: '68be85e4094d08828df01ae6', name: 'Extreme långärmad T-shirt för herr' },
  ],

  // 446439238-954765 (1 products)
  '446439238-954765': [
    { id: '68be85e4094d08828df01af5', name: 'Kavaj Herr' },
  ],

  // 339407418-731607 (1 products)
  '339407418-731607': [
    { id: '68be85e4094d08828df01afe', name: 'Organic T-Shirt Round Neck' },
  ],

  // 529696538-1495266 (1 products)
  '529696538-1495266': [
    { id: '68be85e4094d08828df01b05', name: 'True Polo' },
  ],

  // 457047136-981596 (1 products)
  '457047136-981596': [
    { id: '68be85e4094d08828df01b11', name: 'Printer RED - Smash' },
  ],

  // 551116846-881952 (1 products)
  '551116846-881952': [
    { id: '68be85e4094d08828df01b6b', name: 'Diamond Badrock Herr' },
  ],

  // 548698724-881955 (1 products)
  '548698724-881955': [
    { id: '68be85e4094d08828df01b6c', name: 'Diamond Badrock Herr' },
  ],

  // 584944990-1066076 (1 products)
  '584944990-1066076': [
    { id: '68be85e4094d08828df01b79', name: 'Diamond Badrock Dam' },
  ],

  // 529665164-1493277 (1 products)
  '529665164-1493277': [
    { id: '68be85e4094d08828df01b88', name: 'Pegaso Premium kortärmad piké för män' },
  ],

  // 496746866-1518008 (1 products)
  '496746866-1518008': [
    { id: '68be85e4094d08828df01b8d', name: 'Victoria kortärmad v-ringad T-shirt för dam' },
  ],

  // 523872594-1457512 (1 products)
  '523872594-1457512': [
    { id: '68be85e4094d08828df01b97', name: 'Montmelo kortärmad unisex sportpolo' },
  ],

  // 496681794-1517967 (1 products)
  '496681794-1517967': [
    { id: '68be85e4094d08828df01ba0', name: 'Belice kortärmad T-shirt för dam' },
  ],

  // 502841556-1242387 (1 products)
  '502841556-1242387': [
    { id: '68be85e4094d08828df01ba1', name: 'Samoyedo kortärmad v-ringad T-shirt för herr' },
  ],

  // 568667694-1661148 (1 products)
  '568667694-1661148': [
    { id: '68be85e4094d08828df01ba7', name: 'Bull kortärmad oversize unisex T-shirt' },
  ],

  // 544272666-1557768 (1 products)
  '544272666-1557768': [
    { id: '68be85e4094d08828df01bd1', name: 'Ultra Cotton? Long Sleeve T-Shirt' },
  ],

  // 457048298-981605 (1 products)
  '457048298-981605': [
    { id: '68be85e4094d08828df01bdd', name: 'Printer RED - Smash Lady' },
  ],

  // 515229638-1355067 (1 products)
  '515229638-1355067': [
    { id: '68be85e4094d08828df01be7', name: 'Men"s Eco-Friendly Piqué Knit Polo Shirt' },
  ],

  // 529653544-1493195 (1 products)
  '529653544-1493195': [
    { id: '68be85e5094d08828df01c18', name: 'Centauro Premium kortärmad unisexpolo' },
  ],

  // 529667488-1493294 (1 products)
  '529667488-1493294': [
    { id: '68be85e5094d08828df01c19', name: 'Pegaso Premium kortärmad piké för dam' },
  ],

  // 529657030-1493253 (1 products)
  '529657030-1493253': [
    { id: '68be85e5094d08828df01c1f', name: 'Fox kortärmad T-shirt för herr' },
  ],

  // 523869108-1457494 (1 products)
  '523869108-1457494': [
    { id: '68be85e5094d08828df01c26', name: 'Tamil kortärmad sportpolo för herr' },
  ],

  // 529668650-1493298 (1 products)
  '529668650-1493298': [
    { id: '68be85e5094d08828df01c27', name: 'Reine lång damväst' },
  ],

  // 523871432-1457505 (1 products)
  '523871432-1457505': [
    { id: '68be85e5094d08828df01c29', name: 'Tamil kortärmad sportpolo för dam' },
  ],

  // 549018274-1661077 (1 products)
  '549018274-1661077': [
    { id: '68be85e5094d08828df01c32', name: 'Tormo kortärmad piké för herr' },
  ],

  // 549019436-1661089 (1 products)
  '549019436-1661089': [
    { id: '68be85e5094d08828df01c36', name: 'Tormo kortärmad piké för dam' },
  ],

  // 446436914-954755 (1 products)
  '446436914-954755': [
    { id: '68be85e5094d08828df01c42', name: 'Väst stretch Herr' },
  ],

  // 446438076-954759 (1 products)
  '446438076-954759': [
    { id: '68be85e5094d08828df01c46', name: 'Väst stretch Dam' },
  ],

  // 477236886-1153010 (1 products)
  '477236886-1153010': [
    { id: '68be85e5094d08828df01c6f', name: 'Unisex t-shirt Made in Portugal' },
  ],

  // 515231962-1355084 (1 products)
  '515231962-1355084': [
    { id: '68be85e5094d08828df01c71', name: 'Unisex Eco-Friendly Oversized French Terry T-shirt' },
  ],

  // 515230800-1355074 (1 products)
  '515230800-1355074': [
    { id: '68be85e5094d08828df01c78', name: 'Ladies" Eco-Friendly Piqué Knit Polo Shirt' },
  ],

  // 445858238-953828 (1 products)
  '445858238-953828': [
    { id: '68be85e5094d08828df01c7a', name: 'Stretch Piqué Lady' },
  ],

  // 544301716-1558125 (1 products)
  '544301716-1558125': [
    { id: '68be85e5094d08828df01c81', name: 'DryBlend® Youth Polo' },
  ],

  // 515233124-1355095 (1 products)
  '515233124-1355095': [
    { id: '68be85e5094d08828df01c83', name: 'Unisex Eco-Friendly Dropped Shoulders T-shirt' },
  ],

  // 544290096-1558024 (1 products)
  '544290096-1558024': [
    { id: '68be85e5094d08828df01c8f', name: 'Softstyle® Adult V-Neck T-Shirt' },
  ],

  // 585607330-1769716 (1 products)
  '585607330-1769716': [
    { id: '68be85e5094d08828df01caa', name: 'Corgi kortärmad T-shirt för herr' },
  ],

  // 585611978-1769744 (1 products)
  '585611978-1769744': [
    { id: '68be85e5094d08828df01cac', name: 'Cobain kortärmad unisex pikétröja' },
  ],

  // 585608492-1769724 (1 products)
  '585608492-1769724': [
    { id: '68be85e5094d08828df01cad', name: 'Fiyi kortärmad t-shirt för dam' },
  ],

  // 339449250-954566 (1 products)
  '339449250-954566': [
    { id: '68be85e5094d08828df01cae', name: 'Women´s Star Poloshirt' },
  ],

  // 336541926-723224 (1 products)
  '336541926-723224': [
    { id: '68be85e5094d08828df01caf', name: 'Men´s Star Poloshirt' },
  ],

  // 336523334-722998 (1 products)
  '336523334-722998': [
    { id: '68be85e5094d08828df01cb0', name: 'Men´s Bahrain T-Shirt' },
  ],

  // 336534954-723145 (1 products)
  '336534954-723145': [
    { id: '68be85e5094d08828df01cb1', name: 'Men´s Dogo Premium T-Shirt' },
  ],

  // 336532630-723133 (1 products)
  '336532630-723133': [
    { id: '68be85e5094d08828df01cb3', name: 'Atomic 150 T-Shirt' },
  ],

  // 336526820-723060 (1 products)
  '336526820-723060': [
    { id: '68be85e5094d08828df01cb6', name: 'Men´s Montecarlo T-Shirt' },
  ],

  // 336545412-723258 (1 products)
  '336545412-723258': [
    { id: '68be85e5094d08828df01cb9', name: 'Men´s Golden Organic T-Shirt' },
  ],

  // 336546574-723269 (1 products)
  '336546574-723269': [
    { id: '68be85e5094d08828df01cbc', name: 'Women´s Golden Organic T-Shirt' },
  ],

  // 544286610-1557988 (1 products)
  '544286610-1557988': [
    { id: '68be85e5094d08828df01d14', name: 'Softstyle® Adult Long Sleeve T-Shirt' },
  ],

  // 544284286-1557979 (1 products)
  '544284286-1557979': [
    { id: '68be85e5094d08828df01d17', name: 'Softstyle® Adult Tank Top' },
  ],

  // 477238048-1088237 (1 products)
  '477238048-1088237': [
    { id: '68be85e5094d08828df01d21', name: 'Unisex Long Sleeve T-shirt' },
  ],

  // 554146180-1604521 (1 products)
  '554146180-1604521': [
    { id: '68be85e5094d08828df01daa', name: 'Puma funktions piké' },
  ],

  // 490466256-1233699 (1 products)
  '490466256-1233699': [
    { id: '68be85e5094d08828df01ddb', name: 'Pikétröja' },
  ],

  // 336486150-722731 (1 products)
  '336486150-722731': [
    { id: '68be85e5094d08828df01de1', name: 'Men´s Premium-T' },
  ],

  // 339434144-731745 (1 products)
  '339434144-731745': [
    { id: '68be85e5094d08828df01de2', name: 'Women´s Polo' },
  ],

  // 339451574-731857 (1 products)
  '339451574-731857': [
    { id: '68be85e5094d08828df01de7', name: 'Men´s Roundneck T-Shirt' },
  ],

  // 336490798-722792 (1 products)
  '336490798-722792': [
    { id: '68be85e5094d08828df01de9', name: 'Men´s Performance-T' },
  ],

  // 316995924-676685 (1 products)
  '316995924-676685': [
    { id: '68be85e5094d08828df01e01', name: 'Vespa RPET väst med kroppsvärmare' },
  ],

  // 186195394-1077223 (1 products)
  '186195394-1077223': [
    { id: '68be85e5094d08828df01e3e', name: 'Printer - Expedition Vest' },
  ],

  // 162808982-368576 (1 products)
  '162808982-368576': [
    { id: '68be85e5094d08828df01e49', name: 'Printer - Surf Light Rsx' },
  ],

  // 186196556-426812 (1 products)
  '186196556-426812': [
    { id: '68be85e5094d08828df01e4e', name: 'Printer - Expedition Vest Lady' },
  ],

  // 162818278-368585 (1 products)
  '162818278-368585': [
    { id: '68be85e5094d08828df01e54', name: 'Printer - Surf Light Lady' },
  ],

  // 415993676-885947 (1 products)
  '415993676-885947': [
    { id: '68be85e5094d08828df01ef1', name: 'Restry S presentpåse i bomull' },
  ],

  // 395735368-840014 (1 products)
  '395735368-840014': [
    { id: '68be85e5094d08828df01ef7', name: 'Sparock 220g' },
  ],

  // 395728396-839998 (1 products)
  '395728396-839998': [
    { id: '68be85e5094d08828df01ef8', name: 'Frottérock 360g' },
  ],

  // 378741118-799742 (1 products)
  '378741118-799742': [
    { id: '68be85e5094d08828df01f20', name: 'Printer - Surf Pro L/s' },
  ],

  // 398704278-883984 (1 products)
  '398704278-883984': [
    { id: '68be85e5094d08828df01f28', name: 'Printer - Surf Pro L/s Lady' },
  ],

  // 512289778-1328811 (1 products)
  '512289778-1328811': [
    { id: '68be85e5094d08828df01f2c', name: 'Printer - Heavier Pro L/s' },
  ],

  // 545826260-1564597 (1 products)
  '545826260-1564597': [
    { id: '68be85e5094d08828df01f2d', name: 'Printer - Shoelaces' },
  ],

  // 512287454-1328787 (1 products)
  '512287454-1328787': [
    { id: '68be85e5094d08828df01f2e', name: 'Printer - Heavier Pro' },
  ],

  // 545825098-1564591 (1 products)
  '545825098-1564591': [
    { id: '68be85e5094d08828df01f2f', name: 'Printer - Flex Sneakers' },
  ],

  // 585243624-1768078 (1 products)
  '585243624-1768078': [
    { id: '68be85e5094d08828df01f39', name: 'Printer - Airwalk Vest' },
  ],

  // 140855316-662414 (1 products)
  '140855316-662414': [
    { id: '68be85e5094d08828df01f74', name: 'Regnponcho i boll med tryck' },
  ],

  // 557261502-1613363 (1 products)
  '557261502-1613363': [
    { id: '68be85e5094d08828df01f75', name: 'Nyckelband R-PET' },
  ],

  // 446513606-955100 (1 products)
  '446513606-955100': [
    { id: '68be85e5094d08828df01f7c', name: 'Skräddarsydda presentförpackning för muggar' },
  ],

  // 187042492-428989 (1 products)
  '187042492-428989': [
    { id: '68be85e5094d08828df01f81', name: 'Färgad Isskrapa med tryck' },
  ],

  // 585242462-1768069 (1 products)
  '585242462-1768069': [
    { id: '68be85e6094d08828df01ffd', name: 'Printer - Prime Softshell Vest Lady' },
  ],

  // 585241300-1768065 (1 products)
  '585241300-1768065': [
    { id: '68be85e6094d08828df01ffe', name: 'Printer - Prime Softshell Vest' },
  ],

  // 585244786-1768082 (1 products)
  '585244786-1768082': [
    { id: '68be85e6094d08828df02000', name: 'Printer - Airwalk Vest Lady' },
  ],

  // 585238976-1768053 (1 products)
  '585238976-1768053': [
    { id: '68be85e6094d08828df02001', name: 'Printer - Base Vest' },
  ],

  // 585240138-1768056 (1 products)
  '585240138-1768056': [
    { id: '68be85e6094d08828df02002', name: 'Printer - Base Vest Lady' },
  ],

  // 109946116-223730 (1 products)
  '109946116-223730': [
    { id: '68be85e6094d08828df02080', name: 'Logoband med tryck' },
  ],

  // 157478888-358490 (1 products)
  '157478888-358490': [
    { id: '68be85e6094d08828df02083', name: 'Nyckelband med praktisk krok' },
  ],

  // 109936820-223717 (1 products)
  '109936820-223717': [
    { id: '68be85e6094d08828df02089', name: 'Nyckelband med avtagbart spänne' },
  ],

  // 109897312-223611 (1 products)
  '109897312-223611': [
    { id: '68be85e6094d08828df0209d', name: 'Regnponcho i påse med tryck' },
  ],

  // 186973934-428929 (1 products)
  '186973934-428929': [
    { id: '68be85e6094d08828df020a3', name: 'Billigt Kundvagnsmynt med tryck' },
  ],

  // 187051788-428994 (1 products)
  '187051788-428994': [
    { id: '68be85e6094d08828df020a5', name: 'Transpararent isskrapa med tryck' },
  ],

  // 187192390-429115 (1 products)
  '187192390-429115': [
    { id: '68be85e6094d08828df020a9', name: 'Skohorn 130 mm' },
  ],

  // 187364366-429263 (1 products)
  '187364366-429263': [
    { id: '68be85e6094d08828df020ac', name: 'Påsklämma med logo' },
  ],

  // 187371338-429272 (1 products)
  '187371338-429272': [
    { id: '68be85e6094d08828df020af', name: 'Påsklämma med eget tryck' },
  ],

  // 187355070-429262 (1 products)
  '187355070-429262': [
    { id: '68be85e6094d08828df020b0', name: 'Påsklämma med tryck' },
  ],

  // 187380634-429278 (1 products)
  '187380634-429278': [
    { id: '68be85e6094d08828df020b6', name: 'Stor Påsklämma med tryck' },
  ],

  // 446511282-1693752 (1 products)
  '446511282-1693752': [
    { id: '68be85e6094d08828df020c2', name: 'Skräddarsydda presentförpackning för små flaskor' },
  ],

  // 140978488-662812 (1 products)
  '140978488-662812': [
    { id: '68be85e6094d08828df020d0', name: 'Bagagebricka Flip-Flop med tryck' },
  ],

  // 109964708-223794 (1 products)
  '109964708-223794': [
    { id: '68be85e6094d08828df0215a', name: 'Billigt cerat med tryck' },
  ],

  // 375129622-788500 (1 products)
  '375129622-788500': [
    { id: '68be85e6094d08828df0215e', name: 'Schyn flasköppnare av halm' },
  ],

  // 534248092-1513235 (1 products)
  '534248092-1513235': [
    { id: '68be85e6094d08828df02176', name: 'Skohorn metall 58 cm' },
  ],

  // 534246930-1616610 (1 products)
  '534246930-1616610': [
    { id: '68be85e6094d08828df02177', name: 'Skohorn metall 31 cm' },
  ],

  // 446512444-955099 (1 products)
  '446512444-955099': [
    { id: '68be85e6094d08828df021b6', name: 'Skräddarsydda presentförpackning för medium flaskor' },
  ],

  // 371448406-782997 (1 products)
  '371448406-782997': [
    { id: '68be85e6094d08828df021cc', name: 'Läppbalsam' },
  ],

  // 371298508-782847 (1 products)
  '371298508-782847': [
    { id: '68be85e6094d08828df021cd', name: 'Läppbalsam spf20' },
  ],

  // 174331374-399787 (1 products)
  '174331374-399787': [
    { id: '68be85e6094d08828df021d8', name: 'Event nyckelband' },
  ],

  // 174593986-400569 (1 products)
  '174593986-400569': [
    { id: '68be85e6094d08828df021de', name: 'Glasgow' },
  ],

  // 174325564-399755 (1 products)
  '174325564-399755': [
    { id: '68be85e6094d08828df021e7', name: 'Savent nyckelband' },
  ],

  // 174333698-399803 (1 products)
  '174333698-399803': [
    { id: '68be85e6094d08828df021f6', name: 'Ballek' },
  ],

  // 174334860-399809 (1 products)
  '174334860-399809': [
    { id: '68be85e6094d08828df021fb', name: 'Bahhol Badgehållare' },
  ],

  // 109931010-223702 (1 products)
  '109931010-223702': [
    { id: '68be85e6094d08828df02210', name: 'Antistressboll med tryck' },
  ],

  // 291537666-676108 (1 products)
  '291537666-676108': [
    { id: '68be85e6094d08828df0225a', name: 'Subiner RPET anpassad nyckelring' },
  ],

  // 291558582-1114250 (1 products)
  '291558582-1114250': [
    { id: '68be85e6094d08828df0225d', name: 'Liplox Läppbalsam' },
  ],

  // 175680456-403604 (1 products)
  '175680456-403604': [
    { id: '68be85e6094d08828df02269', name: 'Aegis poncho nyckelring' },
  ],

  // 257962838-547672 (1 products)
  '257962838-547672': [
    { id: '68be85e6094d08828df0226c', name: 'Devent nyckelband' },
  ],

  // 111592670-635266 (1 products)
  '111592670-635266': [
    { id: '68be85e6094d08828df0228b', name: 'Hjärtformad stressboll med tryck' },
  ],

  // 499422952-1215267 (1 products)
  '499422952-1215267': [
    { id: '68be85e6094d08828df022c0', name: 'Isskrapa Bambu & R-PP' },
  ],

  // 258192914-1114258 (1 products)
  '258192914-1114258': [
    { id: '68be85e6094d08828df022dc', name: 'Peddas väst med kroppsvärmare' },
  ],

  // 174588176-400545 (1 products)
  '174588176-400545': [
    { id: '68be85e6094d08828df022e3', name: 'Denver' },
  ],

  // 175202874-402074 (1 products)
  '175202874-402074': [
    { id: '68be85e6094d08828df022ea', name: 'Plastisskrapa med Handtag' },
  ],

  // 110922196-226114 (1 products)
  '110922196-226114': [
    { id: '68be85e6094d08828df0230a', name: 'Discovery bagageetikett med tryck' },
  ],

  // 175683942-403616 (1 products)
  '175683942-403616': [
    { id: '68be85e6094d08828df02383', name: 'Stormy poncho' },
  ],

  // 111018642-226355 (1 products)
  '111018642-226355': [
    { id: '68be85e6094d08828df023ac', name: 'Serenity öronproppar i etui' },
  ],

  // 110005378-223859 (1 products)
  '110005378-223859': [
    { id: '68be85e6094d08828df023c1', name: 'Isskrapa med Handske' },
  ],

  // 557389322-1613653 (1 products)
  '557389322-1613653': [
    { id: '68be85e7094d08828df023f6', name: 'Flygbricka med nyckelring' },
  ],

  // 196400078-797355 (1 products)
  '196400078-797355': [
    { id: '68be85e7094d08828df02572', name: 'MMV Luton Bagagebricka' },
  ],

  // 319051502-681150 (1 products)
  '319051502-681150': [
    { id: '68be85e7094d08828df0259f', name: 'Regent - REGENT Uni T-shirt 150g' },
  ],

  // 319057312-1186223 (1 products)
  '319057312-1186223': [
    { id: '68be85e7094d08828df025a1', name: 'Imperial - T-Shirt IMPERIAL HERR 190g' },
  ],

  // 164650752-376058 (1 products)
  '164650752-376058': [
    { id: '68be85e7094d08828df025a2', name: 'Logoband säkerhetsspänne med tryck' },
  ],

  // 153356112-349693 (1 products)
  '153356112-349693': [
    { id: '68be85e7094d08828df025a4', name: 'Billigt Nyckelband med tryck' },
  ],

  // 153239912-349445 (1 products)
  '153239912-349445': [
    { id: '68be85e7094d08828df025a8', name: 'Festivalarmband med eget tryck' },
  ],

  // 152195274-347255 (1 products)
  '152195274-347255': [
    { id: '68be85e7094d08828df025a9', name: 'Gloss - Läppbalsam' },
  ],

  // 319045692-681087 (1 products)
  '319045692-681087': [
    { id: '68be85e7094d08828df025b0', name: 'Summer Ii - SUMMER II HERR Pique 170g' },
  ],

  // 205667028-1586569 (1 products)
  '205667028-1586569': [
    { id: '68be85e7094d08828df025b3', name: 'Lany Rpet - Logoband i RPET/säkerhetsklips' },
  ],

  // 152940116-348692 (1 products)
  '152940116-348692': [
    { id: '68be85e7094d08828df025b7', name: 'Logoband med metallkrok' },
  ],

  // 153208538-376037 (1 products)
  '153208538-376037': [
    { id: '68be85e7094d08828df025bd', name: 'Silikonarmband med eget tryck' },
  ],

  // 177257290-416696 (1 products)
  '177257290-416696': [
    { id: '68be85e7094d08828df025be', name: 'Wide Lany - Logoband med metallkrok 25 mm' },
  ],

  // 152154604-347153 (1 products)
  '152154604-347153': [
    { id: '68be85e7094d08828df025c9', name: 'Sprinkle - Engångs regnponcho' },
  ],

  // 181607818-720704 (1 products)
  '181607818-720704': [
    { id: '68be85e8094d08828df02683', name: 'Logoband Screentryckta' },
  ],

  // 138905480-716654 (1 products)
  '138905480-716654': [
    { id: '68be85e8094d08828df02684', name: 'Festivalband PVC med tryck' },
  ],

  // 139069322-716708 (1 products)
  '139069322-716708': [
    { id: '68be85e8094d08828df0268e', name: 'Sytt Sadelskydd med tryck' },
  ],

  // 139555038-717499 (1 products)
  '139555038-717499': [
    { id: '68be85e8094d08828df0268f', name: 'Sadelskydd reflex med tryck' },
  ],

  // 139070484-716724 (1 products)
  '139070484-716724': [
    { id: '68be85e8094d08828df02691', name: 'Svetsat sadelskydd med tryck' },
  ],

  // 139380738-717255 (1 products)
  '139380738-717255': [
    { id: '68be85e8094d08828df02692', name: 'Korthållare silikon med putsduk' },
  ],

  // 137626118-947450 (1 products)
  '137626118-947450': [
    { id: '68be85e8094d08828df02697', name: 'Nyckelband med nyckelhållare' },
  ],

  // 138583606-948498 (1 products)
  '138583606-948498': [
    { id: '68be85e8094d08828df0269e', name: 'Regnponcho i plastboll med tryck' },
  ],

  // 138596388-948518 (1 products)
  '138596388-948518': [
    { id: '68be85e8094d08828df026a1', name: 'Cerat med solskyddsfaktor' },
  ],

  // 353740688-763296 (1 products)
  '353740688-763296': [
    { id: '68be85e8094d08828df026dd', name: 'DomeBadge Magnetiskt Badge' },
  ],

  // 152779760-348350 (1 products)
  '152779760-348350': [
    { id: '68be85e8094d08828df026f6', name: 'Werel - Ansiktsfärg röd/grön' },
  ],

  // 152806486-348411 (1 products)
  '152806486-348411': [
    { id: '68be85e8094d08828df026fc', name: 'Servitörskniv med logo' },
  ],

  // 319048016-1186204 (1 products)
  '319048016-1186204': [
    { id: '68be85e8094d08828df026fe', name: 'Perfect Men - PERFECT HERR Poique 180g' },
  ],

  // 319041044-922635 (1 products)
  '319041044-922635': [
    { id: '68be85e8094d08828df02703', name: 'Crusader Men - CRUSADER T-shirt för herrar' },
  ],

  // 152582220-450432 (1 products)
  '152582220-450432': [
    { id: '68be85e8094d08828df02711', name: 'Nimbus - Regnponcho i rund behållare' },
  ],

  // 137462276-947191 (1 products)
  '137462276-947191': [
    { id: '68be85e8094d08828df027c4', name: 'Bagagebricka med tryck' },
  ],

  // 137290300-946974 (1 products)
  '137290300-946974': [
    { id: '68be85e8094d08828df027c6', name: 'Kapsylöppnare Nyckelring med tryck' },
  ],

  // 139075132-716765 (1 products)
  '139075132-716765': [
    { id: '68be85e8094d08828df027c9', name: 'Sadelskydd PU med tryck' },
  ],

  // 138592902-948507 (1 products)
  '138592902-948507': [
    { id: '68be85e8094d08828df027cc', name: 'Billig regnponcho med tryck' },
  ],

  // 137283328-946950 (1 products)
  '137283328-946950': [
    { id: '68be85e8094d08828df027d3', name: 'Fickspegel med logo' },
  ],

  // 139072808-716744 (1 products)
  '139072808-716744': [
    { id: '68be85e8094d08828df027d7', name: 'Sadelskydd Nylon med tryck' },
  ],

  // 138598712-1199921 (1 products)
  '138598712-1199921': [
    { id: '68be85e8094d08828df027de', name: 'Uppblåsbar badboll med tryck' },
  ],

  // 164800650-376478 (1 products)
  '164800650-376478': [
    { id: '68be85e8094d08828df02847', name: 'Lips - Lypsyl' },
  ],

  // 152370736-347558 (1 products)
  '152370736-347558': [
    { id: '68be85e8094d08828df02848', name: 'Blado - Regnkappa med kapuchong' },
  ],

  // 152693772-348185 (1 products)
  '152693772-348185': [
    { id: '68be85e8094d08828df0284c', name: 'Bypro - Sadelskydd' },
  ],

  // 205743720-479092 (1 products)
  '205743720-479092': [
    { id: '68be85e8094d08828df0284d', name: 'Zip Lanyard - Logoband med Jojohållare' },
  ],

  // 164715824-376246 (1 products)
  '164715824-376246': [
    { id: '68be85e8094d08828df02854', name: 'Bagagebricka Aluminium med tryck' },
  ],

  // 152342848-375954 (1 products)
  '152342848-375954': [
    { id: '68be85e8094d08828df02860', name: 'Blabby - Kapsylöppnare' },
  ],

  // 153112092-349143 (1 products)
  '153112092-349143': [
    { id: '68be85e8094d08828df02864', name: 'Paper Medium - Papperspåse mellan 150 gr/m²' },
  ],

  // 319050340-1186209 (1 products)
  '319050340-1186209': [
    { id: '68be85e8094d08828df02865', name: 'Spring Ii - SPRING II HERR Pique 210g' },
  ],

  // 319030586-681000 (1 products)
  '319030586-681000': [
    { id: '68be85e8094d08828df02869', name: 'Sprint - SPRINT UNISEX T-SHIRT 130G' },
  ],

  // 319032910-681017 (1 products)
  '319032910-681017': [
    { id: '68be85e8094d08828df0286b', name: 'Pioneer Men - PIONEER HERR T-shirt 175g' },
  ],

  // 153041210-348922 (1 products)
  '153041210-348922': [
    { id: '68be85e8094d08828df0286d', name: 'Bagagebricka i plast med tryck' },
  ],

  // 557345166-1613529 (1 products)
  '557345166-1613529': [
    { id: '68be85e8094d08828df028d1', name: 'Platt metalliskt läppbalsam i hjärtform' },
  ],

  // 139506234-717436 (1 products)
  '139506234-717436': [
    { id: '68be85e8094d08828df028df', name: 'Reflexknapp 3M med tryck' },
  ],

  // 137587772-947358 (1 products)
  '137587772-947358': [
    { id: '68be85e8094d08828df028e7', name: 'Billig Stressboll med tryck' },
  ],

  // 182947604-879210 (1 products)
  '182947604-879210': [
    { id: '68be85e8094d08828df028ff', name: 'Logoband i bomull' },
  ],

  // 520359868-1428073 (1 products)
  '520359868-1428073': [
    { id: '68be85e8094d08828df02942', name: 'Recycled Leather Luggage Tag Bagagebrickorna' },
  ],

  // 4098374-8197 (1 products)
  '4098374-8197': [
    { id: '68be85e8094d08828df02950', name: 'Badboll med tryck' },
  ],

  // 296903782-615268 (1 products)
  '296903782-615268': [
    { id: '68be85e8094d08828df02953', name: 'Kampo - Tändare' },
  ],

  // 1677928-49712 (1 products)
  '1677928-49712': [
    { id: '68be85e8094d08828df0295d', name: 'Billig tändare med tryck' },
  ],

  // 93840796-234373 (1 products)
  '93840796-234373': [
    { id: '68be85e8094d08828df0296d', name: 'Korallrock 290g' },
  ],

  // 124064416-265042 (1 products)
  '124064416-265042': [
    { id: '68be85e8094d08828df02974', name: 'Velourbadrock 400g' },
  ],

  // 377914936-796935 (1 products)
  '377914936-796935': [
    { id: '68be85e8094d08828df0297a', name: 'Frottérock 450g' },
  ],

  // 449576638-960240 (1 products)
  '449576638-960240': [
    { id: '68be85e8094d08828df02987', name: 'Badrock Hamam' },
  ],

  // 152153442-347145 (1 products)
  '152153442-347145': [
    { id: '68be85e8094d08828df029b0', name: 'Regal - Regnponcho' },
  ],

  // 153041210-348918 (1 products)
  '153041210-348918': [
    { id: '68be85e8094d08828df029b3', name: 'Bagagebricka i plast med tryck' },
  ],

  // 153113254-349144 (1 products)
  '153113254-349144': [
    { id: '68be85e8094d08828df029b5', name: 'Paper Large - Papperspåse stor 150 gr/m²' },
  ],

  // 153727952-350519 (1 products)
  '153727952-350519': [
    { id: '68be85e8094d08828df029bb', name: 'Uv Gloss - Läppcerat/balsam med UV skydd' },
  ],

  // 205912210-479480 (1 products)
  '205912210-479480': [
    { id: '68be85e9094d08828df029f9', name: 'Frottérock 445g' },
  ],

  // 1676766-3290 (1 products)
  '1676766-3290': [
    { id: '68be85e9094d08828df02a78', name: 'Färgad Tändare med tryck' },
  ],

  // 5355658-11178 (1 products)
  '5355658-11178': [
    { id: '68be85e9094d08828df02a79', name: 'Mini Badboll med tryck' },
  ],

  // 1514086-3101 (1 products)
  '1514086-3101': [
    { id: '68be85e9094d08828df02a7d', name: 'Flasköppnare med tryck' },
  ],

  // 1758106-3408 (1 products)
  '1758106-3408': [
    { id: '68be85e9094d08828df02a7e', name: 'Tändare med egen logo' },
  ],

  // 67841046-108668 (1 products)
  '67841046-108668': [
    { id: '68be85e9094d08828df02a98', name: 'Elektronisk tändare med logo' },
  ],

  // 319013156-680927 (1 products)
  '319013156-680927': [
    { id: '68be85e9094d08828df02b06', name: 'Regent Fit - REGENT F HERR T-SHIRT 150g' },
  ],

  // 153690768-350459 (1 products)
  '153690768-350459': [
    { id: '68be85e9094d08828df02b1e', name: 'Uv Soft - Runt läpp cerat med UV skydd' },
  ],

  // 495939276-1198178 (1 products)
  '495939276-1198178': [
    { id: '68be85e9094d08828df02b22', name: 'Identifieringsväst "Leipzig"' },
  ],

  // 496039208-1198579 (1 products)
  '496039208-1198579': [
    { id: '68be85e9094d08828df02b38', name: 'Promo Specialväst "Sylt"' },
  ],

  // 182945280-879205 (1 products)
  '182945280-879205': [
    { id: '68be85e9094d08828df02b5d', name: 'Logoband Bambu' },
  ],

  // 67841046-108667 (1 products)
  '67841046-108667': [
    { id: '68be85e9094d08828df02bae', name: 'Elektronisk tändare med logo' },
  ],

  // 161737618-366562 (1 products)
  '161737618-366562': [
    { id: '68be85e9094d08828df02bb0', name: 'Tändare i plast med tryck' },
  ],

  // 319035234-681025 (1 products)
  '319035234-681025': [
    { id: '68be85e9094d08828df02c17', name: 'Planet Women - PLANET DAM Polo 170g' },
  ],

  // 153691930-350463 (1 products)
  '153691930-350463': [
    { id: '68be85e9094d08828df02c1e', name: 'Duo Mirror - läppcerat med spegel' },
  ],

  // 496025264-1198554 (1 products)
  '496025264-1198554': [
    { id: '68be85e9094d08828df02c37', name: 'Hi-Vis Vändbar Softshell Bodywarmer "Elbrus"' },
  ],

  // 137821334-947701 (1 products)
  '137821334-947701': [
    { id: '68be85e9094d08828df02c68', name: 'Isskrapa i plast med handtag' },
  ],

  // 210589260-949344 (1 products)
  '210589260-949344': [
    { id: '68be85e9094d08828df02c71', name: 'Logoband 2-i-1 Nyckelband i ABS Romario' },
  ],

  // 319031748-683870 (1 products)
  '319031748-683870': [
    { id: '68be85e9094d08828df02ce0', name: 'Epic - EPIC UNISEX T-SHIRT 140g' },
  ],

  // 210589260-949346 (1 products)
  '210589260-949346': [
    { id: '68be85e9094d08828df02cfd', name: 'Logoband 2-i-1 Nyckelband i ABS Romario' },
  ],

  // 137820172-947696 (1 products)
  '137820172-947696': [
    { id: '68be85e9094d08828df02d17', name: 'Isskrapa med handtag och eget tryck' },
  ],

  // 319034072-1186073 (1 products)
  '319034072-1186073': [
    { id: '68be85e9094d08828df02d77', name: 'Planet Men - PLANET HERR Pique 170g' },
  ],

  // 137586610-947355 (1 products)
  '137586610-947355': [
    { id: '68be85ea094d08828df02dab', name: 'Jonglerboll med logo' },
  ],

  // 182946442-879207 (1 products)
  '182946442-879207': [
    { id: '68be85ea094d08828df02dc1', name: 'Logoband Majs' },
  ],

  // 319022452-1186055 (1 products)
  '319022452-1186055': [
    { id: '68be85ea094d08828df02e0e', name: 'Wave Men - WAVE MEN väst' },
  ],

  // 495627860-1194822 (1 products)
  '495627860-1194822': [
    { id: '68be85ea094d08828df02e1f', name: 'River bagagebricka med fönster av återvunnet material' },
  ],

  // 551408508-1211228 (1 products)
  '551408508-1211228': [
    { id: '68be85ea094d08828df02e9b', name: 'IQONIQ Sierra lättvikt t-shirt i återvunnen bomull' },
  ],

  // 551410832-1468849 (1 products)
  '551410832-1468849': [
    { id: '68be85ea094d08828df02e9c', name: 'IQONIQ Brett t-shirt i återvunnen bomull' },
  ],

  // 551411994-962514 (1 products)
  '551411994-962514': [
    { id: '68be85ea094d08828df02e9d', name: 'IQONIQ Yosemite pikétröja i återvunnen bomull' },
  ],

  // 551403860-1054042 (1 products)
  '551403860-1054042': [
    { id: '68be85ea094d08828df02ea2', name: 'IQONIQ Bryce t-shirt i återvunnen bomull' },
  ],

  // 551409670-1291063 (1 products)
  '551409670-1291063': [
    { id: '68be85ea094d08828df02ea4', name: 'IQONIQ Teide t-shirt i återvunnen bomull' },
  ],

  // 551407346-1211216 (1 products)
  '551407346-1211216': [
    { id: '68be85ea094d08828df02ea5', name: 'IQONIQ Kakadu relaxed t-shirt i återvunnen bomull' },
  ],

  // 551405022-962502 (1 products)
  '551405022-962502': [
    { id: '68be85ea094d08828df02eb1', name: 'IQONIQ Manuel t-shirt i återvunnen ofärgad bomull' },
  ],

  // 551406184-1684523 (1 products)
  '551406184-1684523': [
    { id: '68be85ea094d08828df02eb2', name: 'IQONIQ Tikal quick-dry sport t-shirt i återvunnen polyester' },
  ],

  // 583343754-1759398 (1 products)
  '583343754-1759398': [
    { id: '68be85ea094d08828df02ebb', name: 'IQONIQ Nikko t-shirt i tung återvunnen bomull' },
  ],

  // 495512822-1194518 (1 products)
  '495512822-1194518': [
    { id: '68be85ea094d08828df02ec7', name: 'Adony läppbalsam' },
  ],

  // 139503910-717432 (1 products)
  '139503910-717432': [
    { id: '68be85ea094d08828df02ee5', name: 'Bagagebricka Reflex med tryck' },
  ],

  // 319023614-680965 (1 products)
  '319023614-680965': [
    { id: '68be85ea094d08828df02f4c', name: 'Wave Women - WAVE DAM VÄST' },
  ],

  // 139029814-716685 (1 products)
  '139029814-716685': [
    { id: '68be85eb094d08828df0308c', name: 'Applådstavar, Bang Bang Applådstavar' },
  ],

  // 139029814-716684 (1 products)
  '139029814-716684': [
    { id: '68be85eb094d08828df03129', name: 'Applådstavar, Bang Bang Applådstavar' },
  ],

  // 548379174-1578776 (1 products)
  '548379174-1578776': [
    { id: '68be85eb094d08828df03163', name: 'Ero läppbalsam' },
  ],

  // 548376850-1578768 (1 products)
  '548376850-1578768': [
    { id: '68be85eb094d08828df0316f', name: 'Elena läppbalsam' },
  ],

};

// Example usage:
// 1. First, get your subcategory IDs from the database
// 2. Then run updates like:
/*
for (const [subcategoryName, products] of Object.entries(updates)) {
  const subcategoryId = getSubcategoryIdByName(subcategoryName);
  if (subcategoryId) {
    const productIds = products.map(p => p.id);
    db.products.updateMany(
      { _id: { $in: productIds } },
      { $set: { subcategoryId: subcategoryId, subcategory: subcategoryId } }
    );
  }
}
*/
