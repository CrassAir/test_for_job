var getTitle = function (title) {
    if (title === "") {
        title = "TITLE DEFAULT";
    }
    return title;
};
var getNotificationOptions = function (message, message_tag, url) {
    var options = {
        body: message,
        icon: '/img/icon_120.png',
        tag: message_tag,
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        data: {
            url: url
        }
    };
    return options;
};

self.addEventListener('install', function (event) {
    self.skipWaiting();
});

async function checkClientIsVisible() {
    const windowClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
    });

    for (var i = 0; i < windowClients.length; i++) {
        if (windowClients[i].visibilityState === "visible") {
            return true;
        }
    }

    return false;
}

self.addEventListener('push', function (event) {
    var response_json = event.data.json();
    var title = response_json.title;
    var message = response_json.message;
    var message_tag = response_json.tag || '';
    var url = response_json.url || '';
    checkClientIsVisible().then(val => {
        if (!val) {
            self.registration.showNotification(getTitle(title), getNotificationOptions(message, message_tag, url));
        }
    });
    self.clients.matchAll({includeUncontrolled: true, type: 'window'}).then(function (clients) {
        clients.forEach(function (client) {
            client.postMessage({
                "data": message_tag,
                "title": title,
                "message": message,
                "url": url
            });
        });
    });
});

// Optional: Added to that the browser opens when you click on the notification push web.
self.addEventListener('notificationclick', function (event) {
    // Android doesn't close the notification when you click it
    // See http://crbug.com/463146
    event.notification.close();
    // Check if there's already a tab open with this URL.
    // If yes: focus on the tab.
    // If no: open a tab with the URL.
    event.waitUntil(clients.matchAll({type: 'window', includeUncontrolled: true}).then(function (windowClients) {
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if ('focus' in client) {
                    if (event.notification.data.url) {
                        client.navigate(event.notification.data.url)
                    }
                    return client.focus();
                }
            }
        })
    );
});