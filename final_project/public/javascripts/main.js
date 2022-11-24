$(document).ready(function() {
    $('.delete-movie').on('click', function(e){
        //Get the attribute of the element -- data-id
        const id = $(e.target).attr('data-id')
        $.ajax({
            type: "DELETE",
            // the URL of the data that to delete
            url: "/movie/single/"+id,
            success: function(res){
                alert("Deleting Movie");
                //window.location.href="http://localhost:8000";
                window.location.replace("http://localhost:8080");
            },
            error: function(err){
                $( "p" ).append( "Cannot Delete..." );
            }
        })
    })
})