$("[id*=del]").click((e) => {
    let confirmation = confirm('Estas a punto de eliminar una bandeja. ¿Seguro?')

    if (confirmation) {
        let bandejaId = e.originalEvent.toElement.id
        let id = bandejaId.substr(bandejaId.lastIndexOf('-') + 1, bandejaId.length)

        $.ajax({
            url: '/admin/bandejaClear/' + id,
            type: 'DELETE',
            success: function (result) {
                console.log(result);
            }
        })
    }
})