$(document).ready(function(){

	//GLOBAL VAR
	var XMLSource = $('#data').attr('xmlData');
	var keyword = '';
	var catType = '';
	var pub = '';
						   
	var i = 0;
   
	$("#searchButton").click(function() {
		keyword = $("input#term").val();
		catType = $("#category option:selected").val();
		
		//Reset any message
		var errMsg = '';
		pub = '';
	
		if ( keyword == '' ) { errMsg += 'Please enter a search term' + '\n'; }
		else if ( catType == 'none' ) { errMsg += 'Please select a category' + '\n'; }
		else { searchThis(); }

		if ( errMsg != '' ) {
			pub += '<div class="error">' + '\n';
			pub += errMsg;
			pub += '</div>' + '\n';
		}
		
		//Show error
		$('#result').html( pub );

	});
	
	function searchThis() {				
		$.ajax({
			type: "GET",
			url: XMLSource,
			dataType: "xml",
			success: function(xml) { loadPublication (xml) }	
		});
	}
	
	function loadPublication (xmlData) {
		i = 0;
		var row;
		
		var searchExp = "";
		
		$(xmlData).find('index').each(function(){
			
			var name = $(this).find('name').text();
			var description = $(this).find('description').text();
			var artwork = $(this).find('artwork').text();
			
			//Format the keyword expression
			var exp = new RegExp(keyword,"gi");
			
			//Check if there is a category selected; 
			//if not, use height column as a default search
			if ( catType == 'name' ) { searchExp = name.match(exp); }
			else if ( catType == 'description' ) { searchExp = description.match(exp); }
			else if ( catType == 'artwork' ) { searchExp = artwork.match(exp); }
			
			if ( searchExp != null ) {
				
				//Start building the result
				if ((i % 2) == 0) { row = 'even'; }
				else { row = 'odd'; }
				
				i++;				
				
				pub += '<tr class="row ' + row + '">' + '\n';
				pub += '<td valign="top" class="col1">' + name + '</td>' + '\n';	
				pub += '<td valign="top" class="col2">' + description + '</td>' + '\n';	
				pub += '<td valign="top" class="col3">' + artwork + '</td>' + '\n';	
				pub += '</tr>' + '\n';
			}	
		});
				
		if ( i == 0 ) {
			pub += '<div class="error">' + '\n';
			pub += 'No Result was Found' + '\n';	
			pub += '</div>' + '\n';
			
			//Populate the result
			$('#result').html( pub );
		}
		else {
			//Pass the result set
			showResult ( pub );
		}
	}
	
	function showResult (resultSet) {

		//Show the result
		pub = '<div class="message">We found ' + i + ' matches!</div>';
		pub += '<table id="grid" border="0">' + '\n';
		pub += '<thead><tr>' + '\n';
		pub += '<th class="col1">Name</th>' + '\n';
		pub += '<th class="col2">Description</th>' + '\n';
		pub += '<th class="col3">Artwork</th>' + '\n';
		pub += '</tr></thead>' + '\n';
		pub += '<tbody>' + '\n';
		
		pub += resultSet;
		
		pub += '</tbody>' + '\n';
		pub += '</table>' + '\n';
		
		//Populate 
		$('#result').html(pub)
		
		$('#grid').tablesorter(); 
	}
});