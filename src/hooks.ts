import {
    colorPalette,
    mergeOptions,
    Hooks as BaseHooks
} from '@chartisan/chartisan'
import {
    ChartType,
    ChartDataSets,
    ChartTitleOptions,
    ChartConfiguration,
    ChartLegendOptions,
    ChartLayoutPaddingObject
} from 'chart.js'

/**
 * Used as an alias.
 *
 * @type {CC}
 */
type CC = ChartConfiguration

/**
 * Used as the interface for the types hook.
 *
 * @export
 * @interface TypesHook
 * @extends {ChartDataSets}
 */
export interface DatasetHook extends ChartDataSets {
    type: ChartType | string
}

export class Hooks extends BaseHooks<ChartConfiguration> {
    /**
     * Used to set the color color of a dataset.
     *
     * @param {*} [colors=colorPalette]
     * @returns {this}
     * @memberof Hooks
     */
    colors(colors = colorPalette): this {
        this.hooks.push(function(chart: CC): CC {
            if (chart.data?.datasets)
                chart.data.datasets = chart.data.datasets.map(
                    (dataset, index) => ({
                        ...dataset,
                        borderColor: colors[index % colors.length],
                        backgroundColor: colors[index % colors.length]
                    })
                )
            return chart
        })
        return this
    }

    /**
     * Used to make the chart responsive.
     *
     * @param {boolean} [maintainAspectRatio=true]
     * @returns {this}
     * @memberof Hooks
     */
    responsive(maintainAspectRatio = true): this {
        this.hooks.push(function(chart: CC): CC {
            return mergeOptions(chart, {
                options: { maintainAspectRatio }
            })
        })
        return this
    }

    /**
     * Set the chart legend options. If a boolean is
     * supplied, it will be used as the display value.
     *
     * @param {(boolean | ChartLegendOptions)} [legend={}]
     * @returns {this}
     * @memberof Hooks
     */
    legend(legend: boolean | ChartLegendOptions = {}): this {
        if (typeof legend === 'boolean') legend = { display: legend }
        this.hooks.push(function(chart: CC): CC {
            return mergeOptions(chart, {
                options: { legend }
            })
        })
        return this
    }

    /**
     * Determines if the chart will show the axes.
     *
     * @param {boolean} [display=true]
     * @param {boolean} [strict=false]
     * @returns {Hook}
     * @memberof Hooks
     */
    displayAxes(display = true, strict = false): this {
        this.hooks.push(function(chart: CC): CC {
            if (strict)
                return mergeOptions(chart, {
                    options: { scale: { display } }
                })
            return mergeOptions(chart, {
                options: {
                    scales: {
                        xAxes: [{ display }],
                        yAxes: [{ display }]
                    }
                }
            })
        })
        return this
    }

    /**
     * Creates a minimalist chart.
     *
     * @param {boolean} [value=true]
     * @returns {Hook}
     * @memberof Hooks
     */
    minimalist(value = true): this {
        this.legend({ display: !value })
        this.displayAxes(!value)
        return this
    }

    /**
     * Determines the padding of the chart.
     *
     * @param {(number | ChartLayoutPaddingObject)} [padding=5]
     * @returns
     * @memberof Hooks
     */
    padding(padding: number | ChartLayoutPaddingObject = 5): this {
        this.hooks.push(function(chart: CC): CC {
            return mergeOptions(chart, {
                options: { layout: { padding } }
            })
        })
        return this
    }

    /**
     * Set the dataset options. If a single string is provided, all the datasets
     * will will be specified to the desired type. If an array is provided, if the
     * inner element is a string, it will be used as a type, otherwise, the options
     * will be applied, in both cases, to the nth position. Keep in mind that if the
     * array length is less than the datasets, it will start from the start again.
     *
     * @param {(ChartType | (ChartType | DatasetHook)[])} types
     * @param {string} [general='bar']
     * @returns {this}
     * @memberof Hooks
     */
    datasets(
        types: ChartType | (ChartType | DatasetHook)[],
        general = 'bar'
    ): this {
        const t = Array.isArray(types)
            ? types.map(e => (typeof e === 'string' ? { type: e } : e))
            : [{ type: types }]
        this.hooks.push(function(chart: CC): CC {
            chart.type = general
            chart.data?.datasets
            if (chart.data?.datasets)
                chart.data.datasets = chart.data.datasets.map(
                    (dataset, index) => ({
                        ...dataset,
                        ...t[index % t.length]
                    })
                )
            return chart
        })
        return this
    }

    /**
     * Sets a title to the chart.
     *
     * @param {(string | ChartTitleOptions)} [title={}]
     * @returns {this}
     * @memberof Hooks
     */
    title(title: string | ChartTitleOptions = {}): this {
        title =
            typeof title === 'string'
                ? { text: title, display: true }
                : { display: true, ...title }
        this.hooks.push(function(chart: CC): CC {
            return mergeOptions(chart, {
                options: { title }
            })
        })
        return this
    }

    /**
     * Set the chart to begin at zero.
     *
     * @param {boolean} [beginAtZero=true]
     * @returns {this}
     * @memberof Hooks
     */
    beginAtZero(beginAtZero = true): this {
        this.hooks.push(function(chart: CC): CC {
            return mergeOptions(chart, {
                options: { scales: { yAxes: [{ ticks: { beginAtZero } }] } }
            })
        })
        return this
    }
}
