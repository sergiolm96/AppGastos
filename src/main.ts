import { createExpenseChart, updateExpenseChart, Expense, FilterOptions, filterExpenses } from './charts/expense_chart';
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
  
  // Actualizar la tabla
  updateExpenseTable(filteredExpenses);
}

/**
 * Actualiza la tabla de gastos con los datos filtrados
 */
function updateExpenseTable(expenses: Expense[]): void {
  const tbody = document.getElementById('gastos-tabla');
  if (!tbody) return;
  
  // Obtener todas las filas
  const rows = tbody.querySelectorAll('tr');
  
  // Si no hay gastos filtrados, ocultar todas las filas
  if (expenses.length === 0) {
    rows.forEach(row => row.style.display = 'none');
    return;
  }
  
  // Crear un mapa para búsqueda rápida
  const expenseMap = new Map();
  expenses.forEach(expense => {
    const key = `${expense.fecha}-${expense.categoria}-${expense.descripcion}-${expense.cantidad}`;
    expenseMap.set(key, true);
  });
  
  // Mostrar u ocultar filas según corresponda
  rows.forEach(row => {
    const fecha = row.getAttribute('data-fecha');
    const categoria = row.getAttribute('data-categoria');
    const descripcion = row.querySelector('td:nth-child(2)')?.textContent || '';
    const cantidad = parseFloat(row.querySelector('td:nth-child(3)')?.textContent || '0');
    
    const key = `${fecha}-${categoria}-${descripcion}-${cantidad}`;
    
    if (expenseMap.has(key)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
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
  
  // Mostrar todas las filas de la tabla
  const tbody = document.getElementById('gastos-tabla');
  if (tbody) {
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => row.style.display = '');
  }
}

/**
 * Función principal que inicializa toda la aplicación
 */
function initApp(): void {
  console.log('Inicializando aplicación...');
  
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