const form = document.getElementById("payment-form");

var threeDSecureParameters = {
    amount: '500.00',
    email: 'test@example.com',
    billingAddress: {
        givenName: 'Jill',
        surname: 'Doe',
        phoneNumber: '8101234567',
        streetAddress: '555 Smith St.',
        extendedAddress: '#5',
        locality: 'Oakland',
        region: 'CA',
        postalCode: '12345',
        countryCodeAlpha2: 'US'
    },
    collectDeviceData: true,
    additionalInformation: {
        workPhoneNumber: '8101234567',
        shippingGivenName: 'Jill',
        shippingSurname: 'Doe',
        shippingPhone: '8101234567',
        shippingAddress: {
            streetAddress: '555 Smith St.',
            extendedAddress: '#5',
            locality: 'Oakland',
            region: 'CA',
            postalCode: '12345',
            countryCodeAlpha2: 'US'
        }
    },
};

fetch("/client_token", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
})
.then((response) => response.json())
.then((data) => {
    braintree.dropin.create({
        authorization: data.clientToken,
        container: document.getElementById("dropin-container"),
        applePay: {
            displayName: "My Store",
            paymentRequest: {
                total: {
                    label: "My Store",
                    amount: "20.00",
                },
                requiredBillingContactFields: ["postalAddress"],
            },
        },
        googlePay: {
            googlePayVersion: 2,
            merchantId: 'merchant-id-from-google',
            transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPrice: '30.00',
                currencyCode: 'EUR'
            },
            allowedPaymentMethods: [{
                type: 'CARD',
                parameters: {
                    billingAddressRequired: true,
                    billingAddressParameters: {
                        format: 'FULL'
                    }
                }
            }]
        },
        paypal: {
            flow: "checkout",
            amount: "40.00",
            currency: "EUR",
            buttonStyle: {
                color: "blue",
                shape: "rect",
                size: "medium",
            },
        },
        threeDSecure: true,
        dataCollector: true,
        locale: "en-GB",
    },
    (dropinError, dropinInstance) => {
        if (dropinError) {
            console.error("Error creating Drop-In instance:", dropinError);
            return;
        }

        // Elements necessary for credit/debit cards
        const cardElement = document.getElementsByClassName("braintree-option__card");
        const choosePaymentMethod = document.getElementsByClassName("braintree-toggle");
        const purchaseButton = document.getElementById("submit-button");

        cardElement[0].addEventListener('click', (event) => {
            event.preventDefault();
            
            purchaseButton.style.visibility = "visible";
        });


        choosePaymentMethod[0].addEventListener('click', (event) => {
            event.preventDefault();

            purchaseButton.style.visibility = "hidden";
        });

        // Form for credit/debit cards
        form.addEventListener("submit", () => {
            event.preventDefault();

            dropinInstance.requestPaymentMethod({
                threeDSecure: threeDSecureParameters
            },
            (requestPaymentMethodError, payload) => {
                if (requestPaymentMethodError) {
                    console.error("Error requesting payment method:", requestPaymentMethodError);
                    return;
                }

                // document.getElementById("nonce").value = payload.nonce;
                // document.getElementById("deviceData").value = payload.deviceData;
                form.submit();
            });
        });
    });
})
.catch((tokenError, response) => {
    console.error("Error fetching client token:", tokenError);
});