$(document).ready(function() {
    const urlParameter = getUrlParameter("conditionId")
    if (urlParameter) {
        $('#candidate-salary-form').hide()
        $('#employer-salary-form').show()
    }
})

const salaryStandoffApiUrl = "http://localhost:8080"

function handleCandidateSalaryForm(form) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', `${salaryStandoffApiUrl}/candidate_condition`);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(getFormData(form)));

    $('#candidate-salary-form').hide()
    $('#spinner').show()

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            $('#spinner').hide()
            if (xhr.status === 200) {
                $('#employer-salary-url').show()
                const resp = JSON.parse(xhr.responseText)
                $('#employer-salary-url-card').text(`${window.location.href}?conditionId=${resp.conditionId}`)
            } else {
                $('#error-badge').show()
            }
        }
    }

    return false;
}

function handleEmployerSalaryForm(form) {
    const conditionId = getUrlParameter("conditionId")

    var xhr = new XMLHttpRequest();
    xhr.open('POST', `${salaryStandoffApiUrl}/employer_condition/${conditionId}`);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(getFormData(form)));

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            $('#employer-salary-form').hide();
            const resp = JSON.parse(xhr.responseText);
            if (resp.areConditionsCompatible) {
                $("#compatible-badge").show()
            } else {
                $("#non-compatible-badge").show()
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
