; (function($) {


$(document).ready(function(){

  loadDropdown( $('#model') );

});


function loadDropdown(dropdown) {

  dropdown.attr( 'disabled','disabled' );

  $.ajax( {
    url: 'data/models.txt',
    method: 'get',
    success: function(rsp) {

      $.each( rsp.split('\n'), function(i, line) {

        var fields = line.split(' ');
        if (fields.length < 2) return null;

        dropdown.append(
          $("<option></option>")
            .attr("value",fields[0])
            .text(fields[0]+' ('+fields[1]+' postings)')
        );

      } );

      dropdown.change( function() { loadPlot($(this).val()) } );
      dropdown.removeAttr( 'disabled' );
      dropdown.val( $('option:first', dropdown).val() );
      dropdown.trigger( 'change' );
    }
  } );

}


function loadPlot(name) {

  if (!name)
    return false;

  $('#plot').html('<div class="message">loading...</div>');

  $.ajax( {
    url: 'data/price-data/'+name+'.txt',
    method: 'get',
    success: function(rsp) {

      var data = [];
      var datalabels = [];
      var lines = rsp.split('\n');
      var line_re = /^(\S+)\s+(\S+)\s+(.*)$/;

      $.each( lines, function(i, line) {
        if (m = line.match(line_re)) {
          var vals = [];
          vals[0] = 1000 * parseInt(m[1]); // UTC secs to ms
          vals[1] = parseInt(m[2]);
          data.push( vals );
          datalabels.push( m[3] );
        }
      } );

      $.plot($("#plot"),
        [
          {
            data: data,
            datalabels: datalabels,
            label: 'Posted Price',
            points: { show: true }
          }
        ],
        {
          xaxis: {
            mode: 'time',
            timeformat: '%y/%m/%d'
          },
          yaxis: {
            tickFormatter: function(v, axis) {
              return '$'+v.toFixed(axis.tickDecimals);
            }
          },
          grid: { hoverable: true },
          zoom: { interactive: true },
          pan: { interactive: true }
        }
      );

      setupTooltip($('#plot'));

    }
  } );

}


function setupTooltip(elem) {

  var previousPoint = null;

  $(elem).bind("plothover", function (event, pos, item) {

    if (item) {
      if (previousPoint != item.datapoint) {
        previousPoint = item.datapoint;
        
        $("#tooltip").remove();
        var x = item.datapoint[0].toFixed(2),
            y = item.datapoint[1].toFixed(2);
     
        var index = item.dataIndex;
        var label = item.series.datalabels[index];
        var d = new Date(item.datapoint[0]);
        var timestamp = d.getFullYear()+'/'+d.getMonth()+'/'+d.getDay();

        showTooltip(item.pageX, item.pageY, '$'+y+' '+label+' ('+timestamp+')');
      }
    }
    else {
      $("#tooltip").remove();
      previousPoint = null;            
    }

  });
}


function showTooltip(x, y, contents) {
  $('<div id="tooltip">' + contents + '</div>').css(
    {
      position: 'absolute',
      display: 'none',
      top: y + 5,
      left: x + 5,
      border: '1px solid #fdd',
      padding: '2px',
      'background-color': '#fee',
      opacity: 0.80
    }
  ).appendTo("body").fadeIn(200);
}


})(jQuery);
