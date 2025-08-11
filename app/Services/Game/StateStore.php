<?php

namespace App\Services\Game;

use Illuminate\Contracts\Cache\Repository as Cache;
use App\Events\StateSynced;

class StateStore
{
    public function __construct(private Cache $cache)
    {
    }

    protected function key(int $roomId): string
    {
        return "game:{$roomId}";
    }

    public function getState(int $roomId): array
    {
        return $this->cache->get($this->key($roomId), function () {
            return $this->fresh();
        });
    }

    public function saveState(int $roomId, array $state): void
    {
        $this->cache->put($this->key($roomId), $state, now()->addDay());
    }

    public function broadcastState(int $roomId, array $state): void
    {
        broadcast(new StateSynced($roomId, $state))->toOthers();
    }

    protected function fresh(): array
    {
        $size = 3;
        $miniSize = 3;
        $boards = [];
        for ($r = 0; $r < $size; $r++) {
            $boards[$r] = [];
            for ($c = 0; $c < $size; $c++) {
                $cells = [];
                for ($i = 0; $i < $miniSize; $i++) {
                    for ($j = 0; $j < $miniSize; $j++) {
                        $cells[] = ['row' => $i, 'col' => $j, 'value' => null];
                    }
                }
                $boards[$r][$c] = [
                    'size' => $miniSize,
                    'cells' => $cells,
                    'winner' => null,
                    'isClosed' => false,
                ];
            }
        }

        return [
            'rules' => [
                'megaSize' => $size,
                'miniSize' => $miniSize,
                'kMini' => 3,
                'kMega' => 3,
            ],
            'mega' => [
                'size' => $size,
                'boards' => $boards,
                'winner' => null,
                'activeMini' => null,
            ],
            'current' => 'X',
            'moveIndex' => 0,
            'startedAt' => now()->toIso8601String(),
            'lastMoveAt' => null,
            'over' => false,
            'moves' => [],
        ];
    }

    public function applyMove(int $roomId, array $move): array
    {
        $state = $this->getState($roomId);
        $mr = $move['mini']['row'];
        $mc = $move['mini']['col'];
        $cr = $move['cell']['row'];
        $cc = $move['cell']['col'];

        $mini =& $state['mega']['boards'][$mr][$mc];
        foreach ($mini['cells'] as &$cell) {
            if ($cell['row'] === $cr && $cell['col'] === $cc) {
                $cell['value'] = $state['current'];
                break;
            }
        }

        $mini['winner'] = $this->winnerFromCells($mini['cells'], $mini['size']);
        if ($mini['winner'] || $this->boardFull($mini['cells'])) {
            $mini['isClosed'] = true;
        }

        $megaMatrix = [];
        for ($r = 0; $r < $state['mega']['size']; $r++) {
            $row = [];
            for ($c = 0; $c < $state['mega']['size']; $c++) {
                $row[] = $state['mega']['boards'][$r][$c]['winner'];
            }
            $megaMatrix[] = $row;
        }
        $state['mega']['winner'] = $this->winnerFromMatrix($megaMatrix);
        if ($state['mega']['winner']) {
            $state['over'] = true;
        }

        $state['mega']['activeMini'] = $mini['isClosed']
            ? null
            : ['row' => $cr, 'col' => $cc];

        if (! $state['over']) {
            $state['current'] = $state['current'] === 'X' ? 'O' : 'X';
        }

        $state['moveIndex'] = $move['moveIndex'];
        $state['lastMoveAt'] = now()->toIso8601String();
        $state['moves'][] = $move;

        $this->saveState($roomId, $state);

        return $state;
    }

    protected function winnerFromCells(array $cells, int $size): ?string
    {
        $matrix = array_fill(0, $size, array_fill(0, $size, null));
        foreach ($cells as $cell) {
            $matrix[$cell['row']][$cell['col']] = $cell['value'];
        }

        return $this->winnerFromMatrix($matrix);
    }

    protected function winnerFromMatrix(array $matrix): ?string
    {
        $size = count($matrix);

        for ($r = 0; $r < $size; $r++) {
            $value = $matrix[$r][0];
            if ($value === null) {
                continue;
            }
            $win = true;
            for ($c = 1; $c < $size; $c++) {
                if ($matrix[$r][$c] !== $value) {
                    $win = false;
                    break;
                }
            }
            if ($win) {
                return $value;
            }
        }

        for ($c = 0; $c < $size; $c++) {
            $value = $matrix[0][$c];
            if ($value === null) {
                continue;
            }
            $win = true;
            for ($r = 1; $r < $size; $r++) {
                if ($matrix[$r][$c] !== $value) {
                    $win = false;
                    break;
                }
            }
            if ($win) {
                return $value;
            }
        }

        $value = $matrix[0][0];
        if ($value !== null) {
            $win = true;
            for ($i = 1; $i < $size; $i++) {
                if ($matrix[$i][$i] !== $value) {
                    $win = false;
                    break;
                }
            }
            if ($win) {
                return $value;
            }
        }

        $value = $matrix[0][$size - 1];
        if ($value !== null) {
            $win = true;
            for ($i = 1; $i < $size; $i++) {
                if ($matrix[$i][$size - 1 - $i] !== $value) {
                    $win = false;
                    break;
                }
            }
            if ($win) {
                return $value;
            }
        }

        return null;
    }

    protected function boardFull(array $cells): bool
    {
        foreach ($cells as $cell) {
            if ($cell['value'] === null) {
                return false;
            }
        }

        return true;
    }
}

