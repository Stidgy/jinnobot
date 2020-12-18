const config = require('./config.json');
const Discord = require('discord.js');
const bot = new Discord.Client();
const _ = require("lodash");


const prefix = ".";
const heroXP = [
    949560,
    1068540,
    1197000,
    1335300,
    1483800,
    1642860,
    1812840,
    1994100,
    2187000,
    2391900,
    2609160,
    2839110,
    3082080,
    3338400,
    3608400,
    3892410,
    4190760,
    4503780,
    4831800,
    5175150,
    5534160,
    5909100,
    6300240,
    6707850,
    7132200,
    7573560,
    8032200,
    8508390,
    9002400,
    9514500,
    10044960,
    10594020,
    11161920,
    11748900,
    12355200,
    12981060,
    13626720,
    14292420,
    14978400,
    15684900,
    16412160,
    17160390,
    17929800,
    18720600,
    19533000,
    20367210,
    21223440,
    22101900,
    23002800,
    23926350,
    24872760,
    25842210,
    26834880,
    27850950,
    33224190,
    38207817,
    43938990,
    50529837,
    58109313,
    34448850
  ];
const normalXP = [
    300,
    840,
    1800,
    3300,
    5460,
    8400,
    12240,
    17100,
    23100,
    30360,
    39000,
    49140,
    60900,
    74400,
    105120,
    139800,
    178680,
    222000,
    270000,
    322920,
    381000,
    444480,
    513600,
    588600,
    669720,
    757200,
    851280,
    952200,
    1060200,
    1175520,
    1298400,
    1429080,
    1567800,
    1714800,
    1870320,
    2034600,
    2207880,
    2390400,
    2582400,
    3221180,
    3891500,
    4594120,
    5329800,
    6099300,
    6903380,
    7742800,
    8618320,
    9530700,
    10480700,
    11469080,
    12496600,
    13564020,
    14672100,
    15821600,
    17013280,
    18247900,
    19526220,
    20849000,
    22217000,
    27426400,
    32808000,
    38364600,
    44099000,
    50014000,
    56112400,
    62397000,
    68870600,
    75536000,
    82396000,
    89453400,
    96711000,
    104171600,
    111838000,
    119713000,
    127799400,
    136100000,
    144617600,
    153355000,
    162315000,
    195120000,
    228740000,
    263185000,
    326689000,
    391714000,
    487862000,
    586259000,
    686931000,
    789904000,
    895204000,
    1002857000,
    1112889000,
    1225326000,
    1340194000,
    1457519000,
    1577327000,
    1699644000,
    1843704000,
    1990719000
  ];


bot.login(config.TOKEN);

bot.on('ready',() => {
	console.info(`Logged in as ${bot.user.tag}!`);
});


bot.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    
    if (message.content === `${prefix}help`){
      message.channel.send('Jinno Helper \n \nPro výpočet AW napiš: ".exp (Tvůj AW level) (Tvoje %)"\nPro zobrazení všech lvlů napiš: ".exp (Tvůj AW level) (Tvoje %) all"');
      }else if (command === 'exp') {

	if (2 > _.size(args) || 3 < _.size(args)) {
		return message.channel.send(`Špatné argumenty, ${message.author}!`);
	}

    const argLevel = parseInt(_.first(args));
    if (!_.isInteger(argLevel) || argLevel != _.first(args)) {
       return message.channel.send(`Hodnoty musí být číslo, ${message.author}!`);
    }

    const level = (0 === argLevel) ? 1 : argLevel;
    if ((level < 0 || level > 59)) {
       return message.channel.send(`Level musí být v intervalu 0 až 59, ${message.author}!`);
    }

    const perHour = Number.parseFloat(_.nth(args, 1));
    if (perHour != _.nth(args, 1) || 0 >= perHour){
       return message.channel.send(`Hodnota %/h musí být větší než 0, ${message.author}!`);
    }

	let cumulTime = 0;
    const showAll = false || 'all' === _.nth(args, 2);
    const expArr = _.compact(_.map(heroXP, (exp, lvl) => {
        if (60 <= lvl + 1){
          return undefined;
        }

        if (!showAll && level > lvl + 1) {
            return undefined;
        }
        const expAtLevel = (perHour / 100 * heroXP[level - 1]) / heroXP[lvl] * 100;
        const time = 100 / expAtLevel;
        const hours = Math.floor(time);
        const minutes = Math.ceil((time - hours) * 60);
        cumulTime += hours * 60 + minutes;
        const cumulMinutes = Math.floor(cumulTime % 60);
        const cumulHours = (cumulTime - cumulMinutes) / 60;
        return {
          level: lvl + 1,
          timeForLevel: `${ hours }h${ minutes >= 10 ? minutes : '0' + minutes }`,
          perHourForLevel: +(Math.round((expAtLevel) + "e+2")  + "e-2"),
          cumulTotal: `${cumulHours}h${cumulMinutes >= 10 ? cumulMinutes : '0' + cumulMinutes}m`
        };
    }));
    if (24 >= _.size(expArr)) {
       const messageEmbed = {
          embed: {
            color: _.random(1, 16777214),
            fields: [{
              name: '**__INFORMACE__**',
              value: '**Výpočet délky expu na jednotlivé AW levely**'
            }, ..._.map(expArr, levelInfos => ({
              name: `AW Level +${levelInfos.level}`,
              value: `${levelInfos.timeForLevel} (${levelInfos.perHourForLevel}%/h) - Total: ${levelInfos.cumulTotal})`
            }))]
          }
        }
        return message.channel.send(messageEmbed);
      }
      const messageExp = _.join(_.map(expArr, levelInfos => `+${ levelInfos.level}: ${ levelInfos.timeForLevel } (${ levelInfos.perHourForLevel }%/h) - Total: ${ levelInfos.cumulTotal }`), '\n');
      return message.channel.send(`\`\`\`Výpočet délky expu na jednotlivé AW levely\n${messageExp}\`\`\``, { split: {
        prepend: '```',
        append: '```',
        char: '\n'
      }});
 }})