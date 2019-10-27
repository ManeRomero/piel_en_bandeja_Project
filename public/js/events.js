$("[id*=del]").click((e) => {
    let confirmation = confirm('Estas a punto de eliminar una bandeja. ¿Seguro?')
    if (!confirmation) {
        e.preventDefault()
        e.stopPropagation()
    }
})

$(function() {
    // Multiple images preview in browser
    var imagesPreview = function(input, placeToInsertImagePreview) {

        if (input.files) {
            var filesAmount = input.files.length;

            for (i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = function(event) {
                    $($.parseHTML('<img>')).attr('src', event.target.result).attr('class', 'img-fluid mx-auto p-4').appendTo(placeToInsertImagePreview);
                }

                reader.readAsDataURL(input.files[i]);
            }
        }
    };

    $('#inputImages').on('change', function() {
        imagesPreview(this, 'div.galeria');
    });
});