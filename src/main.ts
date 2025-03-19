import { createExpenseChart, updateExpenseChart, updateExpenseSummary, Expense, FilterOptions, filterExpenses } from './charts/expense_chart';
import { Chart } from 'chart.js';

let allExpenses: Expense[] = [];
let currentChart: Chart | null = null;

/**
 * Inicializa todos los gráficos de gastos en la página
 */
function initExpenseCharts(): void {
  // Busca todos los canvas que tengan datos de gastos
  const expenseCanvas = document.getElementById('grafico-gastos') as HTMLCanvasElement;
  
  if (expenseCanvas) {
    try {
      // Obtenemos los datos del atributo y los parseamos
      const gastosDataString = expenseCanvas.getAttribute('data-gastos') || '[]';
      console.log("Datos de gastos (string):", gastosDataString); // Depurar
      allExpenses = JSON.parse(gastosDataString) as Expense[];
      console.log("Datos de gastos (JSON):", allExpenses); // Depurar
      
      // Creamos el gráfico
      currentChart = createExpenseChart(expenseCanvas, allExpenses);
      
      if (!currentChart) {
        console.warn('No se pudo crear el gráfico de gastos');
      } else {
        // Actualizamos el resumen de gastos
        updateExpenseSummary(allExpenses);
      }
    } catch (error) {
      console.error('Error al inicializar el gráfico de gastos:', error);
    }
  }
}

/**
 * Aplica los filtros seleccionados
 */
function applyFilters(): void {
  const startDate = (document.getElementById('fecha-inicio') as HTMLInputElement).value;
  const endDate = (document.getElementById('fecha-fin') as HTMLInputElement).value;
  const category = (document.getElementById('categoria-filtro') as HTMLSelectElement).value;
  
  const filters: FilterOptions = {
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    category: category || undefined
  };
  
  // Filtrar los gastos
  const filteredExpenses = filterExpenses(allExpenses, filters);
  
  // Actualizar el gráfico
  if (currentChart) {
    updateExpenseChart(currentChart, filteredExpenses);
  }
  
  // Actualizar el resumen
  updateExpenseSummary(filteredExpenses);
  
  // Actualizar la tabla
  updateExpenseTable(filteredExpenses);
}

/**
 * Actualiza la tabla de gastos con los datos filtrados
 */
function updateExpenseTable(expenses: Expense[]): void {
  const tbody = document.getElementById('gastos-tabla');
  if (!tbody) return;
  
  // Limpiar la tabla actual
  tbody.innerHTML = '';
  
  // Si no hay gastos filtrados, mostrar mensaje
  if (expenses.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.textContent = 'No hay gastos que coincidan con los filtros seleccionados.';
    td.className = 'empty-message';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }
  
  // Crear nuevas filas para cada gasto
  expenses.forEach(expense => {
    const tr = document.createElement('tr');
    
    // Añadimos la clase de categoría para estilos
    if (expense.categoria_id) {
      tr.className = `category-row-${expense.categoria_id}`;
    }
    
    const tdFecha = document.createElement('td');
    tdFecha.textContent = expense.fecha;
    
    const tdDescripcion = document.createElement('td');
    tdDescripcion.textContent = expense.descripcion || '';
    
    const tdCantidad = document.createElement('td');
    tdCantidad.className = 'amount';
    tdCantidad.textContent = `€${expense.cantidad}`;
    
    const tdCategoria = document.createElement('td');
    const spanCategoria = document.createElement('span');
    if (expense.categoria_id) {
      spanCategoria.className = `category-badge category-${expense.categoria_id}`;
    } else {
      spanCategoria.className = 'category-badge';
    }
    spanCategoria.textContent = expense.categoria;
    tdCategoria.appendChild(spanCategoria);
    
    tr.appendChild(tdFecha);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdCantidad);
    tr.appendChild(tdCategoria);
    
    tbody.appendChild(tr);
  });
}

/**
 * Resetea los filtros a sus valores predeterminados
 */
function resetFilters(): void {
  (document.getElementById('fecha-inicio') as HTMLInputElement).value = '';
  (document.getElementById('fecha-fin') as HTMLInputElement).value = '';
  (document.getElementById('categoria-filtro') as HTMLSelectElement).value = 'todas';
  
  // Actualizar el gráfico con todos los gastos
  if (currentChart) {
    updateExpenseChart(currentChart, allExpenses);
  }
  
  // Actualizar el resumen
  updateExpenseSummary(allExpenses);
  
  // Actualizar la tabla con todos los gastos
  updateExpenseTable(allExpenses);
}

/**
 * Configura los colores de categorías basados en las variables CSS
 */
function setupCategoryColors(): void {
  // Verificamos si ya existen los colores en window
  if (!(window as any).categoryColors) {
    try {
      const getCategoryColor = (categoryId: number) => {
        const root = getComputedStyle(document.documentElement);
        return root.getPropertyValue(`--category-${categoryId}`).trim();
      };

      // Colores para cada categoría
      (window as any).categoryColors = [
        getCategoryColor(1), // Comida
        getCategoryColor(2), // Limpieza
        getCategoryColor(3), // Coche
        getCategoryColor(4), // Ocio
        getCategoryColor(5), // Salud
        getCategoryColor(6), // Educación
        getCategoryColor(7), // Gatos
        getCategoryColor(8)  // Otros
      ];
    } catch (error) {
      console.warn('No se pudieron obtener los colores de las variables CSS:', error);
      // Usaremos los colores por defecto definidos en expense_chart.ts
    }
  }
}

/**
 * Función principal que inicializa toda la aplicación
 */
function initApp(): void {
  console.log('Inicializando aplicación...');
  
  // Configuramos los colores de las categorías
  setupCategoryColors();
  
  // Inicializamos los gráficos de gastos
  initExpenseCharts();
  
  // Configuramos los listeners para los botones de filtro
  const applyButton = document.getElementById('aplicar-filtros');
  if (applyButton) {
    applyButton.addEventListener('click', applyFilters);
  }
  
  const resetButton = document.getElementById('resetear-filtros');
  if (resetButton) {
    resetButton.addEventListener('click', resetFilters);
  }
  
  console.log('Aplicación inicializada correctamente');
}

// Ejecutamos la inicialización cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initApp);