import Chart from 'chart.js/auto';

// Definimos la interfaz para nuestros datos de gastos
export interface Expense {
  fecha: string;
  cantidad: number;
  descripcion?: string;
  categoria: string;
}

// Interfaz para opciones de filtro
export interface FilterOptions {
  startDate?: string;
  endDate?: string;
  category?: string;
}

/**
 * Filtra los gastos según los criterios proporcionados
 * @param expenses - Array de gastos a filtrar
 * @param filters - Opciones de filtrado
 * @returns Array de gastos filtrados
 */
export function filterExpenses(expenses: Expense[], filters: FilterOptions): Expense[] {
  return expenses.filter(expense => {
    // Filtro por fecha de inicio
    if (filters.startDate) {
      const expenseDate = parseDate(expense.fecha);
      const startDate = new Date(filters.startDate);
      if (expenseDate < startDate) return false;
    }
    
    // Filtro por fecha final
    if (filters.endDate) {
      const expenseDate = parseDate(expense.fecha);
      const endDate = new Date(filters.endDate);
      if (expenseDate > endDate) return false;
    }
    
    // Filtro por categoría
    if (filters.category && filters.category !== 'todas') {
      if (expense.categoria !== filters.category) return false;
    }
    
    return true;
  });
}

/**
 * Convierte una fecha en formato DD-MM-YYYY a un objeto Date
 * @param dateStr - String de fecha en formato DD-MM-YYYY
 * @returns Objeto Date
 */
function parseDate(dateStr: string): Date {
  const parts = dateStr.split('-');
  // Si la fecha está en formato DD-MM-YYYY
  if (parts.length === 3 && parts[0].length === 2) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }
  // Si ya está en formato YYYY-MM-DD
  return new Date(dateStr);
}

/**
 * Crea un gráfico de barras para visualizar gastos
 * @param canvas - El elemento canvas donde dibujar el gráfico
 * @param expenses - Array de datos de gastos
 * @returns La instancia de Chart o null si no se pudo crear
 */
export function createExpenseChart(canvas: HTMLCanvasElement, expenses: Expense[]): Chart | null {
  if (!canvas || !expenses || expenses.length === 0) {
    return null;
  }

  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('No se pudo obtener el contexto 2D del canvas');
    return null;
  }

  // Agrupar gastos por fecha
  const gastosPorFecha: Record<string, number> = {};
  expenses.forEach(expense => {
    if (gastosPorFecha[expense.fecha]) {
      gastosPorFecha[expense.fecha] += expense.cantidad;
    } else {
      gastosPorFecha[expense.fecha] = expense.cantidad;
    }
  });

  const labels = Object.keys(gastosPorFecha);
  const data = Object.values(gastosPorFecha);

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

// Función para actualizar un gráfico existente con nuevos datos
export function updateExpenseChart(chart: Chart, expenses: Expense[]): void {
  // Agrupar gastos por fecha
  const gastosPorFecha: Record<string, number> = {};
  expenses.forEach(expense => {
    if (gastosPorFecha[expense.fecha]) {
      gastosPorFecha[expense.fecha] += expense.cantidad;
    } else {
      gastosPorFecha[expense.fecha] = expense.cantidad;
    }
  });

  chart.data.labels = Object.keys(gastosPorFecha);
  chart.data.datasets[0].data = Object.values(gastosPorFecha);
  chart.update();
}