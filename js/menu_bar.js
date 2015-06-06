var datetimepicker1;
var datetimepicker2;
var datetimepicker3;
var periodPicker;

var barModeOption;

var loadingPanel;

function startListners() {

    $("#month").click(function() {
        renderPhase = 0;
        getUserData();
    });

    $("#day").click(function() {
       getUserData();
    });

    //DATE FILTER

    //Period Select
    periodPicker = $('.periodPiker');
    datetimepicker1 = $('#initialDate');
    datetimepicker2 = $('#datetimepicker2');
    datetimepicker3 = $('#monthDate');

    if (filterPeriod == "Day") {
       datetimepicker2.hide();
       datetimepicker3.hide();
    } else if (filterPeriod == "Month") {
        datetimepicker1.hide();
        datetimepicker2.hide();
    } else if (filterPeriod == "Range") {
        datetimepicker3.hide();
    }

    periodPicker.click(function() {

        switch($(this).text()) {

            case "Day":
                filterPeriod = "Day";

                filterInitialDate = moment(filterFinalDate);

                datetimepicker2.hide();
                datetimepicker3.hide();

                datetimepicker1.show();
                datetimepicker1.data("DateTimePicker").setDate(filterFinalDate);

            break;

            case "Month":
                filterPeriod = "Month";
                datetimepicker3.show();

                datetimepicker3.data("DateTimePicker").setDate(filterFinalDate);

                datetimepicker1.hide();
                datetimepicker2.hide();

            break;

            case "Range":

                if (filterPeriod == "day") filterFinalDate = moment(filterInitialDate);

                filterPeriod = "Range";

                datetimepicker1.data("DateTimePicker").setDate(filterInitialDate);
                datetimepicker2.data("DateTimePicker").setDate(filterFinalDate);

                datetimepicker1.show();
                datetimepicker2.show();

                datetimepicker3.hide();

            break;
        }
    });


    //date picker
    $(function () {

        datetimepicker1.datetimepicker({
            format: 'DD/MM/YYYY',
            pickTime: false,
            //minDate: (filterMonth+1)+"/01/2014",
            minDate: userInfo.profile.firstDate,
            //maxDate: (filterMonth+1)+"/31/2016",
            maxDate: moment(),
            defaultDate: filterInitialDate
        });

        datetimepicker2.datetimepicker({
            format: 'DD/MM/YYYY',
            pickTime: false,
            minDate: userInfo.profile.firstDate,
            //maxDate: (filterMonth+1)+"/31/2014"
            maxDate: moment(),
            defaultDate: filterFinalDate
        });

        datetimepicker3.datetimepicker({
            viewMode: 1,
            minViewMode: 1,
            pickTime: false,
            minDate: userInfo.profile.firstDate,
            maxDate: moment(),
            defaultDate: moment()
        });
        
    });


    datetimepicker1.on("dp.change",function (e) {
        datetimepicker2.data("DateTimePicker").setMinDate(e.date);

        filterInitialDate = e.date;

        if (filterPeriod == "Day") {
            filterFinalDate = filterInitialDate;

        };
        
        renderPhase = 0;
        getUserData();

    });
            

    datetimepicker2.on("dp.change",function (e) {
        datetimepicker1.data("DateTimePicker").setMaxDate(e.date);
        
        filterFinalDate = e.date;
        renderPhase = 0;
        getUserData();
        
    });


    datetimepicker3.on("dp.change",function (e) {

        var selectedDate = moment(e.date);

        filterMonth = selectedDate.month(); 

        //define begining of the month
        filterInitialDate = moment(selectedDate).date(1);

        //define ending of the month / test if month is not finihed yet -> final date = today
        var fDate = function() {
            if (moment().isBefore(moment(selectedDate).date(selectedDate.daysInMonth()))) {
                return moment();
            } else {
                return moment(selectedDate).date(selectedDate.daysInMonth());
            }
        }

        filterFinalDate = fDate();

        renderPhase = 0;
        
        getUserData();
        
    });

}

function updateBarModeOption() {

    var barModeOption = $("#bar-mode-option");
    var barModeOptionlabels = barModeOption.find("label");

    //remove
    for (var i = barModeOptionlabels.length-1; i > 1; i--) {
        barModeOptionlabels[i].remove()
    }


    for (var i = 0; i < activeModes.length; i++) {

        if (activeModes[i].key != "undefined") { 

            barModeOption.append(
                '<label class="btn btn-default modeOption">'
                    + '<img class="modeOptionImage" src="'+ "images/icons/" + activeModes[i].key + ".png" +'" alt="'+activeModes[i].key+'" height="15" width="15">'
                    + '<input type="radio" name="options" id="option'+ (i+2) +'" autocomplete="off">'
                    + activeModes[i].key
                + '</label>'
            );
        }
        
    }

    barModeOptionlabels = barModeOption.find("label");
    barModeOptionlabels.on("click",function(e) {
        filterMode = $(this).text();
        updateModeFilters();
        renderPhase = 0;
        render();
        render();
    });
}

$(document).ready(function() {

    loadingPanel = $("#loading");

    var codeOptions = $("#bar-code-option").find("label");
    
    codeOptions.on("click",function(e) {
        encode = $(this).text();
        updateModeFilters();
        renderPhase = 0;
        render();
        render();
    });
});

function showLoading(visible) {
    if (visible) {
        loadingPanel.css( "display", "block");
    } else {
        loadingPanel.css( "display", "none");
    }
}

