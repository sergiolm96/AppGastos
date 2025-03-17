import { createExpenseChart } from './charts/expense_chart';
/**
 * Inicializa todos los gráficos de gastos en la página
 */
function initExpenseCharts() {
    // Busca todos los canvas que tengan datos de gastos
    const expenseCanvas = document.getElementById('grafico-gastos');
    if (expenseCanvas) {
        try {
            // Obtenemos los datos del atributo y los parseamos
            const gastosDataString = expenseCanvas.getAttribute('data-gastos') || '[]';
            const gastosData = JSON.parse(gastosDataString);
            // Creamos el gráfico
            const chart = createExpenseChart(expenseCanvas, gastosData);
            if (!chart) {
                console.warn('No se pudo crear el gráfico de gastos');
            }
        }
        catch (error) {
            console.error('Error al inicializar el gráfico de gastos:', error);
        }
    }
}
/**
 * Función principal que inicializa toda la aplicación
 */
function initApp() {
    console.log('Inicializando aplicación...');
    // Inicializamos los gráficos de gastos
    initExpenseCharts();
    console.log('Aplicación inicializada correctamente');
}
// Ejecutamos la inicialización cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initApp);
//# sourceMappingURL=main.js.map