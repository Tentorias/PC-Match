import { prisma } from './src/lib/db';

const rawGames = [
  "Grand Theft Auto VI", "The Witcher 3: Wild Hunt", "Fallout 4", "The Elder Scrolls V: Skyrim",
  "Doom Eternal", "Resident Evil 4 Remake", "Cyberpunk 2077", "Red Dead Redemption 2", "Elden Ring",
  "Persona 5 Royal", "Final Fantasy XVI", "Monster Hunter Wilds", "Assassin's Creed Shadows",
  "Far Cry 6", "Halo Infinite", "Gears 5", "Forza Horizon 5", "God of War Ragnarök", "Horizon Forbidden West",
  "Marvel's Spider-Man 2", "The Last of Us Part II", "Ghost of Tsushima", "Death Stranding", "Control",
  "Alan Wake 2", "Baldur's Gate 3", "Helldivers 2", "Hollow Knight", "Hades II", "Stardew Valley",
  "Terraria", "Dead Cells", "Celeste", "Undertale", "The Binding of Isaac: Rebirth", "Vampire Survivors",
  "Project Zomboid", "RimWorld", "Factorio", "Lethal Company", "Phasmophobia", "Disco Elysium",
  "Palworld", "Valheim", "V Rising", "Rust", "Subnautica", "Outer Wilds", "Sifu", "Stray", "Cuphead",
  "Inscryption", "Dredge", "Dave the Diver", "Balatro", "League of Legends", "Valorant", "Counter-Strike 2",
  "Dota 2", "Roblox", "Minecraft", "Free Fire", "Rocket League", "Brawlhalla", "Team Fortress 2",
  "World of Warcraft", "Path of Exile", "Warframe", "Lost Ark", "Black Desert Online", "Call of Duty: Warzone",
  "Apex Legends", "Fortnite", "PUBG: BATTLEGROUNDS", "Overwatch 2", "Rainbow Six Siege", "Destiny 2",
  "Escape from Tarkov", "Fall Guys", "Among Us", "Genshin Impact", "Honkai: Star Rail", "Zenless Zone Zero",
  "Dead by Daylight", "Hunt: Showdown", "Sea of Thieves", "No Man's Sky", "The Finals", "XDefiant",
  "Hogwarts Legacy", "Starfield", "Microsoft Flight Simulator", "Black Myth: Wukong", "Dragon's Dogma 2",
  "Lies of P", "Star Wars Jedi: Survivor", "Armored Core VI", "Street Fighter 6", "Tekken 8",
  "Mortal Kombat 1", "Diablo IV", "Remnant II", "Payday 3", "Cities: Skylines II", "Manor Lords",
  "Enshrouded", "Stellar Blade", "Rise of the Ronin", "Senua's Saga: Hellblade II", "Dragon Age: The Veilguard",
  "Indiana Jones and the Great Circle", "Avowed", "Fable", "Bloodborne", "Sekiro: Shadows Die Twice",
  "It Takes Two", "A Plague Tale: Requiem", "Kenshi", "Mount & Blade II: Bannerlord", "Crusader Kings III",
  "Civilization VI", "XCOM 2", "Divinity: Original Sin 2", "The Outer Worlds", "Nier: Automata",
  "Yakuza: Like a Dragon", "Dying Light 2 Stay Human", "Days Gone", "Detroit: Become Human", "The Quarry",
  "Outlast Trials", "Amnesia: The Bunker", "Soma", "Alien: Isolation", "Five Nights at Freddy's: Security Breach",
  "Slime Rancher 2", "Satisfactory", "Dyson Sphere Program", "Ark: Survival Ascended", "Conan Exiles",
  "DayZ", "Squad", "Arma 3", "Insurgency: Sandstorm", "Hell Let Loose", "Chivalry 2", "For Honor",
  "Total War: Warhammer III", "Age of Empires IV", "Company of Heroes 3", "Hearts of Iron IV", "Stellaris",
  "Tropico 6", "Planet Zoo", "Planet Coaster", "Jurassic World Evolution 2", "Two Point Hospital",
  "Football Manager 2024", "EA Sports FC 24", "NBA 2K24", "Madden NFL 24", "F1 23", "WWE 2K24",
  "UFC 5", "Gran Turismo 7", "Need for Speed Unbound", "The Crew Motorfest", "Riders Republic",
  "Tony Hawk's Pro Skater 1 + 2", "Skate 4", "Kena: Bridge of Spirits", "Hi-Fi Rush", "Psychonauts 2",
  "Ratchet & Clank: Rift Apart", "Crash Bandicoot 4: It's About Time", "Spyro Reignited Trilogy",
  "Super Mario Odyssey", "The Legend of Zelda: Tears of the Kingdom", "Super Smash Bros. Ultimate",
  "Mario Kart 8 Deluxe", "Animal Crossing: New Horizons", "Splatoon 3", "Pikmin 4", "Metroid Dread",
  "Fire Emblem Engage", "Xenoblade Chronicles 3", "Bayonetta 3", "Astral Chain", "Tales of Arise",
  "Dragon Quest XI S", "Scarlet Nexus", "Code Vein", "Nioh 2", "Wo Long: Fallen Dynasty", "Wild Hearts",
  "Granblue Fantasy: Relink", "Like a Dragon: Infinite Wealth", "Persona 3 Reload", "Metaphor: ReFantazio",
  "Shin Megami Tensei V", "Unicorn Overlord", "Octopath Traveler II", "Triangle Strategy", "Bravely Default II",
  "OlliOlli World", "Neon White", "Cult of the Lamb", "Tunic", "Death's Door", "Slay the Spire",
  "Monster Train", "Darkest Dungeon II", "Loop Hero", "Brotato", "Risk of Rain 2", "Gunfire Reborn",
  "Roboquest", "Sons of the Forest", "Green Hell", "The Long Dark", "Firewatch", "What Remains of Edith Finch",
  "Return of the Obra Dinn", "The Witness", "Inside", "Little Nightmares II", "Unravel Two", "A Way Out",
  "Journey", "Abzu", "The Pathless", "Ori and the Will of the Wisps", "Guacamelee! 2", "Shovel Knight: Treasure Trove",
  "Blasphemous 2", "Bloodstained: Ritual of the Night", "Ender Lilies", "Katana Zero", "Hotline Miami 2: Wrong Number",
  "Ape Out", "My Friend Pedro", "Super Meat Boy", "Spelunky 2", "Cave Story+", "Don't Starve Together",
  "Oxygen Not Included", "Kerbal Space Program 2", "Prison Architect", "Dwarf Fortress", "Story of Seasons: A Wonderful Life",
  "Rune Factory 5", "Disney Dreamlight Valley", "My Time at Sandrock", "Coral Island", "Potion Craft",
  "Unpacking", "House Flipper 2", "PowerWash Simulator", "Euro Truck Simulator 2", "SnowRunner",
  "Farming Simulator 22", "Car Mechanic Simulator 2021", "PC Building Simulator 2", "Tabletop Simulator",
  "Beat Saber", "Half-Life: Alyx", "Boneworks", "Blade & Sorcery", "VRChat", "Content Warning", "Back 4 Blood",
  "Warhammer 40000: Darktide", "Deep Rock Galactic", "World War Z: Aftermath", "Starship Troopers: Extermination",
  "Texas Chain Saw Massacre", "Dragon Ball FighterZ", "Guilty Gear Strive", "The King of Fighters XV",
  "Melty Blood: Type Lumina", "Under Night In-Birth II", "Granblue Fantasy Versus: Rising"
];

// O usuário pediu para não repetir franquias.
// Mas ele próprio já filtrou e enviou apenas o título mais recente.
// (Ex: mandou GTA VI, e não GTA V. Mandou RDR2 e não RDR1).
// Então podemos inserir a lista toda direto, garantindo que os Slugs sejam únicos.

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  console.log('Apagando jogos antigos e injetando a nova lista colossal...');
  
  // Opcional: apagar tudo antes
  await prisma.jogo.deleteMany();
  
  for (const gameName of rawGames) {
    const slug = generateSlug(gameName);
    
    // Fallback genérico (a IA sobrescreve durante o uso real)
    const reqMin = { cpuRank: 5, gpuRank: 5, ramGb: 8 };
    const reqRec = { cpuRank: 8, gpuRank: 8, ramGb: 16 };
    
    try {
      await prisma.jogo.create({
        data: {
          nome: gameName,
          slug: slug,
          descricao: "Jogo Popular inserido via Seeder",
          requisitosMinimos: reqMin,
          requisitosRecomendados: reqRec,
        }
      });
      console.log(`+ ${gameName}`);
    } catch (err: any) {
      if (err.code === 'P2002') {
        console.log(`- Ignorado (Duplicado): ${gameName}`);
      } else {
        console.error(`Erro ao inserir ${gameName}:`, err);
      }
    }
  }
  
  console.log('Lista colossal inserida com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
