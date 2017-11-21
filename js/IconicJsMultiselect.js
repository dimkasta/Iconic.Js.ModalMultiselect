$.fn.modalSelect = function () {
    return this.each(function () {
        var field = $(this).data("field")
        var title = $(this).data("title");
        // console.log(field);
        var fieldSelect = $("#" + field);
        var button = $(this);

        var modalHtml = "<div id='modalFieldSelector' class=\"modal fade \" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"selector\">\n" +
            "  <div class=\"modal-dialog optionSelector \" role=\"document\">\n" +
            "   <div class=\"modal-content\"><div class='modal-header'>" +
            "       <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
            "       <h4 class='modal-title'>" + title + "</h4>" +
            "   </div><div class='modal-body'>" +
            "       <div id='modalFieldFilter'>" +
            "              <input type='text' id='fieldOptionFilter' class='form-control' placeholder='Φιλτράρισμα' onkeyup='filterFieldOptions();'>" +
            "       </div>" +
            "       <div id='modalFieldSelectorScroller'></div>" +
            "   </div>\n" +
            // "   <div class=\"modal-footer\">\n" +
            // "       <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Κλείσιμο</button>\n" +
            // "   </div>" +
            "</div>" +
            "</div>";

        fieldSelect.on("change", function () {
            updateButtonValues(button, fieldSelect);
        })

        $(this).on("click", function (ev) {
            ev.preventDefault();
            $("#modalSelector").html(modalHtml);
            var scroller = $("#modalFieldSelectorScroller");

            var isMulti = fieldSelect.prop("multiple");

            var options = fieldSelect.children();
            // console.log("found children " + options.length);
            for(childIndex = 0; childIndex < options.length; childIndex++)
            {
                var thisOption = $(options[childIndex]);
                var thisTag = thisOption.prop("tagName");
                // console.log(thisTag);
                if("option" === thisTag.toLowerCase())
                {
                    //add a title to the list and then loop for children
                    var optionElement = createOption(thisOption, isMulti, fieldSelect);
                    optionElement.appendTo(scroller);
                    // console.log("added option");
                }
                else if ("optgroup" === thisTag.toLowerCase())
                {
                    //add the option to the list
                    var thisTitle = $("<a/>").addClass("form-control btn isGroup").html(thisOption.attr("label"));
                    thisTitle.appendTo(scroller);
                    // console.log("added group. going for children");
                    var thisOptions = thisOption.children();
                    // console.log("found options " + thisOptions.length);
                    for(optionIndex = 0; optionIndex < thisOptions.length; optionIndex++)
                    {
                        var childOption = $(thisOptions[optionIndex]);
                        // console.log("add ing " + childOption.prop("tagName"));
                        var childOptionElement = createOption(childOption, isMulti, fieldSelect);
                        childOptionElement.appendTo(scroller);
                        // console.log("added");
                    }
                }
            }

            // for (x = 0; x < options.length; x++) {
            // console.log("adding option");


            // }

            $('#modalFieldSelector').on('hidden.bs.modal', function () {
                $('#modalFieldSelector').remove();
            });
            $("#modalFieldSelector").modal("show");

            console.log("clicked");
        });

        updateButtonValues(button, fieldSelect);
    });


};

createOption = function(option, isMulti, fieldSelect) {
    var cssClass = "default";
    if (option.is(':selected')) {
        cssClass = "primary";
    }
    var htmlOption = $("<a/>").addClass("form-control btn fieldSelectButton btn-" + cssClass).html(option.text());
    var value = option.val() + "";
    if (!isMulti) {
        htmlOption.attr("onClick", "$('#" + fieldSelect.prop("id") + "').val('" + value + "').trigger('change').click();$('#modalFieldSelector').modal('hide');return false;");
    }
    else {
        var selector = "#" + fieldSelect.prop("id") + " option[value=\"" + value + "\"]";
        // console.log(selector);
        htmlOption.attr("onClick", "if( ! $('" + selector + "').prop('selected')){$('" + selector + "').prop('selected',true).trigger('change').click();$(this).removeClass('btn-default').addClass('btn-primary');return false;}else{$('" + selector + "').prop('selected',false).trigger('change').click();$(this).addClass('btn-default').removeClass('btn-primary');return false;}");
    }
    return htmlOption;
};

updateButtonValues = function (button, select) {
    var selectedNumber = select.val();
    var isMultiple = select.prop("multiple");
    var promptText = "";

    if ( ! isMultiple)
    {
        promptText = select.find("option:first").text();
    }
    else
    {
        console.log("marka");
        console.log(selectedNumber);
        if( ! select.attr("disabled"))
        {
            promptText = $(button).data("prompt");
        }
        else {
            promptText = $(button).data("empty-prompt");
        }
    }

    var isDisabled = select.prop("disabled");

    if(isDisabled)
    {
        button.addClass("disabled");
    }
    else
    {
        button.removeClass("disabled");
    }

    var value = select.val();

    if (null == value || "" == value || [] == value) {
        console.log("emptying");
        button.html("<i class='fa fa-search-plus'></i> " + promptText);
        button.removeClass("isSelected");

    }
    else {
        if ( ! (value instanceof Array)) //if multiple
        {
            button.addClass("isSelected");

            button.html("<i class='fa fa-search-plus'></i> " + select.find(":checked").text());
        }
        else {
            switch (true) {
                case (value.length === 0): {
                    button.html("<i class='fa fa-search-plus'></i> " + promptText);
                    break;
                }
                case (value.length > 2): {
                    button.addClass("isSelected");
                    button.html("<i class='fa fa-search-plus'></i> " + " " + value.length + " επιλογές");

                    break;
                }
                default: {
                    var txt = "";
                    for (x = 0; x < value.length; x++) {
                        txt += select.find("option[value='" + value[x] + "']").text() + ", ";
                    }
                    txt = txt.substring(0, txt.length - 2);
                    button.addClass("isSelected");
                    button.html("<i class='fa fa-search-plus'></i> " + " " + txt);
                }
            }
        }
    }
};

filterFieldOptions = function () {
    var filter = $("#fieldOptionFilter").val().toUpperCase();
    console.log("filtering with " + filter);
    var options = $("#modalFieldSelectorScroller").children();
    console.log(options.length);
    for(x = 0; x < options.length; x++)
    {
        var option = $(options[x]);
        console.log(option.html());
        if(option.text().toUpperCase().replace("Ά", "Α").replace("Έ", "Ε").replace("Ή", "Η").replace("Ί", "Ι").replace("Ό", "Ο").replace("Ύ", "Υ").replace("Ώ", "Ω").includes(filter))
        {
            option.show();
        }
        else
        {
            option.hide();
        }
    }
};

$(function(){
    $(".modalSelect").modalSelect();
});