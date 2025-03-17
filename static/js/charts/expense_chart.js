import Chart from 'chart.js/auto';
/**
 * Crea un gráfico de barras para visualizar gastos
 * @param canvas - El elemento canvas donde dibujar el gráfico
 * @param expenses - Array de datos de gastos
 * @returns La instancia de Chart o null si no se pudo crear
 */
export function createExpenseChart(canvas, expenses) {
    if (!canvas || !expenses || expenses.length === 0) {
        return null;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('No se pudo obtener el contexto 2D del canvas');
        return null;
    }
    const labels = expenses.map(expense => expense.fecha);
    const data = expenses.map(expense => expense.cantidad);
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                    label: 'Gastos por Fecha',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
//# sourceMappingURL=expense_chart.js.map