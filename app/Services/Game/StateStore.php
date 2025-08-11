<?php

namespace App\Services\Game;

use Illuminate\Contracts\Cache\Repository as Cache;

class StateStore
{
    public function __construct(private Cache $cache)
    {
    }

    protected function key(int $roomId): string
    {
        return "game:{$roomId}";
    }

    public function get(int $roomId): array
    {
        return $this->cache->get($this->key($roomId), function () {
            return $this->fresh();
        });
    }

    public function put(int $roomId, array $state): void
    {
        $this->cache->forever($this->key($roomId), $state);
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
        $state = $this->get($roomId);
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

        $state['current'] = $state['current'] === 'X' ? 'O' : 'X';
        $state['moveIndex'] = $move['moveIndex'];
        $state['lastMoveAt'] = now()->toIso8601String();
        $state['mega']['activeMini'] = ['row' => $cr, 'col' => $cc];
        $state['moves'][] = $move;

        $this->put($roomId, $state);

        return $state;
    }
}

