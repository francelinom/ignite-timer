import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useState, useEffect } from 'react'
import { differenceInSeconds } from 'date-fns'

import {
    CountdownContainer,
    FormContainer,
    HomeContainer,
    MinutesAmountInput,
    Separator,
    StartCountdownButton,
    StopCountdownButton,
    TaskInput
} from "./styles"


const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod
        .number()
        .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
        .max(60, 'O ciclo precisa ser de no máximo 60 minutos')
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cyrcle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
}

export function Home() {
    const [cyrcle, setCyrcle] = useState<Cyrcle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    /**
     * formState -> tem a funcionalidade de pegar o erro que é passado pelo resolver  "errors"
     * Utilização:
     * const { formState } = useForm();
     */
    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    const activeCyrcle = cyrcle.find((cyrcle) => cyrcle.id === activeCycleId)

    useEffect(() => {
        let interval: number
        if (activeCyrcle) {
            interval = setInterval(() => {
                setAmountSecondsPassed(
                    differenceInSeconds(new Date(), activeCyrcle.startDate)
                )
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [activeCyrcle])

    function handleCreateNewCycle(data: NewCycleFormData) {
        const id = String(new Date().getTime());
        const newCyrcle: Cyrcle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        setCyrcle(((state) => [...state, newCyrcle]))
        setActiveCycleId(id)
        setAmountSecondsPassed(0)

        reset()
    }

    function handleInterruptCyrcle() {

        setCyrcle((state) =>
            state.map((cyrcle) => {
                if (cyrcle.id === activeCycleId) {
                    return { ...cyrcle, interruptedDate: new Date() }
                } else {
                    return cyrcle
                }
            })
        )
        setActiveCycleId(null)
    }

    const totalSeconds = activeCyrcle ? activeCyrcle.minutesAmount * 60 : 0
    const currentSeconds = activeCyrcle ? totalSeconds - amountSecondsPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    const task = watch('task')
    const isSubmitDisabled = !task

    useEffect(() => {
        if (activeCyrcle) {
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCyrcle])

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput
                        id="task"
                        list="task-suggestions"
                        placeholder="Dê um nome para o seu projeto"
                        disabled={!!activeCyrcle}
                        {...register('task')} />

                    <datalist id="task-suggestions">
                        <option value="Projeto 1" />
                        <option value="Projeto 2" />
                        <option value="Projeto 3" />
                        <option value="Bananinha" />
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput
                        type="number"
                        id="minutesAmount"
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        disabled={!!activeCyrcle}
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

                {activeCyrcle ? (
                    <StopCountdownButton type="button" onClick={handleInterruptCyrcle}>
                        <HandPalm size={24} />
                        Parar
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}

            </form>
        </HomeContainer>
    )
}