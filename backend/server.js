const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultDB = {
    profile: {
        name: "Bala Player",
        level: 1,
        xp: 0,
        coins: 500,
        divineEnergy: 100,
        victories: 0,
        asurasDefeated: 0,
        levelsCompleted: 0,
        currentWeapon: "Divine Axe",
        currentSkin: "Classic Bala Vinayaka"
    },

    settings: {
        sound: true,
        music: true
    },

    weapons: [
        {
            id: 1,
            name: "Divine Axe",
            damage: 120,
            speed: "Medium",
            range: "Medium",
            unlocked: true,
            requiredLevel: 1
        },
        {
            id: 2,
            name: "Sacred Mace",
            damage: 150,
            speed: "Slow",
            range: "Short",
            unlocked: false,
            requiredLevel: 2
        },
        {
            id: 3,
            name: "Divine Vajra",
            damage: 180,
            speed: "Medium",
            range: "Long",
            unlocked: false,
            requiredLevel: 4
        }
    ],

    skills: [
        {
            id: 1,
            name: "Divine Strike",
            damage: 220,
            energy: 20,
            cooldown: 5,
            unlocked: true,
            requiredLevel: 1
        },
        {
            id: 2,
            name: "Divine Shield",
            damage: 0,
            energy: 25,
            cooldown: 8,
            unlocked: false,
            requiredLevel: 2
        },
        {
            id: 3,
            name: "Ganesha Dash",
            damage: 100,
            energy: 20,
            cooldown: 6,
            unlocked: false,
            requiredLevel: 3
        },
        {
            id: 4,
            name: "Elephant Strength",
            damage: 300,
            energy: 35,
            cooldown: 10,
            unlocked: false,
            requiredLevel: 4
        },
        {
            id: 5,
            name: "Modak Power",
            damage: 0,
            energy: 15,
            cooldown: 12,
            unlocked: false,
            requiredLevel: 5
        },
        {
            id: 6,
            name: "Divine Ultimate",
            damage: 500,
            energy: 60,
            cooldown: 20,
            unlocked: false,
            requiredLevel: 5
        }
    ],

    skins: [
        {
            id: 1,
            name: "Classic Bala Vinayaka",
            requiredLevel: 1,
            unlocked: true
        },
        {
            id: 2,
            name: "Warrior Bala",
            requiredLevel: 2,
            unlocked: false
        },
        {
            id: 3,
            name: "Royal Bala",
            requiredLevel: 3,
            unlocked: false
        },
        {
            id: 4,
            name: "Golden Bala",
            requiredLevel: 4,
            unlocked: false
        },
        {
            id: 5,
            name: "Festival Bala",
            requiredLevel: 5,
            unlocked: false
        },
        {
            id: 6,
            name: "Divine Bala",
            requiredLevel: 6,
            unlocked: false
        }
    ],

    levels: [
        {
            id: 1,
            name: "The First Asura",
            asura: "Forest Asura",
            hp: 2000,
            damage: 70,
            difficulty: "Easy",
            xpReward: 250,
            coinReward: 500
        },
        {
            id: 2,
            name: "Rising Demon",
            asura: "Rising Asura",
            hp: 1000,
            damage: 90,
            difficulty: "Normal",
            xpReward: 400,
            coinReward: 700
        },
        {
            id: 3,
            name: "Fierce Guardian",
            asura: "Guardian Asura",
            hp: 2000,
            damage: 110,
            difficulty: "Hard",
            xpReward: 600,
            coinReward: 1000
        },
        {
            id: 4,
            name: "Ancient Warrior",
            asura: "Warrior Asura",
            hp: 2000,
            damage: 135,
            difficulty: "Very Hard",
            xpReward: 850,
            coinReward: 1400
        },
        {
            id: 5,
            name: "Asura Boss",
            asura: "Mahabala Asura",
            hp: 2000,
            damage: 170,
            difficulty: "Boss",
            xpReward: 1200,
            coinReward: 2000
        }
    ]
};

function loadDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(
                DB_FILE,
                JSON.stringify(defaultDB, null, 2)
            );
        }

        return JSON.parse(
            fs.readFileSync(DB_FILE, "utf8")
        );
    } catch (error) {
        console.error("Database error:", error);
        return JSON.parse(JSON.stringify(defaultDB));
    }
}

function saveDB(db) {
    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(db, null, 2)
    );
}

function calculateLevel(xp) {
    if (xp >= 5000) return 6;
    if (xp >= 3500) return 5;
    if (xp >= 2200) return 4;
    if (xp >= 1200) return 3;
    if (xp >= 500) return 2;
    return 1;
}

/* ---------------- HEALTH ---------------- */

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Bala Vinayaka backend is running"
    });
});

/* ---------------- PROFILE ---------------- */

app.get("/api/profile", (req, res) => {
    const db = loadDB();

    res.json({
        success: true,
        profile: db.profile
    });
});

app.put("/api/profile", (req, res) => {
    const db = loadDB();

    db.profile = {
        ...db.profile,
        ...req.body
    };

    saveDB(db);

    res.json({
        success: true,
        profile: db.profile
    });
});

/* ---------------- WEAPONS ---------------- */

app.get("/api/weapons", (req, res) => {
    const db = loadDB();

    res.json({
        success: true,
        weapons: db.weapons
    });
});

/* ---------------- SKILLS ---------------- */

app.get("/api/skills", (req, res) => {
    const db = loadDB();

    res.json({
        success: true,
        skills: db.skills
    });
});

/* ---------------- SKINS ---------------- */

app.get("/api/skins", (req, res) => {
    const db = loadDB();

    res.json({
        success: true,
        skins: db.skins
    });
});

/* ---------------- LEVELS ---------------- */

app.get("/api/levels", (req, res) => {
    const db = loadDB();

    res.json({
        success: true,
        levels: db.levels
    });
});

app.get("/api/levels/:id", (req, res) => {
    const db = loadDB();

    const id = Number(req.params.id);

    const level = db.levels.find(
        item => item.id === id
    );

    if (!level) {
        return res.status(404).json({
            success: false,
            message: "Level not found"
        });
    }

    res.json({
        success: true,
        level
    });
});

/* ---------------- START GAME ---------------- */

app.post("/api/game/start", (req, res) => {
    const db = loadDB();

    const requestedLevel =
        Number(req.body.level) || db.profile.level;

    const level =
        db.levels.find(
            item => item.id === requestedLevel
        ) || db.levels[0];

    const weapon =
        db.weapons.find(
            item =>
                item.name ===
                db.profile.currentWeapon
        ) || db.weapons[0];

    res.json({
        success: true,

        battle: {
            level: level.id,
            title: level.name,

            player: {
                name: "Bala Vinayaka",
                hp: 1000,
                maxHp: 1000,
                weapon: weapon.name,
                weaponDamage: weapon.damage
            },

            enemy: {
                name: level.asura,
                hp: level.hp,
                maxHp: level.hp,
                damage: level.damage
            },

            rewards: {
                xp: level.xpReward,
                coins: level.coinReward
            }
        }
    });
});

/* ---------------- GAME RESULT ---------------- */

app.post("/api/game/result", (req, res) => {
    const db = loadDB();

    const {
        victory,
        level = db.profile.level
    } = req.body;

    const currentLevel =
        db.levels.find(
            item => item.id === Number(level)
        ) || db.levels[0];

    if (victory) {

        db.profile.victories += 1;

        db.profile.asurasDefeated += 1;

        db.profile.levelsCompleted += 1;

        db.profile.xp += currentLevel.xpReward;

        db.profile.coins += currentLevel.coinReward;

        db.profile.divineEnergy = Math.min(
            100,
            db.profile.divineEnergy + 20
        );

        db.profile.level =
            calculateLevel(db.profile.xp);

        db.weapons.forEach(weapon => {
            if (
                db.profile.level >=
                weapon.requiredLevel
            ) {
                weapon.unlocked = true;
            }
        });

        db.skills.forEach(skill => {
            if (
                db.profile.level >=
                skill.requiredLevel
            ) {
                skill.unlocked = true;
            }
        });

        db.skins.forEach(skin => {
            if (
                db.profile.level >=
                skin.requiredLevel
            ) {
                skin.unlocked = true;
            }
        });

    } else {

        db.profile.divineEnergy =
            Math.max(
                0,
                db.profile.divineEnergy - 10
            );
    }

    saveDB(db);

    res.json({
        success: true,
        profile: db.profile,
        message: victory
            ? "Victory recorded"
            : "Defeat recorded"
    });
});

/* ---------------- SELECT WEAPON ---------------- */

app.post("/api/select/weapon", (req, res) => {
    const db = loadDB();

    const weapon = db.weapons.find(
        item => item.name === req.body.name
    );

    if (!weapon) {
        return res.status(404).json({
            success: false,
            message: "Weapon not found"
        });
    }

    if (!weapon.unlocked) {
        return res.status(400).json({
            success: false,
            message: "Weapon is locked"
        });
    }

    db.profile.currentWeapon =
        weapon.name;

    saveDB(db);

    res.json({
        success: true,
        currentWeapon: weapon.name
    });
});

/* ---------------- SELECT SKIN ---------------- */

app.post("/api/select/skin", (req, res) => {
    const db = loadDB();

    const skin = db.skins.find(
        item => item.name === req.body.name
    );

    if (!skin) {
        return res.status(404).json({
            success: false,
            message: "Skin not found"
        });
    }

    if (!skin.unlocked) {
        return res.status(400).json({
            success: false,
            message: "Skin is locked"
        });
    }

    db.profile.currentSkin =
        skin.name;

    saveDB(db);

    res.json({
        success: true,
        currentSkin: skin.name
    });
});

/* ---------------- SETTINGS ---------------- */

app.post("/api/settings", (req, res) => {
    const db = loadDB();

    db.settings = {
        ...db.settings,
        ...req.body
    };

    saveDB(db);

    res.json({
        success: true,
        settings: db.settings
    });
});

/* ---------------- RESET ---------------- */

app.post("/api/reset", (req, res) => {
    saveDB(
        JSON.parse(
            JSON.stringify(defaultDB)
        )
    );

    res.json({
        success: true,
        message: "Game data reset"
    });
});

/* ---------------- 404 ---------------- */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
    console.log("");
    console.log("=================================");
    console.log(" BALA VINAYAKA BACKEND");
    console.log("=================================");
    console.log(
        `Server running at http://localhost:${PORT}`
    );
    console.log(
        `Health: http://localhost:${PORT}/api/health`
    );
    console.log("=================================");
    console.log("");
});