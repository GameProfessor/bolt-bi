<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="text-center">
        <ChartBarIcon class="mx-auto h-12 w-12 text-primary-500" />
        <h1 class="mt-4 text-3xl font-bold text-gray-900">Business Intelligence Dashboard</h1>
        <p class="mt-2 text-lg text-gray-600">
          Create powerful data visualizations and interactive dashboards from your CSV data
        </p>
      </div>

      <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <TableCellsIcon class="h-8 w-8 text-primary-500" />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Data Sources</h3>
                <p class="text-sm text-gray-600">{{ dataSourceStore.dataSources.length }} data sources</p>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-gray-500">
                Upload and manage CSV files to create data sources for your charts and dashboards.
              </p>
              <div class="mt-3">
                <router-link
                  to="/data-sources"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 transition-colors duration-200"
                >
                  Manage Data Sources
                  <ArrowRightIcon class="ml-2 h-4 w-4" />
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <PresentationChartLineIcon class="h-8 w-8 text-secondary-500" />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Charts</h3>
                <p class="text-sm text-gray-600">{{ chartStore.charts.length }} charts created</p>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-gray-500">
                Create beautiful charts from your data sources with various chart types and customization options.
              </p>
              <div class="mt-3">
                <router-link
                  to="/charts"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-secondary-700 bg-secondary-100 hover:bg-secondary-200 transition-colors duration-200"
                >
                  Create Charts
                  <ArrowRightIcon class="ml-2 h-4 w-4" />
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Squares2X2Icon class="h-8 w-8 text-emerald-500" />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Dashboards</h3>
                <p class="text-sm text-gray-600">{{ dashboardStore.dashboards.length }} dashboards built</p>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-gray-500">
                Build interactive dashboards by arranging your charts in customizable layouts.
              </p>
              <div class="mt-3">
                <router-link
                  to="/dashboards"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-colors duration-200"
                >
                  Build Dashboards
                  <ArrowRightIcon class="ml-2 h-4 w-4" />
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Getting Started</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600 text-sm font-medium">
                  1
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-base font-medium text-gray-900">Upload Data</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Start by uploading a CSV file containing your data. Our system will automatically detect column types and validate the data.
                </p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-8 w-8 rounded-full bg-secondary-100 text-secondary-600 text-sm font-medium">
                  2
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-base font-medium text-gray-900">Create Charts</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Select a data source and create charts by mapping columns to chart axes. Choose from bar, line, pie, and scatter charts.
                </p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 text-sm font-medium">
                  3
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-base font-medium text-gray-900">Build Dashboard</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Arrange your charts in a dashboard using drag-and-drop functionality. Resize and position charts to create the perfect layout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChartBarIcon,
  TableCellsIcon,
  PresentationChartLineIcon,
  Squares2X2Icon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'
import { useDataSourceStore, useChartStore, useDashboardStore } from '@/stores'

const dataSourceStore = useDataSourceStore()
const chartStore = useChartStore()
const dashboardStore = useDashboardStore()
</script>
