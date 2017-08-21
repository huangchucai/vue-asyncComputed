const prefix = '_async_computed$'

const AsyncComputed = {
  install (Vue, pluginOptions) {
    pluginOptions = pluginOptions || {}
    // 把Vue.computed复制到 Vue.asyncComputed
    Vue.config.optionMergeStrategies.asyncComputed = Vue.config.optionMergeStrategies.computed
    // 全局混合
    Vue.mixin({
      beforeCreate () {
        // 获取每一个vue组件数据
        const optionData = this.$options.data

        // 如果没有计算属性，就赋值为一个空对象
        if (!this.$options.computed) {
          this.$options.computed = {}
        }  
        // 循环asyncComputed 对象 
        for (const key in this.$options.asyncComputed || {}) {
          // this.$options.asyncComputed[key] 得到对应的函数
          this.$options.computed[prefix + key] = getterFor(this.$options.asyncComputed[key])
        }

        this.$options.data = function vueAsyncComputedInjectedDataFn () {
          const data = (
            // 如果是一个函数的话直接执行，不是的直接返回数据
            (typeof optionData === 'function')
              ? optionData.call(this)
              : optionData
          ) || {}
          for (const key in this.$options.asyncComputed || {}) {
            // 给data初始化值，把asyncComputed的名字赋值给this.$options.data
            data[key] = null
          }
          return data
        }
      },
      created () {
        // 处理默认值
        for (const key in this.$options.asyncComputed || {}) {
          // 把对应的函数，额外的选择都传递给函数defaultFor
          this[key] = defaultFor.call(this, this.$options.asyncComputed[key], pluginOptions)
        }

        for (const key in this.$options.asyncComputed || {}) {
          // 给每一个asyncComputed匹配一个id
          let promiseId = 0
          // console.log(this.$watch)
          this.$watch(prefix + key, newPromise => {
            const thisPromise = ++promiseId
            // 如果newPromise或者newPromise.then也不存在，就返回一个promise  
            if (!newPromise || !newPromise.then) {
              newPromise = Promise.resolve(newPromise)
            }
            // 如果已经存在一个promise 
            console.log(this)
            newPromise.then(value => {
              if (thisPromise !== promiseId) return
              this[key] = value
            }).catch(err => {
              // 错误处理
              if (thisPromise !== promiseId) return

              if (pluginOptions.errorHandler === false) return

              const handler = (pluginOptions.errorHandler === undefined)
                ? console.error.bind(console, 'Error evaluating async computed property:')
                : pluginOptions.errorHandler

              if (pluginOptions.useRawError) {
                handler(err)
              } else {
                handler(err.stack)
              }
            })
          }, { immediate: true })
        }
      }
    })
  }
}

// 得到所有的asyncComputed中的函数
function getterFor (fn) {
  // 如果是函数的话，直接返回
  if (typeof fn === 'function') return fn
  // 如果不是函数的话，得到对象的get的值  => 其实也是一个函数
  let getter = fn.get
  
  // 判定fn这个对象是否又watch属性
  if (fn.hasOwnProperty('watch')) {
    getter = function getter () {
      fn.watch.call(this)
      return fn.get.call(this)
    }
  }
  // 最后总是返回一个函数
  return getter
}

function defaultFor (fn, pluginOptions) {
  // 已经被制定了this是Vue实例
  let defaultValue = null
  // 看是否有默认值
  if ('default' in fn) {
    defaultValue = fn.default
  } else if ('default' in pluginOptions) {
    defaultValue = pluginOptions.default
  }
  // 如果默认值是一个函数的话，执行函数并返回
  if (typeof defaultValue === 'function') {
    return defaultValue.call(this)
  } else {
    return defaultValue
  }
}

export default AsyncComputed

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  // Auto install in dist mode
  window.Vue.use(AsyncComputed)
}
