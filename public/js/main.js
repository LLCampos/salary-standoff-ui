const salaryStandoffApiUrl = "http://localhost:8080"

function handleCandidateSalaryForm(form) {
    var data = {};
    for (var i = 0, ii = form.length; i < ii; ++i) {
        var input = form[i];
        if (input.name) {
            data[input.name] = input.value;
        }
    }

    // construct an HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', `${salaryStandoffApiUrl}/candidate_condition`);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            $('#candidate-salary-form').hide()
            $('#employer-salary-url').show()
            const resp = JSON.parse(xhr.responseText)
            $('#employer-salary-url-card').text(`http://localhost:63342/salary-standoff-ui/public/index.html/${resp.conditionId}`)
        }
    }

    return false;
}
