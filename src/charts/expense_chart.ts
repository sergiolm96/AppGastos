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
 * Crea un gráfico para visualizar gastos por categoría
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

  // Convertir y ordenar fechas cronológicamente (de más antigua a más reciente)
  const fechasOrdenadas = [...new Set(expenses.map(expense => expense.fecha))]
    .sort((a, b) => {
      return parseDate(a).getTime() - parseDate(b).getTime();
    });
  
  // Obtener categorías únicas
  const categorias = [...new Set(expenses.map(expense => expense.categoria))];
  
  // Obtener colores para cada categoría
  const categoryColors = getCategoryColors();
  
  // Crear datasets para cada categoría
  const datasets = categorias.map((categoria) => {
    // Encontrar un gasto de esta categoría para obtener su ID
    const expense = expenses.find(exp => exp.categoria === categoria);
    let colorIndex = 7; // "Otros" por defecto
    
    if (expense && expense.categoria_id) {
      colorIndex = parseInt(expense.categoria_id) - 1;
    }
    
    // Datos de esta categoría para cada fecha
    const data = fechasOrdenadas.map(fecha => {
      const gastosEnFechaYCategoria = expenses.filter(
        expense => expense.fecha === fecha && expense.categoria === categoria
      );
      return gastosEnFechaYCategoria.reduce((sum, expense) => sum + expense.cantidad, 0);
    });
    
    return {
      label: categoria,
      data: data,
      backgroundColor: categoryColors[colorIndex] || categoryColors[7],
      borderWidth: 1
    };
  });

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: fechasOrdenadas,
      datasets: datasets
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Fecha'
          }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Cantidad (€)'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          display: true // Mostramos la leyenda para identificar categorías
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const label = context.dataset.label || '';
              const value = context.raw || 0;
              return `${label}: €${value.toFixed(2)}`;
            },
            footer: function(tooltipItems: any) {
              let sum = 0;
              tooltipItems.forEach((tooltipItem: any) => {
                sum += tooltipItem.parsed.y;
              });
              return `Total: €${sum.toFixed(2)}`;
            }
          }
        }
      }
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
    chart.data.datasets = [];
    chart.update();
    return;
  }

  // Convertir y ordenar fechas cronológicamente (de más antigua a más reciente)
  const fechasOrdenadas = [...new Set(expenses.map(expense => expense.fecha))]
    .sort((a, b) => {
      return parseDate(a).getTime() - parseDate(b).getTime();
    });
  
  // Obtener categorías únicas
  const categorias = [...new Set(expenses.map(expense => expense.categoria))];
  
  // Obtener colores para cada categoría
  const categoryColors = getCategoryColors();
  
  // Crear datasets para cada categoría
  const datasets = categorias.map((categoria) => {
    // Encontrar un gasto de esta categoría para obtener su ID
    const expense = expenses.find(exp => exp.categoria === categoria);
    let colorIndex = 7; // "Otros" por defecto
    
    if (expense && expense.categoria_id) {
      colorIndex = parseInt(expense.categoria_id) - 1;
    }
    
    // Datos de esta categoría para cada fecha
    const data = fechasOrdenadas.map(fecha => {
      const gastosEnFechaYCategoria = expenses.filter(
        expense => expense.fecha === fecha && expense.categoria === categoria
      );
      return gastosEnFechaYCategoria.reduce((sum, expense) => sum + expense.cantidad, 0);
    });
    
    return {
      label: categoria,
      data: data,
      backgroundColor: categoryColors[colorIndex] || categoryColors[7],
      borderWidth: 1
    };
  });

  chart.data.labels = fechasOrdenadas;
  chart.data.datasets = datasets;
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