//For each multiselect

//create a modal with id

//create a button that opens the modal with id

//sync and select modal options with select options with id

// event select change, sync and select options with id
// $("#modalId [data-modal-id='sad'][data-modal-option-id='213']")
$(function() {


    var isMultiple = $("#pedio1").val().constructor === Array;
    console.log("Multiple: " + isMultiple);

    bindOptions = function() {
        //click modal
        $(".field-option").on("click", function () {
            console.log("clicked");
            var field = $(this).data("field");
            var value = $(this).data("id");
            var option = $("#" + field + " option[value='" + value + "']");
            var isSelected = option.prop("selected");
            option.prop("selected", !isSelected);
            var values = $("#" + field).val();
            updateModalOptions(field, values);
        });
    }

    //click select
    $(".multiselect").on("change", function(){
        var field = this.id;
        var value = $("#" + field).val();
        updateModalOptions(field, value);
    });

    updateModalOptions = function(field, values) {
        var selector = '.field-option[data-field="' + field + '"]';
        var modalOptions = $(selector);
        deselectOption(modalOptions);
        console.log(values);

        $.each(modalOptions, function (key, option) {
            var optionId = $(option).data("id");
            var selected = false;
            if(isMultiple )
            {
                if(values.indexOf(optionId + "") > -1) {
                    selectOption(option);
                }
            }
            else
            {
                if(values + "" === optionId + "" )
                {
                    selectOption(option);
                }
            }
        });
    };

    selectOption = function(option) {
        $(option).removeClass("btn-default");
        $(option).addClass("btn-primary");
    }

    deselectOption = function(option) {
        $(option).addClass("btn-default");
        $(option).removeClass("btn-primary");
    }

    initOptions = function(field) {


        var list = $("#" + field + "Modal .modal-body");
        console.log(list);
        list.empty();
        var options = $("#" + field + " option")
        $.each(options, function(key, option){
            //data-field="pedio1" data-id="4"
            var newItem = $("<div/>").addClass("btn field-option").html($(option).text()).attr("data-field", field).attr("data-id", option.value);
           if(option.selected) {
               newItem.addClass("btn-primary");
           }
           else
           {
               newItem.addClass("btn-default");
           }
           newItem.appendTo(list);

           // newItem.appendTo($(".modal-body"));
        })
        bindOptions();
    }

    $.fn.modalMultiselect = function() {
        console.log("starting plugin");
        this.addClass("multiselect-hidden");
        var field = this.data("field")
        var title = this.data("title");
        // console.log(title);
        var button = getButton(field, title);
        var modal = getModal(field, title);
        button.insertAfter(this);
        modal.insertAfter(this);

        initOptions(field);


        updateModalOptions("pedio1", this.val());
    }

    $(".modalMultiselect").modalMultiselect();
});

getModal = function(id, title) {
    var modal = $("<div/>").addClass("modal fade").attr("tabindex", "-1").attr("role", "dialog").attr("id", id + "Modal");
    var document = $("<div/>").addClass("modal-dialog").attr("role", "document");
    var content = $("<div/>").addClass("modal-content");
    var header = $("<div/>").addClass("modal-header");
    var title = $("<h4/>").addClass("modal-title").html(title);

    var headerClose = $("<button/>").attr("type", "button").addClass("close").attr("data-dismiss", "modal").attr("aria-label", "Close");
    headerClose.html("<span aria-hidden='true'>&times;</span>");
    var body = $("<div/>").addClass("modal-body");
    body.html("asd");

    headerClose.appendTo(header);
    title.appendTo(header);
    header.appendTo(content);
    body.appendTo(content);
    content.appendTo(document);
    document.appendTo(modal);

    modal.on("show.bs.modal", function(event){
        initOptions(id);
    });

    return modal;
};

getButton = function(id, title) {
    var button = $("<a/>").addClass("btn btn-default form-control").attr("href", "#");
    button.attr("data-toggle", "modal").attr("data-target", "#" + id + "Modal").html( title);

    return button;
}

