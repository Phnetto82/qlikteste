/*
 * Vendas Digitais v2 — Mashup Lojas Guaibim
 */
var config = {
    host: 'itprime1.us.qlikcloud.com',
    prefix: '/',
    port: 443,
    isSecure: true,
    webIntegrationId: 'c-VhSZRiU4yEjR-fBb_WELv6p2Z8cE7M'
};
 
require.config({
    baseUrl: (config.isSecure ? "https://" : "http://") + config.host +
             (config.port ? ":" + config.port : "") + config.prefix + "resources"
});
 
require( ["js/qlik"], function ( qlik ) {
	qlik.on( "error", function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		$( '#popup' ).fadeIn( 1000 );
	} );
	$( "#closePopup" ).click( function () {
		$( '#popup' ).hide();
	} );
 
    var app = qlik.openApp('9e8c9ec2-fca4-4a81-bb27-10e2eae77cd8', config);
 
    // KPI — Vendas e Margem
    app.visualization.get('CafYhC').then(function(vis) { vis.show("QV01"); });
 
    // KPI — Indicadores secundários
    app.visualization.get('fJyTk').then(function(vis) { vis.show("QV02"); });
 
    // Barchart — Vendas por Linha
    app.visualization.get('Lzvxpm').then(function(vis) { vis.show("QV03"); });
 
    // Linechart — Evolução Mensal
    app.visualization.get('GumJRHj').then(function(vis) { vis.show("QV04"); });
 
    // Piechart — Distribuição por Canal
    app.visualization.get('WmRKX').then(function(vis) { vis.show("QV05"); });
 
    // Linechart — Tendência
    app.visualization.get('bATEtJM').then(function(vis) { vis.show("QV06"); });
 
});
