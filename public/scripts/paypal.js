
fetch("/paypal", {
    method: "GET",
    headers: {
        "Content-Type": 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    const library = "https://www.paypal.com/sdk/js?client-id=";
    const script = document.createElement('script');

    script.src = library + data.clientid;

    document.head.appendChild(script);
})
.catch((paypalerror, response) => {
    console.error('Error fetching PayPal clientID:', paypalerror);
});