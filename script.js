// Initialisation de la carte
var map = L.map('map').setView([48.8566, 2.3522], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Configuration Firebase
var database = firebase.database();

// Initialisation du calendrier
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'fr',
        events: []
    });

    calendar.render();

    // Charger les données des travaux depuis Firebase
    database.ref('travaux').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var travail = childSnapshot.val();
            L.marker([travail.lat, travail.lng]).addTo(map)
                .bindPopup(`<b>${travail.company}</b><br>${travail.commune}<br>${travail.workType}<br>${travail.startDate} - ${travail.endDate}<br>${travail.command}`);
            
            // Ajouter les événements au calendrier
            calendar.addEvent({
                title: `${travail.company} - ${travail.workType}`,
                start: travail.startDate,
                end: travail.endDate,
                extendedProps: {
                    company: travail.company,
                    commune: travail.commune,
                    command: travail.command
                }
            });
        });
    });

    // Soumission du formulaire
    document.getElementById('work-form').addEventListener('submit', function (e) {
        e.preventDefault();
        
        var company = document.getElementById('company').value;
        var commune = document.getElementById('commune').value;
        var workType = document.getElementById('work-type').value;
        var startDate = document.getElementById('start-date').value;
        var endDate = document.getElementById('end-date').value;
        var command = document.getElementById('command').value;

        // Ajouter un marqueur sur la carte (exemple: position aléatoire pour illustration)
        var lat = 48.8566 + (Math.random() - 0.5) * 0.1;
        var lng = 2.3522 + (Math.random() - 0.5) * 0.1;
        L.marker([lat, lng]).addTo(map)
            .bindPopup(`<b>${company}</b><br>${commune}<br>${workType}<br>${startDate} - ${endDate}<br>${command}`);

        // Ajouter les données au fichier JSON (simulation)
        // En pratique, il faut envoyer les données à un serveur via une requête AJAX pour les sauvegarder
        var newWork = {
            company: company,
            commune: commune,
            workType: workType,
            startDate: startDate,
            endDate: endDate,
            command: command,
            lat: lat,
            lng: lng
        };

        // Ajouter l'événement au calendrier
        calendar.addEvent({
            title: `${company} - ${workType}`,
            start: startDate,
            end: endDate,
            extendedProps: {
                company: company,
                commune: commune,
                command: command
            }
        });

        // Enregistrer dans Firebase
        database.ref('travaux').push(newWork);
        console.log('Nouvelle entrée:', newWork);
    });
});