const API = "http://localhost:3000/api";


/* ================= ELEMENTS ================= */

const mainMenu =
    document.getElementById("mainMenu");

const loadingScreen =
    document.getElementById("loadingScreen");

const gameScreen =
    document.getElementById("gameScreen");

const ganeshaImage =
    document.getElementById("ganeshaImage");

const infoPanel =
    document.getElementById("infoPanel");

const infoTitle =
    document.getElementById("infoTitle");

const infoText =
    document.getElementById("infoText");

const closeInfo =
    document.getElementById("closeInfo");

const startButton =
    document.getElementById("startButton");

const profileButton =
    document.getElementById("profileButton");

const weaponsButton =
    document.getElementById("weaponsButton");

const skillsButton =
    document.getElementById("skillsButton");

const skinsButton =
    document.getElementById("skinsButton");

const othersButton =
    document.getElementById("othersButton");

const soundButton =
    document.getElementById("soundButton");

const musicButton =
    document.getElementById("musicButton");

const settingsButton =
    document.getElementById("settingsButton");

const loadingProgress =
    document.getElementById("loadingProgress");

const loadingPercent =
    document.getElementById("loadingPercent");

const battleMessage =
    document.getElementById("battleMessage");

const battleLevelTitle =
    document.getElementById("battleLevelTitle");

const battleEnergy =
    document.getElementById("battleEnergy");

const playerHealth =
    document.getElementById("playerHealth");

const enemyHealth =
    document.getElementById("enemyHealth");

const playerHpText =
    document.getElementById("playerHpText");

const enemyHpText =
    document.getElementById("enemyHpText");

const attackButton =
    document.getElementById("attackButton");

const skillButton =
    document.getElementById("skillButton");

const defendButton =
    document.getElementById("defendButton");

const dodgeButton =
    document.getElementById("dodgeButton");

const backButton =
    document.getElementById("backButton");

const battlePlayer =
    document.getElementById("battlePlayer");

const battleEnemy =
    document.getElementById("battleEnemy");


/* ================= GAME DATA ================= */

let profile = null;

let weapons = [];

let skills = [];

let skins = [];

let levels = [];

let currentBattle = null;


let playerMaxHP = 200;

let enemyHP = 200;



let divineEnergy = 100;

let playerDefending = false;

let playerDodging = false;

let gameOver = false;

let enemyAttackTimer = null;

let soundEnabled = true;

let musicEnabled = true;


/* ================= API ================= */

async function apiRequest(
    endpoint,
    options = {}
) {

    try {

        const response =
            await fetch(
                API + endpoint,
                {
                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    ...options
                }
            );

        if (!response.ok) {

            const error =
                await response.json()
                    .catch(() => ({}));

            throw new Error(
                error.message ||
                "API request failed"
            );
        }

        return await response.json();

    } catch (error) {

        console.error(
            "Backend error:",
            error
        );

        showMessage(
            "Backend connection problem."
        );

        throw error;
    }
}


/* ================= INITIALIZE ================= */

async function initializeGame() {

    console.log(
        "Bala Vinayaka starting..."
    );

    try {

        const health =
            await apiRequest(
                "/health"
            );

        console.log(
            health.message
        );

        await loadProfile();

        await loadGameData();

        console.log(
            "Game initialized."
        );

    } catch (error) {

        console.error(
            "Initialization failed:",
            error
        );

        showMessage(
            "Backend is not connected."
        );
    }
}


/* ================= PROFILE ================= */

async function loadProfile() {

    const data =
        await apiRequest(
            "/profile"
        );

    profile =
        data.profile;

    divineEnergy =
        profile.divineEnergy;

    soundEnabled = true;

    musicEnabled = true;

    console.log(
        "Profile:",
        profile
    );
}


/* ================= GAME DATA ================= */

async function loadGameData() {

    const [
        weaponData,
        skillData,
        skinData,
        levelData
    ] = await Promise.all([

        apiRequest("/weapons"),

        apiRequest("/skills"),

        apiRequest("/skins"),

        apiRequest("/levels")

    ]);

    weapons =
        weaponData.weapons;

    skills =
        skillData.skills;

    skins =
        skinData.skins;

    levels =
        levelData.levels;
}


/* ================= MESSAGE ================= */

function showMessage(message) {

    if (!battleMessage) {
        return;
    }

    battleMessage.textContent =
        message;
}


/* ================= LOADING ================= */

async function startLoading() {

    mainMenu.classList.remove(
        "active"
    );

    gameScreen.classList.remove(
        "active"
    );

    loadingScreen.classList.add(
        "active"
    );

    let progress = 0;

    loadingProgress.style.width =
        "0%";

    loadingPercent.textContent =
        "0%";

    const timer =
        setInterval(() => {

            progress += 2;

            if (progress > 100) {
                progress = 100;
            }

            loadingProgress.style.width =
                progress + "%";

            loadingPercent.textContent =
                progress + "%";

            if (progress >= 100) {

                clearInterval(timer);

                setTimeout(() => {

                    startBattleFromBackend();

                }, 500);
            }

        }, 35);
}


/* ================= START BATTLE ================= */

async function startBattleFromBackend() {

    try {

        const level =
            profile
                ? profile.level
                : 1;

        const data =
            await apiRequest(
                "/game/start",
                {
                    method: "POST",

                    body: JSON.stringify({
                        level
                    })
                }
            );

        currentBattle =
            data.battle;

        playerMaxHP =
            currentBattle.player.maxHp;

        playerHP =
            currentBattle.player.hp;

        enemyMaxHP =
            currentBattle.enemy.maxHp;

        enemyHP =
            currentBattle.enemy.hp;

        divineEnergy =
            profile.divineEnergy;

        gameOver = false;

        playerDefending = false;

        playerDodging = false;

        battleLevelTitle.textContent =
            currentBattle.title
                .toUpperCase();

        updateHealthBars();

        battleEnergy.textContent =
            divineEnergy;

        loadingScreen.classList.remove(
            "active"
        );

        gameScreen.classList.add(
            "active"
        );

        showMessage(
            "The battle begins!"
        );

        startEnemyAI();

    } catch (error) {

        console.error(
            error
        );

        backToMenu();
    }
}


/* ================= HEALTH ================= */

function updateHealthBars() {

    const playerPercent =
        Math.max(
            0,
            playerHP /
                playerMaxHP *
                100
        );

    const enemyPercent =
        Math.max(
            0,
            enemyHP /
                enemyMaxHP *
                100
        );

    playerHealth.style.width =
        playerPercent + "%";

    enemyHealth.style.width =
        enemyPercent + "%";

    playerHpText.textContent =
        `${Math.max(
            0,
            Math.ceil(playerHP)
        )} / ${playerMaxHP}`;

    enemyHpText.textContent =
        `${Math.max(
            0,
            Math.ceil(enemyHP)
        )} / ${enemyMaxHP}`;

    battleEnergy.textContent =
        divineEnergy;
}


/* ================= NORMAL ATTACK ================= */

function playerAttack() {

    if (gameOver) {
        return;
    }

    playerDefending = false;

    const weapon =
        weapons.find(
            item =>
                item.name ===
                profile.currentWeapon
        ) || weapons[0];

    const damage =
        weapon.damage;

    enemyHP =
        Math.max(
            0,
            enemyHP - damage
        );

    showMessage(
        `Divine Axe strike! -${damage} HP`
    );

    animatePlayerAttack();

    updateHealthBars();

    if (enemyHP <= 0) {

        enemyDefeated();

        return;
    }

    setTimeout(() => {

        enemyAttack();

    }, 800);
}


/* ================= DIVINE STRIKE ================= */

function divineStrike() {

    if (gameOver) {
        return;
    }

    const skill =
        skills.find(
            item =>
                item.name ===
                "Divine Strike"
        );

    if (!skill) {
        return;
    }

    if (!skill.unlocked) {

        showMessage(
            "Divine Strike is locked."
        );

        return;
    }

    if (
        divineEnergy <
        skill.energy
    ) {

        showMessage(
            "Not enough Divine Energy!"
        );

        return;
    }

    divineEnergy -=
        skill.energy;

    enemyHP =
        Math.max(
            0,
            enemyHP - skill.damage
        );

    showMessage(
        `DIVINE STRIKE! -${skill.damage} HP`
    );

    animateSkill();

    updateHealthBars();

    if (enemyHP <= 0) {

        enemyDefeated();

        return;
    }

    setTimeout(() => {

        enemyAttack();

    }, 1000);
}


/* ================= DEFEND ================= */

function defend() {

    if (gameOver) {
        return;
    }

    playerDefending = true;

    showMessage(
        "Bala raises the Divine Shield!"
    );

    battlePlayer.style.transform =
        "scale(1.08)";

    setTimeout(() => {

        battlePlayer.style.transform =
            "";

    }, 500);

    setTimeout(() => {

        enemyAttack();

    }, 700);
}


/* ================= DODGE ================= */

function dodge() {

    if (gameOver) {
        return;
    }

    playerDodging = true;

    showMessage(
        "Bala dodges the attack!"
    );

    battlePlayer.style.transform =
        "translateX(-45px)";

    setTimeout(() => {

        battlePlayer.style.transform =
            "";

        playerDodging = false;

    }, 500);

    setTimeout(() => {

        enemyAttack();

    }, 800);
}


/* ================= ENEMY AI ================= */

function startEnemyAI() {

    clearInterval(
        enemyAttackTimer
    );

    enemyAttackTimer =
        setInterval(() => {

            if (gameOver) {
                return;
            }

            if (
                Math.random() <
                0.45
            ) {

                enemyAttack();

            }

        }, 3500);
}


/* ================= ENEMY ATTACK ================= */

function enemyAttack() {

    if (gameOver) {
        return;
    }

    if (playerDodging) {

        showMessage(
            "The Asura missed!"
        );

        return;
    }

    const damage =
        currentBattle.enemy.damage;

    if (playerDefending) {

        const reducedDamage =
            Math.floor(
                damage * 0.35
            );

        playerHP =
            Math.max(
                0,
                playerHP -
                reducedDamage
            );

        playerDefending = false;

        showMessage(
            `Shield blocked most damage! -${reducedDamage}`
        );

    } else {

        playerHP =
            Math.max(
                0,
                playerHP - damage
            );

        showMessage(
            `Asura attacks! -${damage} HP`
        );
    }

    animateEnemyAttack();

    updateHealthBars();

    if (playerHP <= 0) {

        playerDefeated();
    }
}


/* ================= PLAYER DEFEATED ================= */

async function playerDefeated() {

    if (gameOver) {
        return;
    }

    gameOver = true;

    clearInterval(
        enemyAttackTimer
    );

    showMessage(
        "Bala Vinayaka has been defeated..."
    );

    try {

        await apiRequest(
            "/game/result",
            {
                method: "POST",

                body: JSON.stringify({
                    victory: false,

                    level:
                        currentBattle.level
                })
            }
        );

    } catch (error) {
        console.error(error);
    }

    setTimeout(() => {

        alert(
            "DEFEAT\n\nThe Asura wins this battle."
        );

        backToMenu();

    }, 500);
}


/* ================= ENEMY DEFEATED ================= */

async function enemyDefeated() {

    if (gameOver) {
        return;
    }

    gameOver = true;

    clearInterval(
        enemyAttackTimer
    );

    enemyHP = 0;

    updateHealthBars();

    showMessage(
        "✦ ASURA DEFEATED! ✦"
    );

    try {

        const data =
            await apiRequest(
                "/game/result",
                {
                    method: "POST",

                    body: JSON.stringify({
                        victory: true,

                        level:
                            currentBattle.level
                    })
                }
            );

        profile =
            data.profile;

        divineEnergy =
            profile.divineEnergy;

    } catch (error) {

        console.error(error);
    }

    setTimeout(() => {

        alert(
            `VICTORY!\n\n` +
            `XP: +${currentBattle.rewards.xp}\n` +
            `Coins: +${currentBattle.rewards.coins}\n\n` +
            `Current Level: ${profile.level}`
        );

        backToMenu();

    }, 800);
}


/* ================= PLAYER ANIMATION ================= */

function animatePlayerAttack() {

    battlePlayer.style.transform =
        "translateX(35px) scale(1.08)";

    setTimeout(() => {

        battlePlayer.style.transform =
            "";

    }, 300);
}


/* ================= SKILL ANIMATION ================= */

function animateSkill() {

    battlePlayer.style.transform =
        "scale(1.25)";

    battleEnemy.style.transform =
        "scale(0.8)";

    battleEnemy.style.filter =
        "drop-shadow(0 0 35px gold)";

    setTimeout(() => {

        battlePlayer.style.transform =
            "";

        battleEnemy.style.transform =
            "";

        battleEnemy.style.filter =
            "";

    }, 600);
}


/* ================= ENEMY ANIMATION ================= */

function animateEnemyAttack() {

    battleEnemy.style.transform =
        "translateX(-30px) scale(1.1)";

    setTimeout(() => {

        battleEnemy.style.transform =
            "";

    }, 300);
}


/* ================= BACK MENU ================= */

function backToMenu() {

    clearInterval(
        enemyAttackTimer
    );

    gameOver = true;

    gameScreen.classList.remove(
        "active"
    );

    loadingScreen.classList.remove(
        "active"
    );

    mainMenu.classList.add(
        "active"
    );

    loadProfile()
        .catch(() => {});

    showMessage(
        "The battle begins!"
    );
}


/* ================= PROFILE PANEL ================= */

async function showProfile() {

    await loadProfile();

    infoTitle.textContent =
        "PROFILE";

    infoText.innerHTML = `

        <div class="card">
            <strong>Name</strong><br>
            ${profile.name}
        </div>

        <div class="card">
            <strong>Level</strong><br>
            ${profile.level}
        </div>

        <div class="card">
            <strong>XP</strong><br>
            ${profile.xp}
        </div>

        <div class="card">
            <strong>Coins</strong><br>
            🪙 ${profile.coins}
        </div>

        <div class="card">
            <strong>Divine Energy</strong><br>
            ⚡ ${profile.divineEnergy}
        </div>

        <div class="card">
            <strong>Victories</strong><br>
            ${profile.victories}
        </div>

        <div class="card">
            <strong>Asuras Defeated</strong><br>
            ${profile.asurasDefeated}
        </div>

        <div class="card">
            <strong>Current Weapon</strong><br>
            ${profile.currentWeapon}
        </div>

        <div class="card">
            <strong>Current Skin</strong><br>
            ${profile.currentSkin}
        </div>
    `;

    infoPanel.classList.remove(
        "hidden"
    );
}


/* ================= WEAPONS ================= */

function showWeapons() {

    infoTitle.textContent =
        "WEAPONS";

    let html = "";

    weapons.forEach(
        weapon => {

            html += `
                <div class="card ${
                    weapon.unlocked
                        ? ""
                        : "locked"
                }">

                    <strong>
                        ${weapon.name}
                    </strong>

                    <br>

                    Damage:
                    ${weapon.damage}

                    <br>

                    Speed:
                    ${weapon.speed}

                    <br>

                    Range:
                    ${weapon.range}

                    <br><br>

                    ${
                        weapon.unlocked
                            ? "✓ UNLOCKED"
                            : `🔒 LEVEL ${weapon.requiredLevel}`
                    }

                </div>
            `;
        }
    );

    infoText.innerHTML =
        html;

    infoPanel.classList.remove(
        "hidden"
    );
}


/* ================= SKILLS ================= */

function showSkills() {

    infoTitle.textContent =
        "SKILLS";

    let html = "";

    skills.forEach(
        skill => {

            html += `
                <div class="card ${
                    skill.unlocked
                        ? ""
                        : "locked"
                }">

                    <strong>
                        ${skill.name}
                    </strong>

                    <br>

                    Damage:
                    ${skill.damage}

                    <br>

                    Energy:
                    ${skill.energy}

                    <br>

                    Cooldown:
                    ${skill.cooldown}s

                    <br><br>

                    ${
                        skill.unlocked
                            ? "✓ UNLOCKED"
                            : `🔒 LEVEL ${skill.requiredLevel}`
                    }

                </div>
            `;
        }
    );

    infoText.innerHTML =
        html;

    infoPanel.classList.remove(
        "hidden"
    );
}


/* ================= SKINS ================= */

function showSkins() {

    infoTitle.textContent =
        "SKINS";

    let html = "";

    skins.forEach(
        skin => {

            html += `
                <div class="card ${
                    skin.unlocked
                        ? ""
                        : "locked"
                }">

                    <strong>
                        ${skin.name}
                    </strong>

                    <br><br>

                    ${
                        skin.unlocked
                            ? "✓ UNLOCKED"
                            : `🔒 LEVEL ${skin.requiredLevel}`
                    }

                </div>
            `;
        }
    );

    infoText.innerHTML =
        html;

    infoPanel.classList.remove(
        "hidden"
    );
}


/* ================= OTHERS ================= */

function showOthers() {

    infoTitle.textContent =
        "OTHERS";

    infoText.innerHTML = `

        <div class="card">

            <strong>
                BALA VINAYAKA
            </strong>

            <br><br>

            Battle through the ancient
            divine realms and defeat
            powerful Asuras.

        </div>

        <div class="card">

            <strong>
                CONTROLS
            </strong>

            <br><br>

            ATTACK — Normal weapon attack

            <br>

            DIVINE STRIKE — Powerful skill

            <br>

            DEFEND — Reduce incoming damage

            <br>

            DODGE — Avoid an attack

        </div>

        <div class="card">

            <strong>
                LEVELS
            </strong>

            <br><br>

            Level 1 — The First Asura

            <br>

            Level 2 — Rising Demon

            <br>

            Level 3 — Fierce Guardian

            <br>

            Level 4 — Ancient Warrior

            <br>

            Level 5 — Asura Boss

        </div>
    `;

    infoPanel.classList.remove(
        "hidden"
    );
}


/* ================= SOUND ================= */

async function toggleSound() {

    soundEnabled =
        !soundEnabled;

    soundButton.textContent =
        soundEnabled
            ? "🔊"
            : "🔇";

    try {

        await apiRequest(
            "/settings",
            {
                method: "POST",

                body: JSON.stringify({
                    sound:
                        soundEnabled
                })
            }
        );

    } catch (error) {
        console.error(error);
    }
}


/* ================= MUSIC ================= */

async function toggleMusic() {

    musicEnabled =
        !musicEnabled;

    musicButton.textContent =
        musicEnabled
            ? "🎵"
            : "🔇";

    try {

        await apiRequest(
            "/settings",
            {
                method: "POST",

                body: JSON.stringify({
                    music:
                        musicEnabled
                })
            }
        );

    } catch (error) {
        console.error(error);
    }
}


/* ================= SETTINGS ================= */

function showSettings() {

    infoTitle.textContent =
        "SETTINGS";

    infoText.innerHTML = `

        <div class="card">

            <strong>
                SOUND
            </strong>

            <br><br>

            Click the 🔊 button
            to turn sound on/off.

        </div>

        <div class="card">

            <strong>
                MUSIC
            </strong>

            <br><br>

            Click the 🎵 button
            to turn music on/off.

        </div>

        <div class="card">

            <strong>
                BACKEND
            </strong>

            <br><br>

            Connected to:

            <br>

            http://localhost:3000

        </div>
    `;

    infoPanel.classList.remove(
        "hidden"
    );
}


/* ================= EVENTS ================= */

startButton.addEventListener(
    "click",
    startLoading
);

profileButton.addEventListener(
    "click",
    showProfile
);

weaponsButton.addEventListener(
    "click",
    showWeapons
);

skillsButton.addEventListener(
    "click",
    showSkills
);

skinsButton.addEventListener(
    "click",
    showSkins
);

othersButton.addEventListener(
    "click",
    showOthers
);

soundButton.addEventListener(
    "click",
    toggleSound
);

musicButton.addEventListener(
    "click",
    toggleMusic
);

settingsButton.addEventListener(
    "click",
    showSettings
);

closeInfo.addEventListener(
    "click",
    () => {

        infoPanel.classList.add(
            "hidden"
        );

    }
);

infoPanel.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            infoPanel
        ) {

            infoPanel.classList.add(
                "hidden"
            );
        }
    }
);

attackButton.addEventListener(
    "click",
    playerAttack
);

skillButton.addEventListener(
    "click",
    divineStrike
);

defendButton.addEventListener(
    "click",
    defend
);

dodgeButton.addEventListener(
    "click",
    dodge
);

backButton.addEventListener(
    "click",
    backToMenu
);


/* ================= KEYBOARD ================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !gameScreen.classList.contains(
                "active"
            )
        ) {
            return;
        }

        switch (
            event.key.toLowerCase()
        ) {

            case "a":
                playerAttack();
                break;

            case "s":
                divineStrike();
                break;

            case "d":
                defend();
                break;

            case "f":
                dodge();
                break;

            case "escape":
                backToMenu();
                break;
        }
    }
);


/* ================= IMAGE CHECK ================= */

if (ganeshaImage) {

    ganeshaImage.addEventListener(
        "load",
        () => {

            console.log(
                "✓ Ganesha image loaded"
            );

        }
    );

    ganeshaImage.addEventListener(
        "error",
        () => {

            console.error(
                "✗ Ganesha image not found"
            );

            console.log(
                "Put the image at:"
            );

            console.log(
                "frontend/assets/ganesha.png"
            );
        }
    );
}


/* ================= START ================= */

initializeGame();