<script setup lang="ts">
import GameCanvas from '@/components/GameCanvas.vue';
import Heading from '@/components/Heading.vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import PlaceholderPattern from '../components/PlaceholderPattern.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];
</script>

<template>
    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Tabs default-value="overview" class="flex h-full flex-1 flex-col">
                <TabsList class="mb-4 grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="game">Play</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" class="flex flex-1 flex-col gap-4">
                    <div class="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div class="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern />
                        </div>
                        <div class="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern />
                        </div>
                        <div class="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern />
                        </div>
                    </div>
                    <div class="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <PlaceholderPattern />
                    </div>
                </TabsContent>
                <TabsContent value="game" class="flex-1">
                    <div class="flex h-full flex-col gap-4 md:flex-row">
                        <div class="space-y-4 md:w-1/2">
                            <Heading title="Ultimate Tic-Tac-Toe" description="Play the classic game with a twist." />
                            <p class="text-sm text-muted-foreground">Click a cell to make your move.</p>
                        </div>
                        <div class="relative aspect-square flex-1 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <GameCanvas />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    </AppLayout>
</template>
