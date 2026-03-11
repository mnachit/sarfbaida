jQuery(document).ready(function($) {
    "use strict";

    // Année dynamique copyright
    var yearEl = document.getElementById("copyright-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            function getCookie(name) {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
    });

    // calculateur - simulation client-side (taux indicatifs)
    var tauxCalc = {
        1: { buy: 10.60, sell: 10.90 },
        2: { buy: 9.10, sell: 9.45 },
        3: { buy: 6.60, sell: 7.00 },
        4: { buy: 12.20, sell: 12.80 },
        6: { buy: 11.30, sell: 12.00 },
        7: { buy: 2.40, sell: 2.65 },
        8: { buy: 2.40, sell: 2.60 },
        9: { buy: 21.00, sell: 25.60 },
        10: { buy: 26.00, sell: 31.40 },
        11: { buy: 2.35, sell: 2.60 },
        12: { buy: 21.00, sell: 25.10 }
    };
    if ($("#calc").length) {
        $("#calc").submit(function(event) {
            event.preventDefault();
            var quantity = $("#quantite");
            var devise = $("#devise").val();
            var type = $("input[name='type']:checked").val();
            if (!quantity.val() || quantity.val() == "") {
                quantity.addClass("error");
                $("#error").text("Veuillez entrer la quantité.");
                return false;
            }
            if (!devise) {
                $("#error").text("Veuillez sélectionner une devise.");
                return false;
            }
            quantity.removeClass("error");
            var qty = parseFloat(quantity.val());
            var taux = tauxCalc[devise];
            if (!taux) {
                $("#error").text("Devise non trouvée.");
                return false;
            }
            var prix = (type === "achat") ? taux.buy : taux.sell;
            var total = (qty * prix).toFixed(2);
            $("#prix_devise").text(prix + " MAD");
            $("#amount").text(total + " MAD");
            $("#error").text("");
            return false;
        });
    }


    // contact
    if ($("#contactform").length) {
        $("#contactform").submit(function(event) {
            event.preventDefault()
            const submitbtn = $("#submitbtn")
            submitbtn.addClass('disabled btn-dark')
            var data = $(this).serialize();
            $.ajax({
                type: "POST",
                url: "/contact",
                data: data,
                dataType: 'json',
                success: function(data) {
                    if (data.success) {
                        $("#message").html(`<p class="alert alert-success">${data.message}<\p>`)
                    } else {
                        $("#message").html(`<p class="alert alert-danger">${data.message}<\p>`)
                    }
                    submitbtn.removeClass('disabled btn-dark')
                }
            });
            return false;
        })
    }


    // dotation

    if ($("#dotationform").length) {
        $("#dotationform").submit(function(event) {
            event.preventDefault()
            const submitbtn = $("#submitbtn")
            submitbtn.addClass('disabled btn-dark')
            var data = $(this).serialize();
            $.ajax({
                type: "POST",
                url: "/dotation",
                data: data,
                dataType: 'json',
                success: function(data) {
                    if (data.success) {
                        $("#message").html(`<p>${data.message}<\p>`)
                    } else {
                        $("#message").html(`<p>${data.message}<\p>`)
                    }
                    submitbtn.removeClass('disabled btn-dark')
                }
            });
            return false;
        })
    }


})