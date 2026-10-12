// ===== CONFIGURAZIONE (modificami liberamente) =====
window.CONFIG={
  theme:"default",                 // tema fuori stagione: cartella assets/themes/<theme>/ non lasciarlo mai però fuori stagione, o le competizioni non ci saranno.
  phrases:[                        // frasi del finto caricamento (fuori stagione)
    "Giocare 30 minuti prima di dormire ti aiuterà nel sonno 😴",
    "Ogni gattino merita il suo spazio vitale 🐾",
    "Fai una partita al giorno per tenere viva la streak 🔥",
    "I gatti odiano avere vicini troppo vicini 😼"
  ],
  // ---- STAGIONI (aggiungine quante vuoi) ----
  // from/to = "AAAA-MM-GG" (to incluso). Durante la stagione: competizione attiva, tema = cartella assets/themes/<theme>/,
  // frase di caricamento dalla lista "phrases", il vincitore riceve la cornice assets/frames/<frame>.png.
  // Fuori da ogni stagione la competizione si ferma e appare "Una prossima competizione stagionale arriverà fra poco".
  // Per ripetere una stagione: aggiungi una nuova riga con nuove date (stessa cornice se vuoi: chi ce l'ha già riceve solo gli aiuti).
  // I frame sono le cornici che danno le competizioni di quella stagione
  // theme: "qualcosa" . è il nome della cartella dove andrà a prendere le texture relative a quella stagione.
  //phrase:["cia"]   .  Sono le frasi durante il caricamente che verranno dette in quella determinata stagione.
  // ricorda di aggiungerne altre, o sennò succederanno dei bug quando arriveranno stagioni inesistenti.
  seasons:[
    {name:"Halloween",from:"2026-10-01",to:"2026-10-31",theme:"halloween",frame:6,phrases:["🎃Buon Halloween!🎃","Attenzione ai gatti neri... 🖤", "🎃Giocare 30 minuti prima di dormire ti aiuterà nel sonno 😴"]},
    {name:"default",from:"2026-11-01",to:"2026-11-31",theme:"default",frame:3,phrases:["Giocare 30 minuti prima di dormire ti aiuterà nel sonno 😴", "Ogni gattino merita il suo spazio vitale 🐾", "Fai una partita al giorno per tenere viva la streak 🔥", "I gatti odiano avere vicini troppo vicini 😼"]},
    {name:"Natale",   from:"2026-12-01",to:"2026-12-31",theme:"natale",   frame:4,phrases:["Buon Natale! 🎄","Buone feste da Gattoku! 🎁"]},
    {name:"Pasqua",from:"2027-03-20",to:"2027-04-19",theme:"pasqua",frame:1,phrases:["Buona Pasqua! 🐣"]}
  ],
  frameCount:6,                    // quante cornici esistono in assets/frames/ (1.png ... N.png): le vede tutte la scheda "Tutte" se vai a crearne una nuova, aumenta di un qua, ricorda, il nome dell'immagine deve essere sempre un numero superiore a quello prima seguendo un FLow giusto e ordinato
  leaderboard:[                    // classifica manuale (level come STRINGA, anche enorme)
    {name:"Monxa21",level:"250"},
    {name:"Levyax",level:"1200"},
    {name:"XxRomanEmpire",level:"1992"}
  ],
  hintEvery:3,                     // 1 aiuto ogni N livelli completati
  pfpCount:12,                     // qui dice quate immagini profilo ci sono, per metterle altre aumenta il numero di 1. immagini profilo assets/pfp/1.png ... N.png
  exts:["png","webp","gif","jpg","jpeg","svg","avif"], // formati provati in ordine per pfp/cornici/cassa
  botCount:30,                     // quanti avversari ci sono per competizione
  chestHints:5,                     // aiuti dati dalla cassa quando si vince una competizione
  // ---- CREDITI E INFO (tasto ℹ️): sezioni con righe di testo; una riga può essere un link {t:"testo",url:"https://..."} ----
  credits:[
    {title:"Crediti",lines:["Gioco creato da: (Davide Franzella)","Musica: (titolo) di (autore)","Grafica: (Davide Franzella)"]},
    {title:"Informazioni",lines:["Versione 1.2","Grazie per aver giocato! 🐱",   /*,{t:"☕ Dona qui",url:"https://example.com"}*/ "Nuovo aggiornamento, Versione 1.2, miglioramento di alcuni sprite, altri sprite migliori è più realistici arriveranno molto preso, restate sintonizzati per i nuovi sprite 3D e altri miglioramenti per rendere l'esperienza migliore possibile.      ",  " ------ " , "Nuovo aggiornamento, Versione 1.1 fix di bug e pattern ripetitivi + cassa evento con Frame buggato"]}
  ]
};
