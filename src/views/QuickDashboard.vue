<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <button
              @click="goBack"
              class="mr-4 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon class="h-6 w-6" />
            </button>
            <div class="flex items-center">
              <div class="flex flex-col space-y-1">
                <input
                  id="dashboardName"
                  v-model="dashboardName"
                  type="text"
                  placeholder="Enter dashboard name"
                  class="text-xl font-semibold text-gray-900 bg-transparent border-none focus:ring-0 focus:border-b-2 focus:border-primary-500 px-1 py-0.5 w-64"
                />
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="saveDashboard"
              :disabled="!dashboardName || Object.values(dashboardTabs).every(tab => tab.charts.length === 0)"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <DocumentCheckIcon class="h-4 w-4 mr-2" />
              Save Dashboard
            </button>
            <button
              @click="previewMode = true"
              :disabled="Object.values(dashboardTabs).every(tab => tab.charts.length === 0)"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v4m0 0l-4.553 2.276A2 2 0 014 17.618V19a2 2 0 002 2h12a2 2 0 002-2v-1.382a2 2 0 00-.447-1.342L15 14z" /></svg>
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex h-[calc(100vh-4rem)]">
      <!-- Left Sidebar -->
      <div
        v-if="!previewMode"
        class="bg-white border-r border-gray-200 flex flex-col"
        :style="{ width: leftSidebarWidth + 'px', minWidth: '180px', maxWidth: '400px' }"
      >
        <!-- Data Sources List -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-700">Data Sources</h3>
            <button
              @click="showDataSourceManager = true"
              class="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Cog6ToothIcon class="h-4 w-4 mr-1" />
              Manage
            </button>
          </div>
          <div class="p-4 space-y-2">
            <div v-for="ds in selectedDataSources" :key="ds.id" class="border rounded-lg overflow-hidden">
              <button
                @click="toggleDataSource(ds.id)"
                class="w-full px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
              >
                <span class="text-sm font-medium text-gray-900">{{ ds.name }}</span>
                <ChevronDownIcon
                  class="h-5 w-5 text-gray-500 transform transition-transform"
                  :class="{ 'rotate-180': expandedDataSources.includes(ds.id) }"
                />
              </button>
              <div v-if="expandedDataSources.includes(ds.id)" class="p-2 space-y-1">
                <!-- Normal fields -->
                <div
                  v-for="column in ds.columns.filter(c => !c.isCustom)"
                  :key="column.name"
                  :draggable="true"
                  @dragstart="onFieldDragStart($event, column, ds.id)"
                  class="flex items-center justify-between p-2 rounded cursor-move transition-colors duration-200"
                  :class="{
                    'bg-primary-50': isFieldInUse(column.name, ds.id),
                    'bg-white hover:bg-gray-50': !isFieldInUse(column.name, ds.id)
                  }"
                >
                  <div class="flex items-center">
                    <CheckIcon
                      v-if="isFieldInUse(column.name, ds.id)"
                      class="h-4 w-4 text-primary-600 mr-2"
                    />
                    <span class="text-sm font-medium text-gray-900">{{ column.name }}</span>
                  </div>
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-blue-100 text-blue-800': column.type === 'number',
                      'bg-green-100 text-green-800': column.type === 'date',
                      'bg-gray-100 text-gray-800': column.type === 'string'
                    }"
                  >
                    {{ column.type }}
                  </span>
                </div>
                <!-- Custom fields -->
                <div class="mt-2 border-t pt-2">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-semibold text-primary-700">Custom Fields</span>
                    <button @click="openCustomFieldModal(ds)" class="text-xs text-primary-600 hover:underline">+ Add</button>
                  </div>
                  <div v-for="column in ds.columns.filter(c => c.isCustom)" :key="column.name" class="flex items-center justify-between p-2 rounded mt-1">
                    <div class="flex items-center">
                      <CheckIcon
                        v-if="isFieldInUse(column.name, ds.id)"
                        class="h-4 w-4 text-primary-600 mr-2"
                      />
                      <span class="text-sm font-medium text-yellow-700 cursor-move" :draggable="true" @dragstart="onFieldDragStart($event, column, ds.id)">{{ column.name }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <button @click="editCustomFieldModal(ds, column)" class="p-1 text-gray-500 hover:text-primary-600" title="Edit">
                        <PencilIcon class="h-4 w-4" />
                      </button>
                      <button @click="removeCustomFieldModal(ds, column)" class="p-1 text-red-500 hover:text-red-700" title="Remove">
                        <TrashIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Source Manager Modal -->
      <TransitionRoot appear :show="showDataSourceManager" as="template">
        <Dialog as="div" @close="showDataSourceManager = false" class="relative z-50">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                    Manage Data Sources
                  </DialogTitle>
                  <div class="mt-4">
                    <div class="space-y-4">
                      <div v-for="ds in dataSourceStore.dataSources" :key="ds.id" class="flex items-center justify-between">
                        <div class="flex items-center">
                          <input
                            type="checkbox"
                            :id="'ds-' + ds.id"
                            v-model="selectedDataSources"
                            :value="ds"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label :for="'ds-' + ds.id" class="ml-2 block text-sm text-gray-900">
                            {{ ds.name }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-primary-100 px-4 py-2 text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                      @click="showDataSourceManager = false"
                    >
                      Done
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>

      <!-- Draggable Divider (between left sidebar and chart type col) -->
      <div
        v-if="!previewMode"
        class="resizer"
        @mousedown="startResizing('left')"
        :style="{ cursor: 'col-resize', width: '6px', background: '#e5e7eb', zIndex: 20 }"
      ></div>

      <!-- Chart Type & Properties Column -->
      <div
        v-if="!previewMode"
        class="bg-white border-r border-gray-200 flex flex-col"
        :style="{ width: chartTypeColWidth + 'px', minWidth: '200px', maxWidth: '400px' }"
      >
        <!-- Chart Type Selection -->
        <div class="p-4 border-b border-gray-200">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Chart Type
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="type in chartTypes"
              :key="type.value"
              @click="selectedChartType = type.value"
              :class="[
                'flex flex-col items-center p-3 border rounded-lg text-xs font-medium transition-colors duration-200',
                selectedChartType === type.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              ]"
            >
              <component :is="type.icon" class="h-5 w-5 mb-1" />
              {{ type.label }}
            </button>
          </div>
        </div>

        <!-- Chart Properties -->
        <div v-if="selectedChartType" class="p-4 border-t border-gray-200 flex-1 overflow-y-auto">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Chart Properties</h3>
          <div v-if="selectedDataSources.length === 0" class="text-sm text-gray-500 text-center py-4">
            Please select at least one data source to configure chart properties
          </div>
          <div v-else class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Chart Title</label>
              <input
                v-model="chartConfig.title"
                type="text"
                placeholder="Enter chart title"
                class="w-full text-sm rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div v-if="selectedChartType === 'card'">
              <label class="block text-xs font-medium text-gray-600 mb-1">Key Metric</label>
              <div
                @drop="onFieldDrop($event, 'keyMetric')"
                @dragover.prevent
                @dragenter.prevent
                class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex items-center justify-center hover:border-primary-400 transition-colors duration-200"
                :class="{ 'border-primary-400 bg-primary-50': chartConfig.keyMetric }"
              >
                {{ chartConfig.keyMetric || 'Drop key metric field here (numbers only)' }}
              </div>
              
              <div class="mt-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Previous Period Metric (Optional)</label>
                <div
                  @drop="onFieldDrop($event, 'previousMetric')"
                  @dragover.prevent
                  @dragenter.prevent
                  class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex items-center justify-center hover:border-primary-400 transition-colors duration-200"
                  :class="{ 'border-primary-400 bg-primary-50': chartConfig.previousMetric }"
                >
                  {{ chartConfig.previousMetric || 'Drop previous period field here (numbers only)' }}
                </div>
              </div>

              <div v-if="chartConfig.previousMetric" class="mt-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Difference Type</label>
                <select v-model="chartConfig.differenceType" class="w-full rounded border-gray-300 text-sm">
                  <option value="percentage">Percentage</option>
                  <option value="value">Value</option>
                </select>
              </div>
            </div>

            <div v-else-if="selectedChartType === 'pie'">
              <label class="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <div
                @drop="onFieldDrop($event, 'category')"
                @dragover.prevent
                @dragenter.prevent
                class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex items-center justify-center hover:border-primary-400 transition-colors duration-200"
                :class="{ 'border-primary-400 bg-primary-50': chartConfig.category }"
              >
                {{ chartConfig.category || 'Drop category field here' }}
              </div>
            </div>

            <div v-else-if="selectedChartType === 'bar'">
              <label class="block text-xs font-medium text-gray-600 mb-1">X-Axis (Dimensions)</label>
              <div
                @drop="onFieldDrop($event, 'xAxis')"
                @dragover.prevent
                @dragenter.prevent
                class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex flex-wrap items-center gap-2 hover:border-primary-400 transition-colors duration-200"
                :class="{ 'border-primary-400 bg-primary-50': Array.isArray(chartConfig.xAxis) && chartConfig.xAxis.length > 0 }"
              >
                <template v-if="Array.isArray(chartConfig.xAxis) && chartConfig.xAxis.length > 0">
                  <span v-for="(field, idx) in chartConfig.xAxis" :key="field" class="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 rounded mr-1">
                    {{ field }}
                    <button @click.stop="Array.isArray(chartConfig.xAxis) && chartConfig.xAxis.splice(idx, 1)" class="ml-1 text-xs text-primary-700 hover:text-red-500">&times;</button>
                  </span>
                </template>
                <span v-else>Drop X-axis fields here (dimensions)</span>
              </div>
              <div class="mt-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Y-Axis (Values)</label>
                <div
                  @drop="onFieldDrop($event, 'yAxis')"
                  @dragover.prevent
                  @dragenter.prevent
                  class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex items-center justify-center hover:border-primary-400 transition-colors duration-200"
                  :class="{ 'border-primary-400 bg-primary-50': chartConfig.yAxis }"
                >
                  {{ chartConfig.yAxis || 'Drop Y-axis field here (numbers only)' }}
                </div>
              </div>
            </div>

            <div v-else>
              <div class="space-y-2">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">X-Axis</label>
                  <div
                    @drop="onFieldDrop($event, 'xAxis')"
                    @dragover.prevent
                    @dragenter.prevent
                    class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex items-center justify-center hover:border-primary-400 transition-colors duration-200"
                    :class="{ 'border-primary-400 bg-primary-50': chartConfig.xAxis }"
                  >
                    {{ chartConfig.xAxis || 'Drop X-axis field here' }}
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Y-Axis</label>
                  <div
                    @drop="onFieldDrop($event, 'yAxis')"
                    @dragover.prevent
                    @dragenter.prevent
                    class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex items-center justify-center hover:border-primary-400 transition-colors duration-200"
                    :class="{ 'border-primary-400 bg-primary-50': chartConfig.yAxis }"
                  >
                    {{ chartConfig.yAxis || 'Drop Y-axis field here (numbers only)' }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selectedChartType === 'bar'" class="flex items-center gap-2 mt-2">
              <input type="checkbox" id="horizontalBar" v-model="chartConfig.horizontal" class="form-checkbox" />
              <label for="horizontalBar" class="text-xs font-medium text-gray-600">Flip to horizontal bar chart</label>
            </div>

            <div v-if="selectedChartType === 'bar'" class="mt-2">
              <label class="block text-xs font-medium text-gray-600 mb-1">Color Scheme</label>
              <select v-model="chartConfig.colorScheme" class="w-full rounded border-gray-300 text-sm">
                <option v-for="scheme in colorSchemes" :key="scheme.value" :value="scheme.value">{{ scheme.label }}</option>
              </select>
              <!-- Color scheme preview -->
              <div class="flex items-center gap-1 mt-2">
                <span v-for="(color, idx) in colorPalettes[chartConfig.colorScheme] && colorPalettes[chartConfig.colorScheme].slice(0, 8)" :key="color + idx"
                  class="w-5 h-5 rounded-full border border-gray-200" :style="{ background: color }"></span>
              </div>
            </div>

            <div v-if="selectedChartType !== 'card'" class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Background</label>
                <input
                  v-model="chartConfig.backgroundColor"
                  type="color"
                  class="w-full h-8 rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Border</label>
                <input
                  v-model="chartConfig.borderColor"
                  type="color"
                  class="w-full h-8 rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            <button
              @click="addOrUpdateChart"
              :disabled="!isChartConfigValid"
              class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <PlusIcon v-if="!editingChartId" class="h-4 w-4 mr-2" />
              <span v-if="editingChartId">Update Chart</span>
              <span v-else>Add to Dashboard</span>
            </button>
            <button v-if="editingChartId" @click="cancelEdit" class="w-full mt-2 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Draggable Divider (between chart type col and main dashboard) -->
      <div
        v-if="!previewMode"
        class="resizer"
        @mousedown="startResizing('chartType')"
        :style="{ cursor: 'col-resize', width: '6px', background: '#e5e7eb', zIndex: 20 }"
      ></div>

      <!-- Main Dashboard Area -->
      <div :class="['flex-1 p-6', previewMode ? 'bg-gray-900' : '']" style="position:relative;">
        <div class="bg-white rounded-lg shadow-sm h-full">
          <!-- Tab Bar -->
          <div v-if="showTabBar" class="border-b border-gray-200 px-6 pt-4">
            <div class="flex items-center justify-between">
              <div class="flex space-x-1 overflow-x-auto">
                <button
                  v-for="tab in tabList"
                  :key="tab.id"
                  @click="activeTabId = tab.id"
                  :class="[
                    'flex items-center px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors duration-200',
                    activeTabId === tab.id
                      ? 'text-primary-600 border-primary-500 bg-primary-50'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  <span>{{ tab.name }}</span>
                  <button
                    v-if="tabList.length > 1"
                    @click.stop="removeTab(tab.id)"
                    class="ml-2 text-gray-400 hover:text-red-500"
                  >
                    <XMarkIcon class="h-4 w-4" />
                  </button>
                </button>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="addNewTab"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded"
                >
                  <PlusIcon class="h-4 w-4 mr-1" />
                  Add Tab
                </button>
                <button
                  @click="toggleTabBarVisibility"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded"
                  :title="showTabBar ? 'Hide Tab Bar' : 'Show Tab Bar'"
                >
                  <EyeSlashIcon v-if="showTabBar" class="h-4 w-4" />
                  <EyeIcon v-else class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="p-6 h-full" :class="{ 'pt-2': showTabBar }">
            <div v-if="currentTab.charts.length === 0" class="flex items-center justify-center h-full text-gray-500">
              <div class="text-center">
                <Squares2X2Icon class="mx-auto h-12 w-12 mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">Start Building Your Dashboard</h3>
                <p class="text-sm text-gray-500">
                  Select a data source, choose a chart type, and drag fields to create your first chart.
                </p>
              </div>
            </div>

            <!-- GridStack Container -->
            <div v-else ref="gridStackContainer" class="grid-stack h-full">
              <div
                v-for="chart in currentTab.charts"
                :key="chart.id"
                class="grid-stack-item"
                :gs-id="chart.id"
                :gs-x="chart.layout.x"
                :gs-y="chart.layout.y"
                :gs-w="chart.layout.w"
                :gs-h="chart.layout.h"
              >
                <div class="grid-stack-item-content">
                  <div class="chart-header flex justify-end items-center gap-2">
                    <!-- 3-dot menu -->
                    <div class="relative">
                      <button v-if="!previewMode" @click="toggleChartMenu(chart.id)" class="chart-menu-btn p-1 rounded-full hover:bg-gray-100 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
                      </button>
                      <div v-if="openChartMenuId === chart.id && !previewMode" class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-30">
                        <button @click="editChart(chart)" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Edit</button>
                        <button @click="exportChart(chart, 'pdf')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Export PDF</button>
                        <button @click="exportChart(chart, 'png')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Export to PNG</button>
                        <button @click="removeChart(chart.id)" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove</button>
                      </div>
                    </div>
                  </div>
                  <div class="chart-content">
                    <ChartPreview :chart="chart.config" class="w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
            <!-- Exit Preview Button -->
            <button v-if="previewMode" @click="previewMode = false" class="absolute top-4 right-4 z-50 px-4 py-2 bg-white text-primary-700 border border-gray-300 rounded shadow hover:bg-gray-50">Exit Preview</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Field Modal -->
    <TransitionRoot appear :show="showCustomFieldModal" as="template">
      <Dialog as="div" @close="closeCustomFieldModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  {{ customFieldEditMode ? 'Edit Custom Field' : 'Add Custom Field' }}
                </DialogTitle>
                <div class="mt-4 space-y-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                    <input v-model="customFieldForm.name" type="text" class="w-full rounded border-gray-300 text-sm" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Expression</label>
                    <input v-model="customFieldForm.expression" type="text" class="w-full rounded border-gray-300 text-sm" placeholder="e.g. revenue - cost" />
                    <p class="text-xs text-gray-500 mt-1">Use existing field names as variables. Example: <span class="font-mono">revenue - cost</span></p>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Type</label>
                    <select v-model="customFieldForm.type" class="w-full rounded border-gray-300 text-sm">
                      <option value="number">Number</option>
                      <option value="string">String</option>
                      <option value="date">Date</option>
                    </select>
                  </div>
                </div>
                <div class="mt-6 flex justify-end gap-2">
                  <button @click="closeCustomFieldModal" class="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
                  <button @click="saveCustomField" class="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700">Save</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon,
  Squares2X2Icon,
  DocumentCheckIcon,
  ChartBarIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CreditCardIcon
} from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { GridStack } from 'gridstack'
import { useDataSourceStore, type DataSourceColumn } from '../stores/dataSource'
import { useDashboardStore } from '../stores/dashboard'
import { useChartStore, type ChartConfig } from '../stores/chart'
import ChartPreview from '../components/ChartPreview.vue'

const router = useRouter()
const route = useRoute()
const dataSourceStore = useDataSourceStore()
const dashboardStore = useDashboardStore()
const chartStore = useChartStore()

const dashboardName = ref('')
const dashboardDescription = ref('')
const selectedDataSourceId = ref('')
const selectedChartType = ref<ChartConfig['type'] | ''>('')
const gridStackContainer = ref<HTMLElement>()
let gridStack: GridStack | null = null

interface ChartItem {
  id: string
  config: Partial<ChartConfig>
  layout: {
    x: number
    y: number
    w: number
    h: number
  }
}

interface DashboardTab {
  id: string
  name: string
  charts: ChartItem[]
}

// Tab management
const dashboardTabs = ref<Record<string, DashboardTab>>({})
const activeTabId = ref('')
const showTabBar = ref(false)

// Initialize with first tab
const initializeTabs = () => {
  const firstTabId = 'tab-1'
  dashboardTabs.value = {
    [firstTabId]: {
      id: firstTabId,
      name: 'Tab 1',
      charts: []
    }
  }
  activeTabId.value = firstTabId
  showTabBar.value = false
}

const tabList = computed(() => Object.values(dashboardTabs.value))

const currentTab = computed(() => {
  return dashboardTabs.value[activeTabId.value] || { id: '', name: '', charts: [] }
})

const addNewTab = () => {
  const newTabId = `tab-${Date.now()}`
  const tabNumber = Object.keys(dashboardTabs.value).length + 1
  dashboardTabs.value[newTabId] = {
    id: newTabId,
    name: `Tab ${tabNumber}`,
    charts: []
  }
  activeTabId.value = newTabId
  showTabBar.value = true
}

const removeTab = (tabId: string) => {
  if (Object.keys(dashboardTabs.value).length <= 1) return
  
  if (confirm('Are you sure you want to remove this tab? All charts in this tab will be lost.')) {
    delete dashboardTabs.value[tabId]
    
    // Switch to first available tab
    const remainingTabs = Object.keys(dashboardTabs.value)
    if (remainingTabs.length > 0) {
      activeTabId.value = remainingTabs[0]
    }
    
    // Hide tab bar if only one tab remains
    if (remainingTabs.length <= 1) {
      showTabBar.value = false
    }
  }
}

const toggleTabBarVisibility = () => {
  showTabBar.value = !showTabBar.value
}

// Watch for tab changes to reinitialize GridStack
watch(activeTabId, () => {
  nextTick(() => {
    initializeGridStack()
  })
})

// Add color scheme options
const colorSchemes = [
  { value: 'default', label: 'Default' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'vivid', label: 'Vivid' },
  { value: 'earth', label: 'Earth' }
]

// Add color palettes for preview
const colorPalettes: Record<string, string[]> = {
  default: [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1',
    '#14b8a6', '#f43f5e', '#a855f7', '#22c55e', '#eab308'
  ],
  pastel: [
    '#a5b4fc', '#fbcfe8', '#bbf7d0', '#fde68a', '#ddd6fe',
    '#bae6fd', '#fed7aa', '#d9f99d', '#f9a8d4', '#c7d2fe',
    '#99f6e4', '#fecdd3', '#e9d5ff', '#bbf7d0', '#fef08a'
  ],
  vivid: [
    '#e11d48', '#2563eb', '#059669', '#f59e42', '#a21caf',
    '#0ea5e9', '#f43f5e', '#22d3ee', '#facc15', '#7c3aed',
    '#f472b6', '#16a34a', '#fbbf24', '#f87171', '#38bdf8'
  ],
  earth: [
    '#a16207', '#713f12', '#166534', '#155e75', '#7c2d12',
    '#be185d', '#4d7c0f', '#b91c1c', '#0e7490', '#a21caf',
    '#ca8a04', '#ea580c', '#15803d', '#1e293b', '#f59e42'
  ]
}

// Extend ChartConfigLike
interface ChartConfigLike {
  title: string
  xAxis: string[] | string
  yAxis: string
  category: string
  backgroundColor: string
  borderColor: string
  horizontal: boolean
  colorScheme: string
  dataSourceId: string
  keyMetric: string
  previousMetric: string
  differenceType: 'percentage' | 'value'
}

const chartConfig = reactive<ChartConfigLike>({
  title: '',
  xAxis: [],
  yAxis: '',
  category: '',
  backgroundColor: '#3b82f6',
  borderColor: '#1d4ed8',
  horizontal: false,
  colorScheme: 'default',
  dataSourceId: '',
  keyMetric: '',
  previousMetric: '',
  differenceType: 'percentage'
})

const chartTypes = [
  { value: 'bar', label: 'Bar', icon: ChartBarIcon },
  { value: 'line', label: 'Line', icon: PresentationChartLineIcon },
  { value: 'pie', label: 'Pie', icon: ChartPieIcon },
  { value: 'scatter', label: 'Scatter', icon: CircleStackIcon },
  { value: 'card', label: 'Card', icon: CreditCardIcon }
] as const

const selectedDataSource = computed(() => {
  if (!selectedDataSourceId.value) return null
  return dataSourceStore.getDataSourceById(selectedDataSourceId.value)
})

const isChartConfigValid = computed(() => {
  if (!selectedChartType.value) return false
  if (selectedChartType.value === 'card') {
    return !!chartConfig.keyMetric
  } else if (selectedChartType.value === 'pie') {
    return !!chartConfig.category
  } else if (selectedChartType.value === 'bar') {
    return Array.isArray(chartConfig.xAxis) && chartConfig.xAxis.length > 0 && !!chartConfig.yAxis
  } else {
    return !!chartConfig.xAxis && !!chartConfig.yAxis
  }
})

const onDataSourceChange = () => {
  resetChartConfig()
}

const resetChartConfig = () => {
  chartConfig.title = ''
  chartConfig.xAxis = []
  chartConfig.yAxis = ''
  chartConfig.category = ''
  chartConfig.horizontal = false
  chartConfig.dataSourceId = ''
  chartConfig.keyMetric = ''
  chartConfig.previousMetric = ''
  chartConfig.differenceType = 'percentage'
  selectedChartType.value = ''
}

const onFieldDragStart = (event: DragEvent, column: DataSourceColumn, dataSourceId: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', JSON.stringify({
      name: column.name,
      type: column.type,
      dataSourceId
    }))
  }
}

const onFieldDrop = (event: DragEvent, target: 'xAxis' | 'yAxis' | 'category' | 'keyMetric' | 'previousMetric') => {
  event.preventDefault()
  if (!event.dataTransfer) return
  try {
    const fieldData = JSON.parse(event.dataTransfer.getData('text/plain'))
    
    // Validate field type for numeric fields
    if ((target === 'yAxis' || target === 'keyMetric' || target === 'previousMetric') && fieldData.type !== 'number') {
      alert(`${target} requires a numeric field`)
      return
    }

    // Check if we already have fields from a different data source
    if (chartConfig.dataSourceId && chartConfig.dataSourceId !== fieldData.dataSourceId) {
      if (selectedChartType.value === 'bar' && Array.isArray(chartConfig.xAxis) && chartConfig.xAxis.length > 0) {
        alert('Cannot mix fields from different data sources in the same chart')
        return
      }
    }

    if (target === 'xAxis' && selectedChartType.value === 'bar') {
      // Add to array, no duplicates
      if (Array.isArray(chartConfig.xAxis) && !chartConfig.xAxis.includes(fieldData.name)) {
        chartConfig.xAxis.push(fieldData.name)
      }
    } else {
      chartConfig[target] = fieldData.name
    }
    // Store the data source ID for the chart
    chartConfig.dataSourceId = fieldData.dataSourceId
  } catch (error) {
    console.error('Failed to parse dropped field data:', error)
  }
}

const openChartMenuId = ref<string | null>(null)
const editingChartId = ref<string | null>(null)
const chartTypeColRef = ref<HTMLElement>()

const toggleChartMenu = (id: string) => {
  openChartMenuId.value = openChartMenuId.value === id ? null : id
}

const editChart = (chart: ChartItem) => {
  openChartMenuId.value = null
  editingChartId.value = chart.id
  selectedChartType.value = chart.config.type || ''
  chartConfig.title = chart.config.title || ''
  chartConfig.dataSourceId = chart.config.dataSourceId || ''
  
  if (chart.config.type === 'bar') {
    if (Array.isArray(chart.config.xAxis)) {
      chartConfig.xAxis = [...chart.config.xAxis]
    } else if (typeof chart.config.xAxis === 'string' && chart.config.xAxis) {
      chartConfig.xAxis = [chart.config.xAxis]
    } else {
      chartConfig.xAxis = []
    }
  } else {
    chartConfig.xAxis = typeof chart.config.xAxis === 'string' ? chart.config.xAxis : ''
  }
  chartConfig.yAxis = chart.config.yAxis || ''
  chartConfig.category = chart.config.category || ''
  chartConfig.backgroundColor = chart.config.backgroundColor || '#3b82f6'
  chartConfig.borderColor = chart.config.borderColor || '#1d4ed8'
  chartConfig.horizontal = chart.config.horizontal || false
  chartConfig.colorScheme = chart.config.colorScheme || 'default'
  chartConfig.keyMetric = chart.config.keyMetric || ''
  chartConfig.previousMetric = chart.config.previousMetric || ''
  chartConfig.differenceType = chart.config.differenceType || 'percentage'
}

const exportChart = (chart: ChartItem, type: 'pdf' | 'png') => {
  openChartMenuId.value = null
  alert(`Exporting chart '${chart.config.title || chart.config.name}' as ${type.toUpperCase()} (stub)`)
}

const addOrUpdateChart = () => {
  if (!isChartConfigValid.value || !chartConfig.dataSourceId) return
  if (editingChartId.value) {
    // Update existing chart
    const chart = currentTab.value.charts.find(c => c.id === editingChartId.value)
    if (chart) {
      chart.config = {
        ...chart.config,
        id: chart.id,
        name: chartConfig.title || `Chart ${currentTab.value.charts.length + 1}`,
        type: selectedChartType.value as ChartConfig['type'],
        dataSourceId: chartConfig.dataSourceId,
        xAxis: selectedChartType.value === 'bar' ? [...chartConfig.xAxis] : chartConfig.xAxis,
        yAxis: chartConfig.yAxis || undefined,
        category: chartConfig.category || undefined,
        title: chartConfig.title,
        backgroundColor: chartConfig.backgroundColor,
        borderColor: chartConfig.borderColor,
        horizontal: selectedChartType.value === 'bar' ? chartConfig.horizontal : undefined,
        colorScheme: selectedChartType.value === 'bar' ? chartConfig.colorScheme : undefined,
        keyMetric: selectedChartType.value === 'card' ? chartConfig.keyMetric : undefined,
        previousMetric: selectedChartType.value === 'card' ? chartConfig.previousMetric : undefined,
        differenceType: selectedChartType.value === 'card' ? chartConfig.differenceType : undefined,
        createdAt: chart.config.createdAt || new Date()
      }
    }
    editingChartId.value = null
    resetChartConfig()
    nextTick(() => initializeGridStack())
    return
  }
  // Add new chart
  addChart()
}

const cancelEdit = () => {
  editingChartId.value = null
  resetChartConfig()
}

const addChart = () => {
  if (!isChartConfigValid.value || !chartConfig.dataSourceId) return
  const chartId = Date.now().toString()
  const newChart: ChartItem = {
    id: chartId,
    config: {
      id: chartId,
      name: chartConfig.title || `Chart ${currentTab.value.charts.length + 1}`,
      type: selectedChartType.value as ChartConfig['type'],
      dataSourceId: chartConfig.dataSourceId,
      xAxis: selectedChartType.value === 'bar' ? [...chartConfig.xAxis] : chartConfig.xAxis,
      yAxis: chartConfig.yAxis || undefined,
      category: chartConfig.category || undefined,
      title: chartConfig.title,
      backgroundColor: chartConfig.backgroundColor,
      borderColor: chartConfig.borderColor,
      horizontal: selectedChartType.value === 'bar' ? chartConfig.horizontal : undefined,
      colorScheme: selectedChartType.value === 'bar' ? chartConfig.colorScheme : undefined,
      keyMetric: selectedChartType.value === 'card' ? chartConfig.keyMetric : undefined,
      previousMetric: selectedChartType.value === 'card' ? chartConfig.previousMetric : undefined,
      differenceType: selectedChartType.value === 'card' ? chartConfig.differenceType : undefined,
      createdAt: new Date()
    },
    layout: {
      x: 0,
      y: 0,
      w: selectedChartType.value === 'card' ? 3 : 6,
      h: selectedChartType.value === 'card' ? 2 : 4
    }
  }
  currentTab.value.charts.push(newChart)
  resetChartConfig()
  nextTick(() => {
    initializeGridStack()
  })
}

const removeChart = (chartId: string) => {
  if (confirm('Are you sure you want to remove this chart?')) {
    const tabCharts = currentTab.value.charts
    const index = tabCharts.findIndex(chart => chart.id === chartId)
    if (index > -1) {
      tabCharts.splice(index, 1)
    }
    
    nextTick(() => {
      initializeGridStack()
    })
  }
}

const initializeGridStack = async () => {
  if (!gridStackContainer.value || currentTab.value.charts.length === 0) return

  await nextTick()

  try {
    if (gridStack) {
      gridStack.destroy(false)
      gridStack = null
    }

    gridStack = GridStack.init({
      cellHeight: 70,
      verticalMargin: 10,
      horizontalMargin: 10,
      minRow: 1,
      animate: true,
      resizable: {
        handles: 'e, se, s, sw, w'
      },
      draggable: {
        handle: '.grid-stack-item-content',
        scroll: false
      }
    }, gridStackContainer.value)

    // Listen for layout changes
    gridStack.on('change', (event, items) => {
      items.forEach(item => {
        const chart = currentTab.value.charts.find(c => c.id === item.id)
        if (chart && item.x !== undefined && item.y !== undefined && item.w !== undefined && item.h !== undefined) {
          chart.layout = {
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h
          }
        }
      })
    })
  } catch (error) {
    console.error('Failed to initialize GridStack:', error)
  }
}

const saveDashboard = () => {
  if (!dashboardName.value || Object.values(dashboardTabs.value).every(tab => tab.charts.length === 0)) return

  // Save selected data source IDs
  const dataSourceIds = selectedDataSources.value.map(ds => ds.id)

  // Create dashboard with description and dataSourceIds
  const dashboard = dashboardStore.createDashboard(dashboardName.value, dashboardDescription.value, dataSourceIds)

  // Create and save charts from all tabs, then add widgets
  Object.values(dashboardTabs.value).forEach(tab => {
    tab.charts.forEach(chartItem => {
      // Create the chart in the chart store
      const savedChart = chartStore.createChart({
        name: chartItem.config.name!,
        type: chartItem.config.type!,
        dataSourceId: chartItem.config.dataSourceId!,
        xAxis: chartItem.config.xAxis,
        yAxis: chartItem.config.yAxis,
        category: chartItem.config.category,
        title: chartItem.config.title!,
        backgroundColor: chartItem.config.backgroundColor!,
        borderColor: chartItem.config.borderColor!,
        horizontal: chartItem.config.horizontal,
        colorScheme: chartItem.config.colorScheme,
        keyMetric: chartItem.config.keyMetric,
        previousMetric: chartItem.config.previousMetric,
        differenceType: chartItem.config.differenceType
      })

      // Add widget to dashboard
      dashboardStore.addWidget(dashboard.id, savedChart.id)
      
      // Update widget layout
      const widget = dashboard.widgets[dashboard.widgets.length - 1]
      if (widget) {
        dashboardStore.updateWidgetLayout(dashboard.id, widget.id, chartItem.layout)
      }
    })
  })

  // Navigate to the dashboard editor
  router.push(`/dashboard/${dashboard.id}`)
}

const goBack = () => {
  const hasCharts = Object.values(dashboardTabs.value).some(tab => tab.charts.length > 0)
  if (hasCharts) {
    if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
      router.push('/dashboards')
    }
  } else {
    router.push('/dashboards')
  }
}

// Resizable sidebar logic
const leftSidebarWidth = ref(240)
const chartTypeColWidth = ref(260)
const resizing = ref<'left' | 'chartType' | null>(null)
const startX = ref(0)
const startWidth = ref(0)

const startResizing = (which: 'left' | 'chartType') => {
  resizing.value = which
  startX.value = window.event instanceof MouseEvent ? window.event.clientX : 0
  startWidth.value = which === 'left' ? leftSidebarWidth.value : chartTypeColWidth.value
  document.addEventListener('mousemove', onResizing)
  document.addEventListener('mouseup', stopResizing)
}

const onResizing = (e: MouseEvent) => {
  if (!resizing.value) return
  const dx = e.clientX - startX.value
  if (resizing.value === 'left') {
    let newWidth = startWidth.value + dx
    newWidth = Math.max(180, Math.min(400, newWidth))
    leftSidebarWidth.value = newWidth
  } else if (resizing.value === 'chartType') {
    let newWidth = startWidth.value + dx
    newWidth = Math.max(200, Math.min(400, newWidth))
    chartTypeColWidth.value = newWidth
  }
}

const stopResizing = () => {
  resizing.value = null
  document.removeEventListener('mousemove', onResizing)
  document.removeEventListener('mouseup', stopResizing)
}

const previewMode = ref(false)

// Add new refs for data source management
const showDataSourceManager = ref(false)
const selectedDataSources = ref<Array<{ id: string; name: string; columns: DataSourceColumn[] }>>([])
const expandedDataSources = ref<string[]>([])

// Add toggle function for data source expansion
const toggleDataSource = (id: string) => {
  const index = expandedDataSources.value.indexOf(id)
  if (index === -1) {
    expandedDataSources.value.push(id)
  } else {
    expandedDataSources.value.splice(index, 1)
  }
}

// Add function to check if a field is in use
const isFieldInUse = (fieldName: string, dataSourceId: string) => {
  if (!selectedChartType.value || !chartConfig.dataSourceId) return false
  
  // Check if the field is from the same data source as the current chart
  if (chartConfig.dataSourceId !== dataSourceId) return false

  // Check if the field is used in any of the chart properties
  if (selectedChartType.value === 'card') {
    return chartConfig.keyMetric === fieldName || chartConfig.previousMetric === fieldName
  } else if (selectedChartType.value === 'pie') {
    return chartConfig.category === fieldName
  } else if (selectedChartType.value === 'bar') {
    return (
      (Array.isArray(chartConfig.xAxis) && chartConfig.xAxis.includes(fieldName)) ||
      chartConfig.yAxis === fieldName
    )
  } else {
    return chartConfig.xAxis === fieldName || chartConfig.yAxis === fieldName
  }
}

// Import store functions with unique names
const { addCustomField: storeAddCustomField, editCustomField: storeEditCustomField, removeCustomField: storeRemoveCustomField } = useDataSourceStore()

const showCustomFieldModal = ref(false)
const customFieldForm = ref({ name: '', expression: '', type: 'number' })
const customFieldEditMode = ref(false)
let customFieldTargetDataSource: any = null
let customFieldOriginalName = ''

function openCustomFieldModal(ds: any) {
  showCustomFieldModal.value = true
  customFieldEditMode.value = false
  customFieldForm.value = { name: '', expression: '', type: 'number' }
  customFieldTargetDataSource = ds
  customFieldOriginalName = ''
}
function editCustomFieldModal(ds: any, column: any) {
  showCustomFieldModal.value = true
  customFieldEditMode.value = true
  customFieldForm.value = { name: column.name, expression: column.expression || '', type: column.type }
  customFieldTargetDataSource = ds
  customFieldOriginalName = column.name
}
function closeCustomFieldModal() {
  showCustomFieldModal.value = false
  customFieldTargetDataSource = null
  customFieldOriginalName = ''
}
function saveCustomField() {
  if (!customFieldTargetDataSource) return
  if (!customFieldForm.value.name || !customFieldForm.value.expression) return
  if (customFieldEditMode.value) {
    storeEditCustomField(customFieldTargetDataSource, customFieldOriginalName, customFieldForm.value.name, customFieldForm.value.expression, customFieldForm.value.type as 'string' | 'number' | 'date')
  } else {
    storeAddCustomField(customFieldTargetDataSource, customFieldForm.value.name, customFieldForm.value.expression, customFieldForm.value.type as 'string' | 'number' | 'date')
  }
  closeCustomFieldModal()
}
function removeCustomFieldModal(ds: any, column: any) {
  storeRemoveCustomField(ds, column.name)
}

onMounted(async () => {
  // Initialize tabs first
  initializeTabs()
  
  const dashboardId = route.query.id as string | undefined
  if (dashboardId) {
    // Load dashboard for editing
    const dashboard = dashboardStore.dashboards.find(d => d.id === dashboardId)
    if (dashboard) {
      dashboardName.value = dashboard.name
      dashboardDescription.value = dashboard.description || ''
      // Restore selected data sources
      if (dashboard.dataSourceIds && dashboard.dataSourceIds.length > 0) {
        selectedDataSources.value = dataSourceStore.dataSources.filter(ds => dashboard.dataSourceIds!.includes(ds.id))
      }
      // Load charts for this dashboard into the first tab
      const charts = dashboard.widgets.map(widget => {
        const chart = chartStore.charts.find(c => c.id === widget.chartId)
        return chart
          ? {
              id: chart.id,
              config: { ...chart },
              layout: {
                x: widget.x,
                y: widget.y,
                w: widget.w,
                h: widget.h
              }
            }
          : null
      }).filter(Boolean) as ChartItem[]
      
      if (charts.length > 0) {
        currentTab.value.charts = charts
      }
      
      await nextTick()
      initializeGridStack()
    }
  }
})

onUnmounted(() => {
  if (gridStack) {
    gridStack.destroy(false)
    gridStack = null
  }
  document.removeEventListener('mousemove', onResizing)
  document.removeEventListener('mouseup', stopResizing)
})
</script>

<style scoped>
.chart-header {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.chart-menu-btn {
  color: #6b7280;
}
.chart-menu-btn:hover {
  color: #374151;
}

.chart-remove-btn {
  @apply bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 transition-opacity duration-200;
}

.chart-content {
  height: 100%;
  padding: 8px;
}

.grid-stack-item-content {
  position: relative;
  height: 100%;
  cursor: move;
}

/* GridStack overrides */
:deep(.grid-stack-item.ui-draggable-dragging) {
  opacity: 0.8;
}

:deep(.grid-stack-item.ui-resizable-resizing) {
  opacity: 0.8;
}

/* Drag and drop styling */
.border-dashed:hover {
  @apply border-primary-400;
}

.resizer {
  transition: background 0.2s;
}
.resizer:hover {
  background: #d1d5db;
}
</style>