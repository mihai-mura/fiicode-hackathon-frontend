# TrackMe

TrackMe este o aplicatie web care ajuta parintii sa stie locatia live a copiilor si sa primeasca notificari in cazul in care copilul se afla in pericol sau are o urgenta.

TrackMe a fost creeata folosind stack-ul `MERN`. Pentru state management in React am folosit `Redux`. 
Exista 2 tipuri de useri si pentru autorizare am folosit `JsonWebToken` care este salvat in localStorage. 
Am folosit API-ul GoogleMaps pentru a vedea toti userii activi pe o harta interactiva, iar pentru trimiterea email-urilor catre utilizatori am folosit nodemailer. 
Locatia copiilor si notificarile sunt trimise in timp real folosind `WebSockets`.
Aplicatia copilului prezinta un cod QR care trebuie scanat din aplicatia parintelui pentru a fi adaugat in familie.

Videoclip de prezentare: https://www.youtube.com/watch?v=wVY5gXPS3dE
