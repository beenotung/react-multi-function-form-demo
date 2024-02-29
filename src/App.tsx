import React, { useEffect, useRef, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { sleep } from './helpers'

type Task = {
  name: string
  selected?: boolean
  renderForm(): any
  submit(): Promise<any>
  loading?: boolean
}

function App() {
  const [counter, setCounter] = useState(0)
  function rerender() {
    setCounter(counter => counter + 1)
  }

  function useInit() {
    const columns: string[] = []

    const dataCleaningInputs = {
      creditColumn: '',
      debitColumn: '',
    }
    const dataCleaningTask: Task = {
      name: 'Data Cleaning',
      renderForm() {
        return (
          <>
            <div className="function--form--field">
              <label>
                Credit Column:{' '}
                <select
                  value={dataCleaningInputs.creditColumn}
                  onChange={e => {
                    dataCleaningInputs.creditColumn = e.target.value
                    rerender()
                  }}
                >
                  <option value="">Please select a column</option>
                  {columns.map(column => (
                    <option>{column}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="function--form--field">
              <label>
                Debit Column:{' '}
                <select
                  value={dataCleaningInputs.debitColumn}
                  onChange={e => {
                    dataCleaningInputs.debitColumn = e.target.value
                    rerender()
                  }}
                >
                  <option value="">Please select a column</option>
                  {columns.map(column => (
                    <option>{column}</option>
                  ))}
                </select>
              </label>
            </div>
          </>
        )
      },
      async submit() {
        console.log('submit clean:', dataCleaningInputs)
        await sleep(2000)
        console.log('done clean')
      },
    }

    const seldomUsedAndSuspenseInputs = {
      codes: '',
      desc: '',
    }
    const seldomUsedAndSuspenseTask: Task = {
      name: 'Seldom used and Suspense',
      renderForm() {
        return (
          <>
            <div className="function--form--field">
              <label>
                Codes:{' '}
                <input
                  value={seldomUsedAndSuspenseInputs.codes}
                  onChange={e => {
                    seldomUsedAndSuspenseInputs.codes = e.target.value
                    rerender()
                  }}
                />
              </label>
            </div>
          </>
        )
      },
      async submit() {
        console.log('submit seldom:', seldomUsedAndSuspenseInputs)
        await sleep(2000)
        console.log('done seldom')
      },
    }

    return useRef({
      columns,
      taskList: [dataCleaningTask, seldomUsedAndSuspenseTask] as Task[],
      extra: { dataCleaningInputs, seldomUsedAndSuspenseInputs },
    })
  }

  const ref = useInit()

  useEffect(() => {
    setTimeout(() => {
      let json = { columns: ['field 1', 'field 2', 'field 3'] }
      columns.length = 0
      columns.push(...json.columns)
      rerender()
    }, 2000)
  }, [])

  const { columns, taskList } = ref.current
  const selectedTaskList = taskList.filter(task => task.selected)

  return (
    <div>
      <div className="function--list">
        {taskList.map(task => {
          return (
            <div className="function--item">
              <div className="function--icon">icon</div>
              <div>
                status:
                {task.selected ? ' (selected) ' : ''}
                {task.loading ? ' (loading) ' : ''}
              </div>
              <button
                className="function--button"
                onClick={() => {
                  task.selected = !task.selected
                  rerender()
                }}
              >
                {task.name}
              </button>
            </div>
          )
        })}
      </div>
      <div className="form--list">
        {selectedTaskList.length == 0 ? (
          <p>Please select a task</p>
        ) : (
          <>
            {selectedTaskList.map(task => {
              return (
                <div className="function--form">
                  <fieldset>
                    <legend>{task.name}</legend>
                    {task.renderForm()}
                  </fieldset>
                </div>
              )
            })}
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={async () => {
                  for (let task of taskList) {
                    if (task.selected) {
                      task.loading = true
                      rerender()
                      await task.submit()
                      task.loading = false
                      rerender()
                    }
                  }
                }}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
      <pre>
        <code>{JSON.stringify(ref.current, null, 2)}</code>
      </pre>
    </div>
  )
}

export default App
