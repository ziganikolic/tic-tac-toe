<?php

namespace App\Services\Game;

class MoveValidator
{
    public function validate(array $state, array $move): bool
    {
        $mega = $state['rules']['megaSize'];
        $mini = $state['rules']['miniSize'];

        $mr = $move['mini']['row'];
        $mc = $move['mini']['col'];
        $cr = $move['cell']['row'];
        $cc = $move['cell']['col'];

        if ($mr < 0 || $mr >= $mega || $mc < 0 || $mc >= $mega) {
            return false;
        }
        if ($cr < 0 || $cr >= $mini || $cc < 0 || $cc >= $mini) {
            return false;
        }

        $miniBoard = $state['mega']['boards'][$mr][$mc] ?? null;
        if (! $miniBoard || $miniBoard['isClosed']) {
            return false;
        }

        foreach ($miniBoard['cells'] as $cell) {
            if ($cell['row'] === $cr && $cell['col'] === $cc && $cell['value'] !== null) {
                return false;
            }
        }

        $active = $state['mega']['activeMini'];
        if ($active && ($active['row'] !== $mr || $active['col'] !== $mc)) {
            return false;
        }

        return true;
    }
}

