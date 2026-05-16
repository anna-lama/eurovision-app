<template>
    <div class="ranking" v-if="props.classifica.length > 0">
        <article
            v-for="(canzone, index) in props.classifica"
            :key="index"
            class="ranking-row"
            :class="[
                getPodiumClass(canzone),
                {
                    'ranking-row--empty': !hasScore(canzone),
                    'ranking-row--tie': isTie(canzone)
                }
            ]"
        >
            <div class="ranking-row__position">
                <span>{{ getDisplayRank(canzone) }}</span>
            </div>

            <div class="ranking-row__main">
                <div class="ranking-row__header">
                    <div class="ranking-row__song">
                        <span class="ranking-row__label">{{ getPodiumLabel(canzone) }}</span>
                        <span class="ranking-row__country-line">
                            <span class="ranking-row__country">{{ canzone.esibizione.nazione }}</span>
                            <span v-if="showCrown(canzone)" class="material-symbols-outlined ranking-row__crown">
                                crown
                            </span>
                        </span>
                        <span v-if="isTie(canzone)" class="ranking-row__tie-badge">Pari merito</span>
                    </div>

                    <div v-if="hasScore(canzone)" class="ranking-row__score">
                        <strong>{{ canzone.totale }}</strong>
                        <span>punti</span>
                    </div>
                    <div v-else class="ranking-row__pending">
                        In attesa
                    </div>
                </div>

                <category-points
                    v-if="hasScore(canzone)"
                    class="ranking-row__breakdown"
                    :punteggi="canzone"
                ></category-points>
            </div>
        </article>
    </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import CategoryPoints from "@/components/category-points.vue";

const props = withDefaults(defineProps<{
    classifica: any[],
    variant?: 'personal' | 'total'
}>(), {
    variant: 'total'
})

const hasScore = (canzone: any) => canzone.totale !== 0

const rankedClassifica = computed(() => {
    let previousTotal: number | null = null
    let previousRank = 0

    return props.classifica.map((canzone, index) => {
        if (!hasScore(canzone)) {
            return {
                canzone,
                rank: '--',
                isTie: false
            }
        }

        const rank = canzone.totale === previousTotal ? previousRank : index + 1
        previousTotal = canzone.totale
        previousRank = rank

        return {
            canzone,
            rank,
            isTie: props.classifica.some((item) => item !== canzone && hasScore(item) && item.totale === canzone.totale)
        }
    })
})

const getRankInfo = (canzone: any) => rankedClassifica.value.find((item) => item.canzone === canzone)

const getDisplayRank = (canzone: any) => getRankInfo(canzone)?.rank ?? '--'

const isTie = (canzone: any) => getRankInfo(canzone)?.isTie ?? false

const getPodiumClass = (canzone: any) => {
    const rank = getDisplayRank(canzone)

    if (rank === 1) {
        return 'ranking-row--gold'
    }
    if (rank === 2) {
        return 'ranking-row--silver'
    }
    if (rank === 3) {
        return 'ranking-row--bronze'
    }
    return ''
}

const personalLabels = {
    empty: 'In attesa',
    first: 'La tua preferita',
    second: 'Seconda scelta',
    third: 'Sul podio',
    default: ''
}

const totalLabels = {
    empty: 'Da calcolare',
    first: 'Leader generale',
    second: 'Secondo posto',
    third: 'Terzo posto',
    default: 'Classifica generale'
}

const getPodiumLabel = (canzone: any) => {
    const labels = props.variant === 'personal' ? personalLabels : totalLabels

    if (!hasScore(canzone)) {
        return labels.empty
    }

    const rank = getDisplayRank(canzone)

    if (rank === 1) {
        return labels.first
    }
    if (rank === 2) {
        return labels.second
    }
    if (rank === 3) {
        return labels.third
    }
    return labels.default
}

const showCrown = (canzone: any) => props.variant === 'personal' && getDisplayRank(canzone) === 1
</script>

<style scoped lang="scss">
.ranking {
    min-height: 0;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0 0 12px;
}

.ranking-row {
    display: grid;
    grid-template-columns: 102px minmax(0, 1fr);
    overflow: hidden;
    min-height: 124px;
    border-top: 1px solid #354659;
    background: #223344;
    box-shadow: none;
}

.ranking-row--empty {
    background: #2c3f52;
}

.ranking-row--tie {
    box-shadow: inset 0 -2px 0 #0da8af;
}

.ranking-row__position {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    isolation: isolate;

    &::before {
        content: '';
        position: absolute;
        inset: 0 12px 0 -18px;
        z-index: -1;
        transform: skew(-12deg);
        transform-origin: center;
        background: #223344;
    }

    > span {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-family: 'Oswald', sans-serif;
        font-size: 60px;
        font-weight: 800;
        line-height: 1;
    }
}

.ranking-row--gold .ranking-row__position::before {
    background: #efc800;
}

.ranking-row--silver .ranking-row__position::before {
    background: #C0C0C0;
}

.ranking-row--bronze .ranking-row__position::before {
    background: #CD7F32;
}

.ranking-row--empty .ranking-row__position::before {
    background: #354659;
}

.ranking-row__main {
    display: grid;
    grid-template-rows: auto auto;
    align-content: center;
    min-width: 0;
    padding-left: 8px;
}

.ranking-row__header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 68px;
    align-items: center;
    gap: 12px;
    min-height: 72px;
    padding: 12px 15px 6px;
}

.ranking-row__song {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
}

.ranking-row__label {
    color: #0da8af;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0;
    text-transform: uppercase;
}

.ranking-row__tie-badge {
    width: fit-content;
    padding: 3px 8px;
    border-radius: 3px;
    background: #0da8af;
    color: #ffffff;
    font-size: 11px;
    font-weight: 800;
    line-height: 1;
    text-transform: uppercase;
}

.ranking-row--gold .ranking-row__label {
    color: #efc800;
}

.ranking-row__country-line {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.ranking-row__country {
    color: #F6F1F4;
    font-size: 27px;
    font-weight: 800;
    line-height: 1.12;
    overflow-wrap: anywhere;
}

.ranking-row__crown {
    color: #ffd84d;
    flex: 0 0 auto;
    font-size: 26px;
    font-variation-settings: 'FILL' 1;
}

.ranking-row__score {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 66px;
    width: 68px;
    min-height: 50px;
    padding: 7px 10px;
    border-radius: 3px;
    background: #F6F1F4;
    color: #223344;

    > strong {
        font-size: 26px;
        font-weight: 900;
        line-height: 1;
    }

    > span {
        margin-top: 3px;
        color: #354659;
        font-size: 11px;
        font-weight: 800;
        line-height: 1;
        text-transform: uppercase;
    }
}

.ranking-row--gold .ranking-row__score {
    background: #efc800;
}

.ranking-row__pending {
    justify-self: end;
    padding: 6px 8px;
    border-radius: 3px;
    background: #354659;
    color: #F6F1F4;
    font-size: 12px;
    font-weight: 800;
    white-space: nowrap;
}

.ranking-row__breakdown {
    padding: 2px 15px 14px 0;
    color: #ffffff;
}

.ranking-row__breakdown :deep(.material-symbols-outlined) {
    color: #0da8af;
    font-size: 21px;
}

@media (max-width: 560px) {
    .ranking {
        gap: 0;
        padding-inline: 0;
    }

    .ranking-row {
        grid-template-columns: 88px minmax(0, 1fr);
        min-height: 118px;
    }

    .ranking-row__main {
        padding-left: 6px;
    }

    .ranking-row__position > span {
        font-size: 48px;
    }

    .ranking-row__header {
        grid-template-columns: minmax(0, 1fr) 58px;
        gap: 8px;
        min-height: 68px;
        padding: 10px 10px 4px;
    }

    .ranking-row__country {
        font-size: 22px;
    }

    .ranking-row__crown {
        font-size: 22px;
    }

    .ranking-row__score {
        min-width: 54px;
        width: 58px;
        min-height: 46px;
        padding: 6px 8px;

        > strong {
            font-size: 22px;
        }

        > span {
            font-size: 10px;
        }
    }

    .ranking-row__pending {
        max-width: 72px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .ranking-row__breakdown {
        padding: 2px 10px 12px 0;
        overflow-x: auto;
    }
}

@media (min-width: 820px) {
    .ranking {
        width: min(760px, 100%);
        margin: 0 auto;
        padding-top: 12px;
    }
}
</style>
