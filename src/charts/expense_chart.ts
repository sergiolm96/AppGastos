import Chart from 'chart.js/auto';

// Definimos la interfaz para nuestros datos de gastos
export interface Expense {
  fecha: string;
  cantidad: number;
  descripcion?: string;
  categoria: string;
  categoria_id?: string;
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
 * Obtiene los colores de las categorías desde window.categoryColors o usa colores por defecto
 * @returns Array de colores para cada categoría
 */
function getCategoryColors(): string[] {
  return (window as any).categoryColors || [
    '#4cc9f0', // Comida
    '#4361ee', // Limpieza
    '#3a0ca3', // Coche
    '#7209b7', // Ocio
    '#f72585', // Salud
    '#4caf50', // Educación
    '#ff9800', // Gatos
    '#f44336'  // Otros
  ];
}

/**
 * Crea un gráfico de donut para visualizar gastos por categoría
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

  // Agrupar gastos por categoría
  const categorias = [...new Set(expenses.map(expense => expense.categoria))];
  const gastosPorCategoria = categorias.map(categoria => {
    const gastosCategoria = expenses.filter(expense => expense.categoria === categoria);
    return gastosCategoria.reduce((sum, expense) => sum + expense.cantidad, 0);
  });

  // Obtener colores para cada categoría
  const categoryColors = getCategoryColors();
  
  const colores = categorias.map(categoria => {
    const expense = expenses.find(exp => exp.categoria === categoria);
    if (expense && expense.categoria_id) {
      const categoryIndex = parseInt(expense.categoria_id) - 1;
      return categoryColors[categoryIndex] || categoryColors[7]; // Usar "Otros" si no hay color específico
    }
    return categoryColors[7]; // Color por defecto
  });

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categorias,
      datasets: [{
        data: gastosPorCategoria,
        backgroundColor: colores,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          display: false // Ocultamos la leyenda default porque usamos nuestra propia leyenda
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: €${value} (${percentage}%)`;
            }
          }
        }
      },
      cutout: '60%'
    }
  });
}

/**
 * Actualiza un gráfico existente con nuevos datos
 * @param chart - Instancia del gráfico a actualizar
 * @param expenses - Nuevos datos de gastos
 */
export function updateExpenseChart(chart: Chart, expenses: Expense[]): void {
  if (!expenses || expenses.length === 0) {
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.update();
    return;
  }

  // Agrupar gastos por categoría
  const categorias = [...new Set(expenses.map(expense => expense.categoria))];
  const gastosPorCategoria = categorias.map(categoria => {
    const gastosCategoria = expenses.filter(expense => expense.categoria === categoria);
    return gastosCategoria.reduce((sum, expense) => sum + expense.cantidad, 0);
  });

  // Obtener colores para cada categoría
  const categoryColors = getCategoryColors();
  
  const colores = categorias.map(categoria => {
    const expense = expenses.find(exp => exp.categoria === categoria);
    if (expense && expense.categoria_id) {
      const categoryIndex = parseInt(expense.categoria_id) - 1;
      return categoryColors[categoryIndex] || categoryColors[7]; // Usar "Otros" si no hay color específico
    }
    return categoryColors[7]; // Color por defecto
  });

  chart.data.labels = categorias;
  chart.data.datasets[0].data = gastosPorCategoria;
  chart.data.datasets[0].backgroundColor = colores;
  chart.update();
}

/**
 * Calcula y muestra el resumen de gastos
 * @param expenses - Array de gastos
 */
export function updateExpenseSummary(expenses: Expense[]): void {
  if (!expenses || expenses.length === 0) {
    document.getElementById('total-gastos')!.textContent = '€0.00';
    document.getElementById('promedio-gastos')!.textContent = '€0.00';
    document.getElementById('categoria-principal')!.textContent = '-';
    return;
  }
  
  const total = expenses.reduce((sum, expense) => sum + expense.cantidad, 0);
  const promedio = total / expenses.length;
  
  // Encontrar categoría principal
  const categoriaCount: Record<string, number> = {};
  expenses.forEach(expense => {
    categoriaCount[expense.categoria] = (categoriaCount[expense.categoria] || 0) + expense.cantidad;
  });
  
  let categoriaPrincipal = '';
  let maxGasto = 0;
  
  for (const [categoria, cantidad] of Object.entries(categoriaCount)) {
    if (cantidad > maxGasto) {
      maxGasto = cantidad;
      categoriaPrincipal = categoria;
    }
  }
  
  // Actualizar elementos del DOM
  document.getElementById('total-gastos')!.textContent = `€${total.toFixed(2)}`;
  document.getElementById('promedio-gastos')!.textContent = `€${promedio.toFixed(2)}`;
  document.getElementById('categoria-principal')!.textContent = categoriaPrincipal;
}