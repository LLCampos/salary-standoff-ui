$(document).ready(function() {
    const urlParameter = getUrlParameter("conditionId")
    if (urlParameter) {
        $('#candidate-salary-form').hide()
        $('#employer-salary-form').show()
    }
})

const salaryStandoffApiUrl = "http://localhost:8080"

function handleCandidateSalaryForm(form) {
    function onSuccess(responseText) {
        $('#employer-salary-url').show()
        const resp = JSON.parse(responseText)
        $('#employer-salary-url-card').text(`${window.location.href}?conditionId=${resp.conditionId}`)
    }

    function onFailure() {
        $('#error-badge').show()
    }

    return handleForm(form, 'candidate_condition', 'candidate-salary-form', onSuccess, onFailure)
}

function handleEmployerSalaryForm(form) {

    function onSuccess(responseText) {
        $('#employer-salary-form').hide();
        const resp = JSON.parse(responseText);
        if (resp.areConditionsCompatible) {
            $("#compatible-badge").show()
        } else {
            $("#non-compatible-badge").show()
        }
    }

    function onFailure(status) {
        if (status === 404) {
            $('#already-verified-badge').show()
        } else {
            $('#error-badge').show()
        }
    }

    const conditionId = getUrlParameter("conditionId")
    return handleForm(form, `employer_condition/${conditionId}`, 'employer-salary-form', onSuccess, onFailure)
}

function handleForm(form, endpoint, formId, onSuccess, onFailure) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', `${salaryStandoffApiUrl}/${endpoint}`);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(getFormData(form)));

    $("#" + formId).hide()
    $('#spinner').show()

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            $('#spinner').hide()
            if (xhr.status === 200) {
                onSuccess(xhr.responseText)
            } else {
                onFailure(xhr.status)
            }
        }
    }

    return false;
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
}

function getFormData(form) {
    var data = {};
    for (var i = 0, ii = form.length; i < ii; ++i) {
        var input = form[i];
        if (input.name) {
            data[input.name] = input.value;
        }
    }
    return data;
}
