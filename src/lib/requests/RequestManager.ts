/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { AxiosInstance } from 'axios';
import {
    ApolloError,
    ApolloQueryResult,
    DocumentNode,
    FetchResult,
    MutationHookOptions as ApolloMutationHookOptions,
    MutationOptions as ApolloMutationOptions,
    MutationTuple,
    QueryHookOptions as ApolloQueryHookOptions,
    QueryOptions as ApolloQueryOptions,
    QueryResult,
    SubscriptionHookOptions as ApolloSubscriptionHookOptions,
    SubscriptionResult,
    TypedDocumentNode,
    useMutation,
    useQuery,
    useSubscription,
} from '@apollo/client';
import { OperationVariables } from '@apollo/client/core';
import { useEffect, useRef, useState } from 'react';
import { IRestClient, RestClient } from '@/lib/requests/client/RestClient.ts';
import storage from '@/util/localStorage.tsx';
import { GraphQLClient } from '@/lib/requests/client/GraphQLClient.ts';
import {
    CategoryOrderBy,
    ChapterOrderBy,
    CheckForServerUpdatesQuery,
    CheckForServerUpdatesQueryVariables,
    ClearDownloaderMutation,
    ClearDownloaderMutationVariables,
    CreateCategoryInput,
    CreateCategoryMutation,
    CreateCategoryMutationVariables,
    DeleteCategoryMutation,
    DeleteCategoryMutationVariables,
    DeleteDownloadedChapterMutation,
    DeleteDownloadedChapterMutationVariables,
    DeleteDownloadedChaptersMutation,
    DeleteDownloadedChaptersMutationVariables,
    DequeueChapterDownloadMutation,
    DequeueChapterDownloadMutationVariables,
    DequeueChapterDownloadsMutation,
    DequeueChapterDownloadsMutationVariables,
    DownloadStatusSubscription,
    DownloadStatusSubscriptionVariables,
    EnqueueChapterDownloadMutation,
    EnqueueChapterDownloadMutationVariables,
    EnqueueChapterDownloadsMutation,
    EnqueueChapterDownloadsMutationVariables,
    FetchSourceMangaInput,
    FetchSourceMangaType,
    FilterChangeInput,
    GetAboutQuery,
    GetAboutQueryVariables,
    GetExtensionsFetchMutation,
    GetExtensionsFetchMutationVariables,
    GetCategoriesQuery,
    GetCategoriesQueryVariables,
    GetCategoryMangasQuery,
    GetCategoryMangasQueryVariables,
    GetChapterPagesFetchMutation,
    GetChapterPagesFetchMutationVariables,
    GetChaptersQuery,
    GetChaptersQueryVariables,
    GetExtensionsQuery,
    GetExtensionsQueryVariables,
    GetGlobalMetadatasQuery,
    GetGlobalMetadatasQueryVariables,
    GetMangaChaptersFetchMutation,
    GetMangaChaptersFetchMutationVariables,
    GetMangaFetchMutation,
    GetMangaFetchMutationVariables,
    GetMangaQuery,
    GetMangaQueryVariables,
    GetSourceMangasFetchMutation,
    GetSourceMangasFetchMutationVariables,
    GetSourceQuery,
    GetSourceQueryVariables,
    GetSourcesQuery,
    GetSourcesQueryVariables,
    GetUpdateStatusQuery,
    GetUpdateStatusQueryVariables,
    InstallExternalExtensionMutation,
    InstallExternalExtensionMutationVariables,
    ReorderChapterDownloadMutation,
    ReorderChapterDownloadMutationVariables,
    RestoreBackupMutation,
    RestoreBackupMutationVariables,
    SetCategoryMetadataMutation,
    SetCategoryMetadataMutationVariables,
    SetChapterMetadataMutation,
    SetChapterMetadataMutationVariables,
    SetGlobalMetadataMutation,
    SetGlobalMetadataMutationVariables,
    SetMangaMetadataMutation,
    SetMangaMetadataMutationVariables,
    SortOrder,
    SourcePreferenceChangeInput,
    StartDownloaderMutation,
    StartDownloaderMutationVariables,
    StopDownloaderMutation,
    StopDownloaderMutationVariables,
    StopUpdaterMutation,
    StopUpdaterMutationVariables,
    UpdateCategoryMangasMutation,
    UpdateCategoryMangasMutationVariables,
    UpdateCategoryMutation,
    UpdateCategoryMutationVariables,
    UpdateCategoryOrderMutation,
    UpdateCategoryOrderMutationVariables,
    UpdateCategoryPatchInput,
    UpdateChapterMutation,
    UpdateChapterMutationVariables,
    UpdateChapterPatchInput,
    UpdateChaptersMutation,
    UpdateChaptersMutationVariables,
    UpdateExtensionMutation,
    UpdateExtensionMutationVariables,
    UpdateExtensionPatchInput,
    UpdateLibraryMangasMutation,
    UpdateLibraryMangasMutationVariables,
    UpdateMangaCategoriesMutation,
    UpdateMangaCategoriesMutationVariables,
    UpdateMangaMutation,
    UpdateMangaMutationVariables,
    UpdateMangaPatchInput,
    UpdaterSubscription,
    UpdaterSubscriptionVariables,
    UpdateSourcePreferencesMutation,
    UpdateSourcePreferencesMutationVariables,
    ValidateBackupQuery,
    ValidateBackupQueryVariables,
} from '@/lib/graphql/generated/graphql.ts';
import { GET_GLOBAL_METADATA, GET_GLOBAL_METADATAS } from '@/lib/graphql/queries/GlobalMetadataQuery.ts';
import { SET_GLOBAL_METADATA } from '@/lib/graphql/mutations/GlobalMetadataMutation.ts';
import { CHECK_FOR_SERVER_UPDATES, GET_ABOUT } from '@/lib/graphql/queries/ServerInfoQuery.ts';
import { GET_EXTENSION, GET_EXTENSIONS } from '@/lib/graphql/queries/ExtensionQuery.ts';
import {
    GET_EXTENSIONS_FETCH,
    INSTALL_EXTERNAL_EXTENSION,
    UPDATE_EXTENSION,
} from '@/lib/graphql/mutations/ExtensionMutation.ts';
import { GET_SOURCE, GET_SOURCES } from '@/lib/graphql/queries/SourceQuery.ts';
import {
    GET_MANGA_FETCH,
    SET_MANGA_METADATA,
    UPDATE_MANGA,
    UPDATE_MANGA_CATEGORIES,
} from '@/lib/graphql/mutations/MangaMutation.ts';
import { GET_MANGA, GET_MANGAS } from '@/lib/graphql/queries/MangaQuery.ts';
import { GET_CATEGORIES, GET_CATEGORY, GET_CATEGORY_MANGAS } from '@/lib/graphql/queries/CategoryQuery.ts';
import { GET_SOURCE_MANGAS_FETCH, UPDATE_SOURCE_PREFERENCES } from '@/lib/graphql/mutations/SourceMutation.ts';
import {
    CLEAR_DOWNLOADER,
    DELETE_DOWNLOADED_CHAPTER,
    DELETE_DOWNLOADED_CHAPTERS,
    DEQUEUE_CHAPTER_DOWNLOAD,
    DEQUEUE_CHAPTER_DOWNLOADS,
    ENQUEUE_CHAPTER_DOWNLOAD,
    ENQUEUE_CHAPTER_DOWNLOADS,
    REORDER_CHAPTER_DOWNLOAD,
    START_DOWNLOADER,
    STOP_DOWNLOADER,
} from '@/lib/graphql/mutations/DownloaderMutation.ts';
import { GET_CHAPTER, GET_CHAPTERS } from '@/lib/graphql/queries/ChapterQuery.ts';
import {
    GET_CHAPTER_PAGES_FETCH,
    GET_MANGA_CHAPTERS_FETCH,
    SET_CHAPTER_METADATA,
    UPDATE_CHAPTER,
    UPDATE_CHAPTERS,
} from '@/lib/graphql/mutations/ChapterMutation.ts';
import {
    CREATE_CATEGORY,
    DELETE_CATEGORY,
    SET_CATEGORY_METADATA,
    UPDATE_CATEGORY,
    UPDATE_CATEGORY_ORDER,
} from '@/lib/graphql/mutations/CategoryMutation.ts';
import { GET_DOWNLOAD_STATUS } from '@/lib/graphql/queries/DownloaderQuery.ts';
import {
    STOP_UPDATER,
    UPDATE_CATEGORY_MANGAS,
    UPDATE_LIBRARY_MANGAS,
} from '@/lib/graphql/mutations/UpdaterMutation.ts';
import { GET_UPDATE_STATUS } from '@/lib/graphql/queries/UpdaterQuery.ts';
import { CustomCache } from '@/lib/requests/CustomCache.ts';
import { RESTORE_BACKUP } from '@/lib/graphql/mutations/BackupMutation.ts';
import { VALIDATE_BACKUP } from '@/lib/graphql/queries/BackupQuery.ts';
import { DOWNLOAD_STATUS_SUBSCRIPTION } from '@/lib/graphql/subscriptions/DownloaderSubscription.ts';
import { UPDATER_SUBSCRIPTION } from '@/lib/graphql/subscriptions/UpdaterSubscription.ts';

enum GQLMethod {
    QUERY = 'QUERY',
    USE_QUERY = 'USE_QUERY',
    USE_MUTATION = 'USE_MUTATION',
    MUTATION = 'MUTATION',
    USE_SUBSCRIPTION = 'USE_SUBSCRIPTION',
}

type CustomApolloOptions = {
    /**
     * This is a workaround for an apollo bug (?).
     *
     * A new abort signal gets passed on every hook call.
     * This causes the passed arguments to change (due to updating the "context" option, which is only relevant for the actual request),
     * which - I assume - results in apollo to handle this as a completely new hook call.
     * Due to this, when e.g. calling "fetchMore", "loading" and "networkStatus" do not get updated when enabling "notifyOnNetworkStatusChange".
     *
     * By not passing an abort signal, the states get correctly updated, BUT it won't be possible to abort the request.
     */
    omitAbortSignal?: boolean;
};
type QueryOptions<Variables extends OperationVariables = OperationVariables, Data = any> = Partial<
    ApolloQueryOptions<Variables, Data>
> &
    CustomApolloOptions;
type QueryHookOptions<Data = any, Variables extends OperationVariables = OperationVariables> = Partial<
    ApolloQueryHookOptions<Data, Variables>
> &
    CustomApolloOptions;
type MutationHookOptions<Data = any, Variables extends OperationVariables = OperationVariables> = Partial<
    ApolloMutationHookOptions<Data, Variables>
> &
    CustomApolloOptions;
type MutationOptions<Data = any, Variables extends OperationVariables = OperationVariables> = Partial<
    ApolloMutationOptions<Data, Variables>
> &
    CustomApolloOptions;
type ApolloPaginatedMutationOptions<Data = any, Variables extends OperationVariables = OperationVariables> = Partial<
    MutationHookOptions<Data, Variables>
> & { skipRequest?: boolean };
type SubscriptionHookOptions<Data = any, Variables extends OperationVariables = OperationVariables> = Partial<
    ApolloSubscriptionHookOptions<Data, Variables>
> &
    Omit<CustomApolloOptions, 'omitAbortSignal'> & { omitAbortSignal?: never };

type AbortableRequest = { abortRequest: AbortController['abort'] };

export type AbortabaleApolloQueryResponse<Data = any> = {
    response: Promise<ApolloQueryResult<Data>>;
} & AbortableRequest;
export type AbortableApolloUseQueryResponse<
    Data = any,
    Variables extends OperationVariables = OperationVariables,
> = QueryResult<Data, Variables> & AbortableRequest;
export type AbortableApolloUseMutationResponse<
    Data = any,
    Variables extends OperationVariables = OperationVariables,
> = [MutationTuple<Data, Variables>[0], MutationTuple<Data, Variables>[1] & AbortableRequest];
export type AbortableApolloUseMutationPaginatedResponse<
    Data = any,
    Variables extends OperationVariables = OperationVariables,
> = [
    (page: number) => Promise<FetchResult<Data>>,
    (Omit<MutationTuple<Data, Variables>[1], 'loading'> &
        AbortableRequest & {
            size: number;
            /**
             * Indicates whether any request is currently active.
             * In case only "isLoading" is true, it means that it's the initial request
             */
            isLoading: boolean;
            /**
             * Indicates if a next page is being fetched, which is not part of the initial pages
             */
            isLoadingMore: boolean;
            /**
             * Indicates if the cached pages are currently getting revalidated
             */
            isValidating: boolean;
        })[],
];
export type AbortableApolloMutationResponse<Data = any> = { response: Promise<FetchResult<Data>> } & AbortableRequest;

export class RequestManager {
    public static readonly API_VERSION = '/api/v1/';

    private readonly graphQLClient = new GraphQLClient();

    private readonly restClient: RestClient = new RestClient();

    private readonly cache = new CustomCache();

    public getClient(): IRestClient {
        return this.restClient;
    }

    public updateClient(config: Partial<AxiosInstance['defaults']>): void {
        this.restClient.updateConfig(config);
        this.graphQLClient.updateConfig();
    }

    public getBaseUrl(): string {
        return this.restClient.getClient().defaults.baseURL!;
    }

    public getValidUrlFor(endpoint: string, apiVersion: string = RequestManager.API_VERSION): string {
        return `${this.getBaseUrl()}${apiVersion}${endpoint}`;
    }

    private createAbortController(): { signal: AbortSignal } & AbortableRequest {
        const abortController = new AbortController();
        const abortRequest = (reason?: any): void => {
            if (!abortController.signal.aborted) {
                abortController.abort(reason);
            }
        };

        return { signal: abortController.signal, abortRequest };
    }

    private createPaginatedResult<Result extends AbortableApolloUseMutationPaginatedResponse[1][number]>(
        result: Partial<Result> | undefined | null,
        defaultPage: number,
        page?: number,
    ): Result {
        const isLoading = !result?.error && (result?.isLoading || !result?.called);
        const size = page ?? result?.size ?? defaultPage;
        return {
            client: this.graphQLClient.client,
            abortRequest: () => {},
            reset: () => {},
            called: false,
            data: undefined,
            error: undefined,
            size,
            isLoading,
            isLoadingMore: isLoading && size > 1,
            isValidating: !!result?.isValidating,
            ...result,
        } as Result;
    }

    private async revalidatePage<Data = any, Variables extends OperationVariables = OperationVariables>(
        cacheResultsKey: string,
        cachePagesKey: string,
        getVariablesFor: (page: number) => Variables,
        options: ApolloPaginatedMutationOptions<Data, Variables> | undefined,
        checkIfCachedPageIsInvalid: (
            cachedResult: AbortableApolloUseMutationPaginatedResponse<Data, Variables>[1][number] | undefined,
            revalidatedResult: FetchResult<Data>,
        ) => boolean,
        hasNextPage: (revalidatedResult: FetchResult<Data>) => boolean,
        pageToRevalidate: number,
        maxPage: number,
        signal: AbortSignal,
    ): Promise<void> {
        const { response: revalidationRequest } = this.doRequestNew(
            GQLMethod.MUTATION,
            GET_SOURCE_MANGAS_FETCH,
            getVariablesFor(pageToRevalidate),
            {
                ...options,
                context: { fetchOptions: { signal } },
            },
        );

        const revalidationResponse = await revalidationRequest;
        const cachedPageData = this.cache.getResponseFor<
            AbortableApolloUseMutationPaginatedResponse<Data, Variables>[1][number]
        >(cacheResultsKey, getVariablesFor(pageToRevalidate));

        const isCachedPageInvalid = checkIfCachedPageIsInvalid(cachedPageData, revalidationResponse);
        if (isCachedPageInvalid) {
            this.cache.cacheResponse(cacheResultsKey, getVariablesFor(pageToRevalidate), revalidationResponse);
        }

        if (!hasNextPage(revalidationResponse)) {
            const currentCachedPages = this.cache.getResponseFor<Set<number>>(cachePagesKey, getVariablesFor(0))!;
            this.cache.cacheResponse(
                cachePagesKey,
                getVariablesFor(0),
                [...currentCachedPages].filter((cachedPage) => cachedPage <= pageToRevalidate),
            );
            [...currentCachedPages]
                .filter((cachedPage) => cachedPage > pageToRevalidate)
                .forEach((cachedPage) =>
                    this.cache.cacheResponse(cacheResultsKey, getVariablesFor(cachedPage), undefined),
                );
            return;
        }

        if (isCachedPageInvalid && pageToRevalidate < maxPage) {
            await this.revalidatePage(
                cacheResultsKey,
                cachePagesKey,
                getVariablesFor,
                options,
                checkIfCachedPageIsInvalid,
                hasNextPage,
                pageToRevalidate + 1,
                maxPage,
                signal,
            );
        }
    }

    private async revalidatePages<Variables extends OperationVariables = OperationVariables>(
        activeRevalidationRef:
            | [ForInput: Variables, Request: Promise<unknown>, AbortRequest: AbortableRequest['abortRequest']]
            | null,
        setRevalidationDone: (isDone: boolean) => void,
        setActiveRevalidation: (
            activeRevalidation:
                | [ForInput: Variables, Request: Promise<unknown>, AbortRequest: AbortableRequest['abortRequest']]
                | null,
        ) => void,
        getVariablesFor: (page: number) => Variables,
        setValidating: (isValidating: boolean) => void,
        revalidatePage: (pageToRevalidate: number, maxPage: number, signal: AbortSignal) => Promise<void>,
        maxPage: number,
        abortRequest: AbortableRequest['abortRequest'],
        signal: AbortSignal,
    ): Promise<void> {
        setRevalidationDone(true);

        const [currRevVars, currRevPromise, currRevAbortRequest] = activeRevalidationRef ?? [];

        const isActiveRevalidationForInput = JSON.stringify(currRevVars) === JSON.stringify(getVariablesFor(0));

        setValidating(true);

        if (!isActiveRevalidationForInput) {
            currRevAbortRequest?.(new Error('Abort revalidation for different input'));
        }

        let revalidationPromise = currRevPromise;
        if (!isActiveRevalidationForInput) {
            revalidationPromise = revalidatePage(1, maxPage, signal);
            setActiveRevalidation([getVariablesFor(0), revalidationPromise, abortRequest]);
        }

        try {
            await revalidationPromise;
            setActiveRevalidation(null);
        } catch (e) {
            // ignore
        } finally {
            setValidating(false);
        }
    }

    private async fetchPaginatedMutationPage<
        Data = any,
        Variables extends OperationVariables = OperationVariables,
        ResultIdInfo extends Record<string, any> = any,
    >(
        getVariablesFor: (page: number) => Variables,
        setAbortRequest: (abortRequest: AbortableRequest['abortRequest']) => void,
        getResultIdInfo: () => ResultIdInfo,
        createPaginatedResult: (
            result: Partial<AbortableApolloUseMutationPaginatedResponse<Data, Variables>[1][number]>,
        ) => AbortableApolloUseMutationPaginatedResponse<Data, Variables>[1][number],
        setResult: (
            result: AbortableApolloUseMutationPaginatedResponse<Data, Variables>[1][number] & ResultIdInfo,
        ) => void,
        revalidate: (
            maxPage: number,
            abortRequest: AbortableRequest['abortRequest'],
            signal: AbortSignal,
        ) => Promise<void>,
        options: ApolloPaginatedMutationOptions<Data, Variables> | undefined,
        documentNode: DocumentNode,
        cachePagesKey: string,
        cacheResultsKey: string,
        cachedPages: Set<number>,
        newPage: number,
    ): Promise<FetchResult<Data>> {
        const basePaginatedResult: Partial<AbortableApolloUseMutationPaginatedResponse<Data, Variables>[1][number]> = {
            size: newPage,
            isLoading: false,
            isLoadingMore: false,
            called: true,
        };

        let response: FetchResult<Data> = {};
        try {
            const { signal, abortRequest } = this.createAbortController();
            setAbortRequest(abortRequest);

            setResult({
                ...getResultIdInfo(),
                ...createPaginatedResult({ isLoading: true, abortRequest, size: newPage, called: true }),
            });

            if (newPage !== 1 && cachedPages.size) {
                await revalidate(newPage, abortRequest, signal);
            }

            const { response: request } = this.doRequestNew<Data, Variables>(
                GQLMethod.MUTATION,
                documentNode,
                getVariablesFor(newPage),
                { ...options, context: { fetchOptions: { signal } } },
            );

            response = await request;

            basePaginatedResult.data = response.data;
        } catch (error: any) {
            if (error instanceof ApolloError) {
                basePaginatedResult.error = error;
            } else {
                basePaginatedResult.error = new ApolloError({
                    errorMessage: error?.message ?? error.toString(),
                    extraInfo: error,
                });
            }
        }

        const fetchPaginatedResult = {
            ...getResultIdInfo(),
            ...createPaginatedResult(basePaginatedResult),
        };

        setResult(fetchPaginatedResult);

        const shouldCacheResult = !fetchPaginatedResult.error;
        if (shouldCacheResult) {
            const currentCachedPages = this.cache.getResponseFor<Set<number>>(cachePagesKey, getVariablesFor(0)) ?? [];
            this.cache.cacheResponse(cachePagesKey, getVariablesFor(0), new Set([...currentCachedPages, newPage]));
            this.cache.cacheResponse(cacheResultsKey, getVariablesFor(newPage), fetchPaginatedResult);
        }

        return response;
    }

    private fetchInitialPages<Data = any, Variables extends OperationVariables = OperationVariables>(
        options: ApolloPaginatedMutationOptions<Data, Variables> | undefined,
        areFetchingInitialPages: boolean,
        areInitialPagesFetched: boolean,
        setRevalidationDone: (isDone: boolean) => void,
        cacheInitialPagesKey: string,
        getVariablesFor: (page: number) => Variables,
        initialPages: number,
        fetchPage: (page: number) => Promise<FetchResult<Data>>,
        hasNextPage: (result: FetchResult<Data>) => boolean,
    ): void {
        const shouldFetchInitialPages = !options?.skipRequest && !areFetchingInitialPages && !areInitialPagesFetched;
        if (shouldFetchInitialPages) {
            setRevalidationDone(true);
            this.cache.cacheResponse(cacheInitialPagesKey, getVariablesFor(0), true);

            const loadInitialPages = async (initialPage: number) => {
                const areAllPagesFetched = initialPage > initialPages;
                if (areAllPagesFetched) {
                    return;
                }

                const pageResult = await fetchPage(initialPage);

                if (hasNextPage(pageResult)) {
                    await loadInitialPages(initialPage + 1);
                }
            };

            loadInitialPages(1);
        }
    }

    private returnPaginatedMutationResult<Data = any, Variables extends OperationVariables = OperationVariables>(
        areInitialPagesFetched: boolean,
        cachedResults: AbortableApolloUseMutationPaginatedResponse<Data, Variables>[1][number][],
        getVariablesFor: (page: number) => Variables,
        paginatedResult: AbortableApolloUseMutationPaginatedResponse<Data, Variables>[1][number],
        fetchPage: (page: number) => Promise<FetchResult<Data>>,
        hasCachedResult: boolean,
        createPaginatedResult: (
            result: Partial<AbortableApolloUseMutationPaginatedResponse<Data, Variables>[1][number]>,
        ) => AbortableApolloUseMutationPaginatedResponse<Data, Variables>[1][number],
    ): AbortableApolloUseMutationPaginatedResponse<Data, Variables> {
        const doCachedResultsExist = areInitialPagesFetched && cachedResults.length;
        if (!doCachedResultsExist) {
            return [fetchPage, [paginatedResult]];
        }

        const areAllPagesCached = doCachedResultsExist && hasCachedResult;
        if (!areAllPagesCached) {
            return [fetchPage, [...cachedResults, paginatedResult]];
        }

        return [
            fetchPage,
            [
                ...cachedResults.slice(0, cachedResults.length - 1),
                createPaginatedResult({
                    ...cachedResults[cachedResults.length - 1],
                    isValidating: paginatedResult.isValidating,
                }),
            ],
        ];
    }

    private revalidateInitialPages<Variables extends OperationVariables = OperationVariables>(
        isRevalidationDone: boolean,
        cachedResultsLength: number,
        cachedPages: Set<number>,
        setRevalidationDone: (isDone: boolean) => void,
        getVariablesFor: (page: number) => Variables,
        triggerRerender: () => void,
        revalidate: (
            maxPage: number,
            abortRequest: AbortableRequest['abortRequest'],
            signal: AbortSignal,
        ) => Promise<void>,
    ): void {
        const isMountedRef = useRef(false);

        useEffect(() => {
            const isRevalidationRequired = isMountedRef.current && cachedResultsLength;
            if (!isRevalidationRequired) {
                return;
            }

            setRevalidationDone(false);
            triggerRerender();
        }, [JSON.stringify(getVariablesFor(0))]);

        useEffect(() => {
            const shouldRevalidateData = isMountedRef.current && !isRevalidationDone && cachedResultsLength;
            if (shouldRevalidateData) {
                setRevalidationDone(true);

                const { signal, abortRequest } = this.createAbortController();
                revalidate(Math.max(...cachedPages), abortRequest, signal);
            }
        }, [isMountedRef.current, isRevalidationDone]);

        useEffect(() => {
            isMountedRef.current = true;
        }, []);
    }

    public getValidImgUrlFor(imageUrl: string, apiVersion: string = ''): string {
        const useCache = storage.getItem('useCache', true);
        const useCacheQuery = `?useCache=${useCache}`;
        // server provided image urls already contain the api version
        return `${this.getValidUrlFor(imageUrl, apiVersion)}${useCacheQuery}`;
    }

    private doRequestNew<Data, Variables extends OperationVariables = OperationVariables>(
        method: GQLMethod.QUERY,
        operation: DocumentNode | TypedDocumentNode<Data, Variables>,
        variables: Variables | undefined,
        options?: QueryOptions<Variables, Data>,
    ): AbortabaleApolloQueryResponse<Data>;

    private doRequestNew<Data, Variables extends OperationVariables = OperationVariables>(
        method: GQLMethod.USE_QUERY,
        operation: DocumentNode | TypedDocumentNode<Data, Variables>,
        variables: Variables | undefined,
        options?: QueryHookOptions<Data, Variables>,
    ): AbortableApolloUseQueryResponse<Data, Variables>;

    private doRequestNew<Data, Variables extends OperationVariables = OperationVariables>(
        method: GQLMethod.USE_MUTATION,
        operation: DocumentNode | TypedDocumentNode<Data, Variables>,
        variables: Variables | undefined,
        options?: MutationHookOptions<Data, Variables>,
    ): AbortableApolloUseMutationResponse<Data, Variables>;

    private doRequestNew<Data, Variables extends OperationVariables = OperationVariables>(
        method: GQLMethod.MUTATION,
        operation: DocumentNode | TypedDocumentNode<Data, Variables>,
        variables: Variables | undefined,
        options?: MutationOptions<Data, Variables>,
    ): AbortableApolloMutationResponse<Data>;

    private doRequestNew<Data, Variables extends OperationVariables = OperationVariables>(
        method: GQLMethod.USE_SUBSCRIPTION,
        operation: DocumentNode | TypedDocumentNode<Data, Variables>,
        variables: Variables | undefined,
        options?: SubscriptionHookOptions<Data, Variables>,
    ): SubscriptionResult<Data, Variables>;

    private doRequestNew<Data, Variables extends OperationVariables = OperationVariables>(
        method: GQLMethod,
        operation: DocumentNode | TypedDocumentNode<Data, Variables>,
        variables: Variables | undefined,
        options?:
            | QueryOptions<Variables, Data>
            | QueryHookOptions<Data, Variables>
            | MutationHookOptions<Data, Variables>
            | MutationOptions<Data, Variables>
            | SubscriptionHookOptions<Data, Variables>,
    ):
        | AbortabaleApolloQueryResponse<Data>
        | AbortableApolloUseQueryResponse<Data, Variables>
        | AbortableApolloUseMutationResponse<Data, Variables>
        | AbortableApolloMutationResponse<Data>
        | SubscriptionResult<Data, Variables> {
        const { signal, abortRequest } = this.createAbortController();
        switch (method) {
            case GQLMethod.QUERY:
                return {
                    response: this.graphQLClient.client.query<Data, Variables>({
                        query: operation,
                        variables,
                        ...(options as QueryOptions<Variables, Data>),
                        context: {
                            ...options?.context,
                            fetchOptions: {
                                signal: options?.omitAbortSignal ? undefined : signal,
                                ...options?.context?.fetchOptions,
                            },
                        },
                    }),
                    abortRequest,
                };
            case GQLMethod.USE_QUERY:
                return {
                    ...useQuery<Data, Variables>(operation, {
                        variables,
                        client: this.graphQLClient.client,
                        ...options,
                        context: {
                            ...options?.context,
                            fetchOptions: {
                                signal: options?.omitAbortSignal ? undefined : signal,
                                ...options?.context?.fetchOptions,
                            },
                        },
                    }),
                    abortRequest,
                };
            case GQLMethod.USE_MUTATION:
                // eslint-disable-next-line no-case-declarations
                const mutationResult = useMutation<Data, Variables>(operation, {
                    variables,
                    client: this.graphQLClient.client,
                    ...(options as MutationHookOptions<Data, Variables>),
                    context: {
                        ...options?.context,
                        fetchOptions: {
                            signal: options?.omitAbortSignal ? undefined : signal,
                            ...options?.context?.fetchOptions,
                        },
                    },
                });

                return [mutationResult[0], { ...mutationResult[1], abortRequest }];
            case GQLMethod.MUTATION:
                return {
                    response: this.graphQLClient.client.mutate<Data, Variables>({
                        mutation: operation,
                        variables,
                        ...(options as MutationOptions<Data, Variables>),
                        context: {
                            ...options?.context,
                            fetchOptions: {
                                signal: options?.omitAbortSignal ? undefined : signal,
                                ...options?.context?.fetchOptions,
                            },
                        },
                    }),
                    abortRequest,
                };
            case GQLMethod.USE_SUBSCRIPTION:
                return useSubscription<Data, Variables>(operation, {
                    client: this.graphQLClient.client,
                    variables,
                    ...(options as SubscriptionHookOptions<Data, Variables>),
                });
            default:
                throw new Error(`unexpected GQLRequest type "${method}"`);
        }
    }

    public useGetGlobalMeta(
        options?: QueryHookOptions<GetGlobalMetadatasQuery, GetGlobalMetadatasQueryVariables>,
    ): AbortableApolloUseQueryResponse<GetGlobalMetadatasQuery, GetGlobalMetadatasQueryVariables> {
        return this.doRequestNew(GQLMethod.USE_QUERY, GET_GLOBAL_METADATAS, {}, options);
    }

    public setGlobalMetadata(
        key: string,
        value: any,
        options?: MutationOptions<SetGlobalMetadataMutation, SetGlobalMetadataMutationVariables>,
    ): AbortableApolloMutationResponse<SetGlobalMetadataMutation> {
        return this.doRequestNew<SetGlobalMetadataMutation, SetGlobalMetadataMutationVariables>(
            GQLMethod.MUTATION,
            SET_GLOBAL_METADATA,
            { input: { meta: { key, value: `${value}` } } },
            { refetchQueries: [GET_GLOBAL_METADATA, GET_GLOBAL_METADATAS], ...options },
        );
    }

    public useGetAbout(
        options?: QueryHookOptions<GetAboutQuery, GetAboutQueryVariables>,
    ): AbortableApolloUseQueryResponse<GetAboutQuery, GetAboutQueryVariables> {
        return this.doRequestNew(GQLMethod.USE_QUERY, GET_ABOUT, {}, options);
    }

    public useCheckForUpdate(
        options?: QueryHookOptions<CheckForServerUpdatesQuery, CheckForServerUpdatesQueryVariables>,
    ): AbortableApolloUseQueryResponse<CheckForServerUpdatesQuery, CheckForServerUpdatesQueryVariables> {
        return this.doRequestNew(GQLMethod.USE_QUERY, CHECK_FOR_SERVER_UPDATES, {}, options);
    }

    public useGetExtensionList(
        options?: QueryHookOptions<GetExtensionsQuery, GetExtensionsQueryVariables>,
    ): AbortableApolloUseQueryResponse<GetExtensionsQuery, GetExtensionsQueryVariables> {
        return this.doRequestNew(GQLMethod.USE_QUERY, GET_EXTENSIONS, {}, options);
    }

    public useExtensionListFetch(
        options?: MutationHookOptions<GetExtensionsFetchMutation, GetExtensionsFetchMutationVariables>,
    ): AbortableApolloUseMutationResponse<GetExtensionsFetchMutation, GetExtensionsFetchMutationVariables> {
        return this.doRequestNew(GQLMethod.USE_MUTATION, GET_EXTENSIONS_FETCH, {}, options);
    }

    public installExternalExtension(
        extensionFile: File,
        options?: MutationOptions<InstallExternalExtensionMutation, InstallExternalExtensionMutationVariables>,
    ): AbortableApolloMutationResponse<InstallExternalExtensionMutation> {
        return this.doRequestNew<InstallExternalExtensionMutation, InstallExternalExtensionMutationVariables>(
            GQLMethod.MUTATION,
            INSTALL_EXTERNAL_EXTENSION,
            { file: extensionFile },
            { refetchQueries: [GET_EXTENSION, GET_EXTENSIONS], ...options },
        );
    }

    public updateExtension(
        id: string,
        patch: UpdateExtensionPatchInput,
        options?: MutationOptions<UpdateExtensionMutation, UpdateExtensionMutationVariables>,
    ): AbortableApolloMutationResponse<UpdateExtensionMutation> {
        return this.doRequestNew<UpdateExtensionMutation, UpdateExtensionMutationVariables>(
            GQLMethod.MUTATION,
            UPDATE_EXTENSION,
            { input: { id, patch } },
            { refetchQueries: [GET_EXTENSION, GET_EXTENSIONS, GET_SOURCES], ...options },
        );
    }

    public getExtensionIconUrl(extension: string): string {
        return this.getValidImgUrlFor(`extension/icon/${extension}`);
    }

    public useGetSourceList(
        options?: QueryHookOptions<GetSourcesQuery, GetSourcesQueryVariables>,
    ): AbortableApolloUseQueryResponse<GetSourcesQuery, GetSourcesQueryVariables> {
        return this.doRequestNew(GQLMethod.USE_QUERY, GET_SOURCES, {}, options);
    }

    public useGetSource(
        id: string,
        options?: QueryHookOptions<GetSourceQuery, GetSourceQueryVariables>,
    ): AbortableApolloUseQueryResponse<GetSourceQuery, GetSourceQueryVariables> {
        return this.doRequestNew(GQLMethod.USE_QUERY, GET_SOURCE, { id }, options);
    }

    public useGetSourceMangas(
        input: FetchSourceMangaInput,
        initialPages: number = 1,
        options?: ApolloPaginatedMutationOptions<GetSourceMangasFetchMutation, GetSourceMangasFetchMutationVariables>,
    ): AbortableApolloUseMutationPaginatedResponse<
        GetSourceMangasFetchMutation,
        GetSourceMangasFetchMutationVariables
    > {
        type MutationResult = AbortableApolloUseMutationPaginatedResponse<
            GetSourceMangasFetchMutation,
            GetSourceMangasFetchMutationVariables
        >[1];
        type MutationDataResult = MutationResult[number];

        const createPaginatedResult = (
            result?: Partial<AbortableApolloUseMutationPaginatedResponse[1][number]> | null,
            page?: number,
        ) => this.createPaginatedResult(result, input.page, page);

        const getVariablesFor = (page: number): GetSourceMangasFetchMutationVariables => ({
            input: {
                ...input,
                page,
            },
        });

        const CACHE_INITIAL_PAGES_FETCHING_KEY = 'GET_SOURCE_MANGAS_FETCH_FETCHING_INITIAL_PAGES';
        const CACHE_PAGES_KEY = 'GET_SOURCE_MANGAS_FETCH_PAGES';
        const CACHE_RESULTS_KEY = 'GET_SOURCE_MANGAS_FETCH';

        const isRevalidationDoneRef = useRef(false);
        const activeRevalidationRef = useRef<
            | [
                  ForInput: GetSourceMangasFetchMutationVariables,
                  Request: Promise<unknown>,
                  AbortRequest: AbortableRequest['abortRequest'],
              ]
            | null
        >(null);
        const abortRequestRef = useRef<AbortableRequest['abortRequest']>(() => {});
        const resultRef = useRef<(MutationDataResult & { forInput: string }) | null>(null);
        const result = resultRef.current;

        const [, setTriggerRerender] = useState(0);
        const triggerRerender = () => setTriggerRerender((prev) => prev + 1);
        const setResult = (nextResult: typeof resultRef.current) => {
            resultRef.current = nextResult;
            triggerRerender();
        };

        const cachedPages = this.cache.getResponseFor<Set<number>>(CACHE_PAGES_KEY, getVariablesFor(0)) ?? new Set();
        const cachedResults = [...cachedPages]
            .map(
                (cachedPage) =>
                    this.cache.getResponseFor<MutationDataResult>(CACHE_RESULTS_KEY, getVariablesFor(cachedPage))!,
            )
            .sort((a, b) => a.size - b.size);
        const areFetchingInitialPages = !!this.cache.getResponseFor<boolean>(
            CACHE_INITIAL_PAGES_FETCHING_KEY,
            getVariablesFor(0),
        );

        const areInitialPagesFetched = cachedResults.length >= initialPages;
        const isResultForCurrentInput = result?.forInput === JSON.stringify(getVariablesFor(0));
        const lastPage = cachedPages.size ? Math.max(...cachedPages) : input.page;
        const nextPage = isResultForCurrentInput ? result.size : lastPage;

        const paginatedResult =
            isResultForCurrentInput && areInitialPagesFetched ? result : createPaginatedResult(undefined, nextPage);
        paginatedResult.abortRequest = abortRequestRef.current;

        // make sure that the result is always for the current input
        resultRef.current = { forInput: JSON.stringify(getVariablesFor(0)), ...paginatedResult };

        const hasCachedResult = !!this.cache.getResponseFor(CACHE_RESULTS_KEY, getVariablesFor(nextPage));

        const revalidatePage = async (pageToRevalidate: number, maxPage: number, signal: AbortSignal) =>
            this.revalidatePage(
                CACHE_RESULTS_KEY,
                CACHE_PAGES_KEY,
                getVariablesFor,
                options,
                (cachedResult, revalidatedResult) =>
                    !cachedResult ||
                    !cachedResult.data?.fetchSourceManga.mangas.length ||
                    cachedResult.data.fetchSourceManga.mangas.some(
                        (manga, index) => manga.id !== revalidatedResult.data?.fetchSourceManga.mangas[index]?.id,
                    ),
                (revalidatedResult) => !!revalidatedResult.data?.fetchSourceManga.hasNextPage,
                pageToRevalidate,
                maxPage,
                signal,
            );

        const revalidate = async (
            maxPage: number,
            abortRequest: AbortableRequest['abortRequest'],
            signal: AbortSignal,
        ) =>
            this.revalidatePages(
                activeRevalidationRef.current,
                (isDone) => {
                    isRevalidationDoneRef.current = isDone;
                },
                (activeRevalidation) => {
                    activeRevalidationRef.current = activeRevalidation;
                },
                getVariablesFor,
                (isValidating) => {
                    setResult({
                        ...createPaginatedResult(resultRef.current),
                        isValidating,
                        forInput: JSON.stringify(getVariablesFor(0)),
                    });
                },
                revalidatePage,
                maxPage,
                abortRequest,
                signal,
            );

        // wrap "mutate" function to align with the expected type, which allows only passing a "page" argument
        const wrappedMutate = async (newPage: number) =>
            this.fetchPaginatedMutationPage<GetSourceMangasFetchMutation, GetSourceMangasFetchMutationVariables>(
                getVariablesFor,
                (abortRequest) => {
                    abortRequestRef.current = abortRequest;
                },
                () => ({ forType: input.type, forQuery: input.query }),
                createPaginatedResult,
                setResult,
                revalidate,
                options,
                GET_SOURCE_MANGAS_FETCH,
                CACHE_PAGES_KEY,
                CACHE_RESULTS_KEY,
                cachedPages,
                newPage,
            );

        this.fetchInitialPages(
            options,
            areFetchingInitialPages,
            areInitialPagesFetched,
            (isDone) => {
                isRevalidationDoneRef.current = isDone;
            },
            CACHE_INITIAL_PAGES_FETCHING_KEY,
            getVariablesFor,
            initialPages,
            wrappedMutate,
            (fetchedResult) => !!fetchedResult.data?.fetchSourceManga.hasNextPage,
        );

        this.revalidateInitialPages(
            isRevalidationDoneRef.current,
            cachedResults.length,
            cachedPages,
            (isDone) => {
                isRevalidationDoneRef.current = isDone;
            },
            getVariablesFor,
            triggerRerender,
            revalidate,
        );

        return this.returnPaginatedMutationResult(
            areInitialPagesFetched,
            cachedResults,
            getVariablesFor,
            paginatedResult,
            wrappedMutate,
            hasCachedResult,
            createPaginatedResult,
        );
    }

    public useGetSourcePopularMangas(
        sourceId: string,
        initialPages?: number,
        options?: ApolloPaginatedMutationOptions<GetSourceMangasFetchMutation, GetSourceMangasFetchMutationVariables>,
    ): AbortableApolloUseMutationPaginatedResponse<
        GetSourceMangasFetchMutation,
        GetSourceMangasFetchMutationVariables
    > {
        return this.useGetSourceMangas(
            { type: FetchSourceMangaType.Popular, source: sourceId, page: 1 },
            initialPages,
            options,
        );
    }

    public useGetSourceLatestMangas(
        sourceId: string,
        initialPages?: number,
        options?: ApolloPaginatedMutationOptions<GetSourceMangasFetchMutation, GetSourceMangasFetchMutationVariables>,
    ): AbortableApolloUseMutationPaginatedResponse<
        GetSourceMangasFetchMutation,
        GetSourceMangasFetchMutationVariables
    > {
        return this.useGetSourceMangas(
            { type: FetchSourceMangaType.Latest, source: sourceId, page: 1 },
            initialPages,
            options,
        );
    }

    public setSourcePreferences(
        source: string,
        change: SourcePreferenceChangeInput,
        options?: MutationOptions<UpdateSourcePreferencesMutation, UpdateSourcePreferencesMutationVariables>,
    ): AbortableApolloMutationResponse<UpdateSourcePreferencesMutation> {
        return this.doRequestNew(
            GQLMethod.MUTATION,
            UPDATE_SOURCE_PREFERENCES,
            { input: { source, change } },
            {
                refetchQueries: [GET_SOURCE],
                ...options,
            },
        );
    }

    public useSourceSearch(
        source: string,
        query?: string,
        filters?: FilterChangeInput[],
        initialPages?: number,
        options?: ApolloPaginatedMutationOptions<GetSourceMangasFetchMutation, GetSourceMangasFetchMutationVariables>,
    ): AbortableApolloUseMutationPaginatedResponse<
        GetSourceMangasFetchMutation,
        GetSourceMangasFetchMutationVariables
    > {
        return this.useGetSourceMangas(
            { type: FetchSourceMangaType.Search, source, query, filters, page: 1 },
            initialPages,
            options,
        );
    }

    public useGetManga(
        mangaId: number | string,
        options?: QueryHookOptions<GetMangaQuery, GetMangaQueryVariables>,
    ): AbortableApolloUseQueryResponse<GetMangaQuery, GetMangaQueryVariables> {
        return this.doRequestNew(GQLMethod.USE_QUERY, GET_MANGA, { id: Number(mangaId) }, options);
    }

    public getMangaFetch(
        mangaId: number | string,
        options?: MutationOptions<GetMangaFetchMutation, GetMangaFetchMutationVariables>,
    ): AbortableApolloMutationResponse<GetMangaFetchMutation> {
        return this.doRequestNew<GetMangaFetchMutation, GetMangaFetchMutationVariables>(
            GQLMethod.MUTATION,
            GET_MANGA_FETCH,
            {
                input: {
                    id: Number(mangaId),
                },
            },
            {
                refetchQueries: [GET_MANGA, GET_MANGAS],
                ...options,
            },
        );
    }

    public getMangaThumbnailUrl(mangaId: number): string {
        return this.getValidImgUrlFor(`manga/${mangaId}/thumbnail`);
    }

    public useUpdateMangaCategories(
        options?: MutationHookOptions<UpdateMangaCategoriesMutation, UpdateMangaCategoriesMutationVariables>,
    ): AbortableApolloUseMutationResponse<UpdateMangaCategoriesMutation, UpdateMangaCategoriesMutationVariables> {
        return this.doRequestNew(GQLMethod.USE_MUTATION, UPDATE_MANGA_CATEGORIES, undefined, {
            refetchQueries: [GET_MANGA, GET_MANGAS, GET_CATEGORY, GET_CATEGORIES, GET_CATEGORY_MANGAS],
            ...options,
        });
    }

    public updateManga(
        id: number,
        patch: UpdateMangaPatchInput,
        options?: MutationHookOptions<UpdateMangaMutation, UpdateMangaMutationVariables>,
    ): AbortableApolloMutationResponse<UpdateMangaMutation> {
        return this.doRequestNew<UpdateMangaMutation, UpdateMangaMutationVariables>(
            GQLMethod.MUTATION,
            UPDATE_MANGA,
            { input: { id, patch } },
            {
                refetchQueries: [
                    GET_MANGA,
                    GET_MANGAS,
                    GET_CATEGORY_MANGAS,
                    GET_CATEGORY,
                    GET_CATEGORIES,
                    GET_SOURCE_MANGAS_FETCH,
                ],
                ...options,
            },
        );
    }

    public setMangaMeta(
        mangaId: number,
        key: string,
        value: any,
        options?: MutationOptions<SetMangaMetadataMutation, SetMangaMetadataMutationVariables>,
    ): AbortableApolloMutationResponse<SetMangaMetadataMutation> {
        return this.doRequestNew(
            GQLMethod.MUTATION,
            SET_MANGA_METADATA,
            {
                input: { meta: { mangaId, key, value: `${value}` } },
            },
            { refetchQueries: [GET_MANGA, GET_MANGAS, GET_CATEGORY_MANGAS, GET_SOURCE_MANGAS_FETCH], ...options },
        );
    }

    public useGetChapters(
        variables: GetChaptersQueryVariables,
        options?: QueryHookOptions<GetChaptersQuery, GetChaptersQueryVariables>,
    ): AbortableApolloUseQueryResponse<GetChaptersQuery, GetChaptersQueryVariables> {
        return this.doRequestNew(GQLMethod.USE_QUERY, GET_CHAPTERS, variables, options);
    }

    public useGetMangaChapters(
        mangaId: number | string,
        options?: QueryHookOptions<GetChaptersQuery, GetChaptersQueryVariables>,
    ): AbortableApolloUseQueryResponse<GetChaptersQuery, GetChaptersQueryVariables> {
        return this.useGetChapters(
            {
                condition: { mangaId: Number(mangaId) },
                orderBy: ChapterOrderBy.SourceOrder,
                orderByType: SortOrder.Desc,
            },
            options,
        );
    }

    public getMangaChaptersFetch(
        mangaId: number | string,
        options?: MutationOptions<GetMangaChaptersFetchMutation, GetMangaChaptersFetchMutationVariables>,
    ): AbortableApolloMutationResponse<GetMangaChaptersFetchMutation> {
        return this.doRequestNew<GetMangaChaptersFetchMutation, GetMangaChaptersFetchMutationVariables>(
            GQLMethod.MUTATION,
            GET_MANGA_CHAPTERS_FETCH,
            { input: { mangaId: Number(mangaId) } },
            { refetchQueries: [GET_MANGA, GET_MANGAS, GET_CHAPTER, GET_CHAPTERS], ...options },
        );
    }

    public useGetMangaChapter(
        mangaId: number | string,
        chapterIndex: number | string,
        options?: QueryHookOptions<GetChaptersQuery, GetChaptersQueryVariables>,
    ): AbortableApolloUseQueryResponse<
        Omit<GetChaptersQuery, 'chapters'> & { chapter: GetChaptersQuery['chapters']['nodes'][number] },
        GetChaptersQueryVariables
    > {
        type Response = AbortableApolloUseQueryResponse<
            Omit<GetChaptersQuery, 'chapters'> & { chapter: GetChaptersQuery['chapters']['nodes'][number] },
            GetChaptersQueryVariables
        >;

        const chapterResponse = this.useGetChapters(
            { condition: { mangaId: Number(mangaId), sourceOrder: Number(chapterIndex) } },
            options,
        );

        if (!chapterResponse.data) {
            return chapterResponse as unknown as Response;
        }

        return {
            ...chapterResponse,
            data: {
                chapter: chapterResponse.data.chapters.nodes[0],
            },
        } as unknown as Response;
    }

    public getChapter(
        mangaId: number | string,
        chapterIndex: number | string,
        options?: QueryOptions<GetChaptersQueryVariables, GetChaptersQuery>,
    ): AbortabaleApolloQueryResponse<
        Omit<GetChaptersQuery, 'chapters'> & { chapter: GetChaptersQuery['chapters']['nodes'][number] }
    > {
        type ResponseData = Omit<GetChaptersQuery, 'chapters'> & {
            chapter: GetChaptersQuery['chapters']['nodes'][number];
        };

        const chapterRequest = this.doRequestNew<GetChaptersQuery, GetChaptersQueryVariables>(
            GQLMethod.QUERY,
            GET_CHAPTERS,
            {
                condition: { mangaId: Number(mangaId), sourceOrder: Number(chapterIndex) },
            },
            options,
        );

        return {
            ...chapterRequest,
            response: chapterRequest.response.then((chapterResponse) => {
                if (!chapterResponse.data) {
                    return chapterResponse;
                }

                return {
                    ...chapterResponse,
                    data: {
                        chapter: chapterResponse.data.chapters.nodes[0],
                    },
                };
            }) as Promise<ApolloQueryResult<ResponseData>>,
        };
    }

    public useGetChapterPagesFetch(
        chapterId: string | number,
        options?: MutationHookOptions<GetChapterPagesFetchMutation, GetChapterPagesFetchMutationVariables>,
    ): AbortableApolloUseMutationResponse<GetChapterPagesFetchMutation, GetChapterPagesFetchMutationVariables> {
        return this.doRequestNew(
            GQLMethod.USE_MUTATION,
            GET_CHAPTER_PAGES_FETCH,
            {
                input: { chapterId: Number(chapterId) },
            },
            { refetchQueries: [GET_CHAPTER, GET_CHAPTERS], ...options },
        );
    }

    public deleteDownloadedChapter(
        id: number,
        options?: MutationOptions<DeleteDownloadedChapterMutation, DeleteDownloadedChapterMutationVariables>,
    ): AbortableApolloMutationResponse<DeleteDownloadedChapterMutation> {
        return this.doRequestNew<DeleteDownloadedChapterMutation, DeleteDownloadedChapterMutationVariables>(
            GQLMethod.MUTATION,
            DELETE_DOWNLOADED_CHAPTER,
            { input: { id } },
            { refetchQueries: [GET_MANGA, GET_MANGAS, GET_CATEGORY_MANGAS, GET_CHAPTERS], ...options },
        );
    }

    public deleteDownloadedChapters(
        ids: number[],
        options?: MutationOptions<DeleteDownloadedChaptersMutation, DeleteDownloadedChaptersMutationVariables>,
    ): AbortableApolloMutationResponse<DeleteDownloadedChaptersMutation> {
        return this.doRequestNew<DeleteDownloadedChaptersMutation, DeleteDownloadedChaptersMutationVariables>(
            GQLMethod.MUTATION,
            DELETE_DOWNLOADED_CHAPTERS,
            { input: { ids } },
            { refetchQueries: [GET_MANGA, GET_MANGAS, GET_CATEGORY_MANGAS, GET_CHAPTERS], ...options },
        );
    }

    public updateChapter(
        id: number,
        patch: UpdateChapterPatchInput,
        options?: MutationOptions<UpdateChapterMutation, UpdateChapterMutationVariables>,
    ): AbortableApolloMutationResponse<UpdateChapterMutation> {
        return this.doRequestNew<UpdateChapterMutation, UpdateChapterMutationVariables>(
            GQLMethod.MUTATION,
            UPDATE_CHAPTER,
            { input: { id, patch } },
            { refetchQueries: [GET_MANGA, GET_MANGAS, GET_CATEGORY_MANGAS, GET_CHAPTER, GET_CHAPTERS], ...options },
        );
    }

    public setChapterMeta(
        chapterId: number,
        key: string,
        value: any,
        options?: MutationOptions<SetChapterMetadataMutation, SetChapterMetadataMutationVariables>,
    ): AbortableApolloMutationResponse<SetChapterMetadataMutation> {
        return this.doRequestNew<SetChapterMetadataMutation, SetChapterMetadataMutationVariables>(
            GQLMethod.MUTATION,
            SET_CHAPTER_METADATA,
            { input: { meta: { chapterId, key, value: `${value}` } } },
            { refetchQueries: [GET_CHAPTER, GET_CHAPTERS], ...options },
        );
    }

    public getChapterPageUrl(mangaId: number | string, chapterIndex: number | string, page: number): string {
        return this.getValidImgUrlFor(
            `manga/${mangaId}/chapter/${chapterIndex}/page/${page}`,
            RequestManager.API_VERSION,
        );
    }

    public updateChapters(
        ids: number[],
        patch: UpdateChapterPatchInput,
        options?: MutationOptions<UpdateChaptersMutation, UpdateChaptersMutationVariables>,
    ): AbortableApolloMutationResponse<UpdateChaptersMutation> {
        return this.doRequestNew<UpdateChaptersMutation, UpdateChaptersMutationVariables>(
            GQLMethod.MUTATION,
            UPDATE_CHAPTERS,
            { input: { ids, patch } },
            { refetchQueries: [GET_MANGA, GET_MANGAS, GET_CATEGORY_MANGAS, GET_CHAPTER, GET_CHAPTERS], ...options },
        );
    }

    public useGetCategories(
        options?: QueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>,
    ): AbortableApolloUseQueryResponse<GetCategoriesQuery, GetCategoriesQueryVariables> {
        return this.doRequestNew<GetCategoriesQuery, GetCategoriesQueryVariables>(
            GQLMethod.USE_QUERY,
            GET_CATEGORIES,
            {
                orderBy: CategoryOrderBy.Order,
            },
            options,
        );
    }

    public createCategory(
        input: CreateCategoryInput,
        options?: MutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>,
    ): AbortableApolloMutationResponse<CreateCategoryMutation> {
        return this.doRequestNew<CreateCategoryMutation, CreateCategoryMutationVariables>(
            GQLMethod.MUTATION,
            CREATE_CATEGORY,
            { input },
            { refetchQueries: [GET_CATEGORIES], ...options },
        );
    }

    public reorderCategory(
        id: number,
        position: number,
        options?: MutationOptions<UpdateCategoryOrderMutation, UpdateCategoryOrderMutationVariables>,
    ): AbortableApolloMutationResponse<UpdateCategoryOrderMutation> {
        return this.doRequestNew<UpdateCategoryOrderMutation, UpdateCategoryOrderMutationVariables>(
            GQLMethod.MUTATION,
            UPDATE_CATEGORY_ORDER,
            { input: { id, position } },
            { refetchQueries: [GET_CATEGORIES], ...options },
        );
    }

    public useGetCategoryMangas(
        id: number,
        options?: QueryHookOptions<GetCategoryMangasQuery, GetCategoryMangasQueryVariables>,
    ): AbortableApolloUseQueryResponse<GetCategoryMangasQuery, GetCategoryMangasQueryVariables> {
        return this.doRequestNew(GQLMethod.USE_QUERY, GET_CATEGORY_MANGAS, { id }, options);
    }

    public deleteCategory(
        categoryId: number,
        options?: MutationOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>,
    ): AbortableApolloMutationResponse<DeleteCategoryMutation> {
        return this.doRequestNew<DeleteCategoryMutation, DeleteCategoryMutationVariables>(
            GQLMethod.MUTATION,
            DELETE_CATEGORY,
            { input: { categoryId } },
            { refetchQueries: [GET_MANGA, GET_MANGAS, GET_CATEGORIES], ...options },
        );
    }

    public updateCategory(
        id: number,
        patch: UpdateCategoryPatchInput,
        options?: MutationOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>,
    ): AbortableApolloMutationResponse<UpdateCategoryMutation> {
        return this.doRequestNew<UpdateCategoryMutation, UpdateCategoryMutationVariables>(
            GQLMethod.MUTATION,
            UPDATE_CATEGORY,
            { input: { id, patch } },
            { refetchQueries: [GET_CATEGORY, GET_CATEGORIES], ...options },
        );
    }

    public setCategoryMeta(
        categoryId: number,
        key: string,
        value: any,
        options?: MutationOptions<SetCategoryMetadataMutation, SetCategoryMetadataMutationVariables>,
    ): AbortableApolloMutationResponse<SetCategoryMetadataMutation> {
        return this.doRequestNew<SetCategoryMetadataMutation, SetCategoryMetadataMutationVariables>(
            GQLMethod.MUTATION,
            SET_CATEGORY_METADATA,
            { input: { meta: { categoryId, key, value: `${value}` } } },
            { refetchQueries: [GET_MANGA, GET_MANGAS, GET_CATEGORY, GET_CATEGORIES], ...options },
        );
    }

    public restoreBackupFile(
        file: File,
        options?: MutationOptions<RestoreBackupMutation, RestoreBackupMutationVariables>,
    ): AbortableApolloMutationResponse<RestoreBackupMutation> {
        return this.doRequestNew<RestoreBackupMutation, RestoreBackupMutationVariables>(
            GQLMethod.MUTATION,
            RESTORE_BACKUP,
            { input: { backup: file } },
            options,
        );
    }

    public useValidateBackupFile(
        file: File,
        options?: QueryOptions<ValidateBackupQueryVariables, ValidateBackupQuery>,
    ): AbortabaleApolloQueryResponse<ValidateBackupQuery> {
        return this.doRequestNew(GQLMethod.QUERY, VALIDATE_BACKUP, { input: { backup: file } }, options);
    }

    public getExportBackupUrl(): string {
        return this.getValidUrlFor('backup/export/file');
    }

    public startDownloads(
        options?: MutationOptions<StartDownloaderMutation, StartDownloaderMutationVariables>,
    ): AbortableApolloMutationResponse<StartDownloaderMutation> {
        return this.doRequestNew<StartDownloaderMutation, StartDownloaderMutationVariables>(
            GQLMethod.MUTATION,
            START_DOWNLOADER,
            {},
            options,
        );
    }

    public stopDownloads(
        options?: MutationOptions<StopDownloaderMutation, StopDownloaderMutationVariables>,
    ): AbortableApolloMutationResponse<StopDownloaderMutation> {
        return this.doRequestNew<StopDownloaderMutation, StopDownloaderMutationVariables>(
            GQLMethod.MUTATION,
            STOP_DOWNLOADER,
            {},
            options,
        );
    }

    public clearDownloads(
        options?: MutationOptions<ClearDownloaderMutation, ClearDownloaderMutationVariables>,
    ): AbortableApolloMutationResponse<ClearDownloaderMutation> {
        return this.doRequestNew<ClearDownloaderMutation, ClearDownloaderMutationVariables>(
            GQLMethod.MUTATION,
            CLEAR_DOWNLOADER,
            {},
            { refetchQueries: [GET_DOWNLOAD_STATUS], ...options },
        );
    }

    public addChapterToDownloadQueue(
        id: number,
        options?: MutationOptions<EnqueueChapterDownloadMutation, EnqueueChapterDownloadMutationVariables>,
    ): AbortableApolloMutationResponse<EnqueueChapterDownloadMutation> {
        return this.doRequestNew<EnqueueChapterDownloadMutation, EnqueueChapterDownloadMutationVariables>(
            GQLMethod.MUTATION,
            ENQUEUE_CHAPTER_DOWNLOAD,
            { input: { id } },
            { refetchQueries: [GET_DOWNLOAD_STATUS], ...options },
        );
    }

    public removeChapterFromDownloadQueue(
        id: number,
        options?: MutationOptions<DequeueChapterDownloadMutation, DequeueChapterDownloadMutationVariables>,
    ): AbortableApolloMutationResponse<DequeueChapterDownloadMutation> {
        return this.doRequestNew<DequeueChapterDownloadMutation, DequeueChapterDownloadMutationVariables>(
            GQLMethod.MUTATION,
            DEQUEUE_CHAPTER_DOWNLOAD,
            { input: { id } },
            { refetchQueries: [GET_DOWNLOAD_STATUS], ...options },
        );
    }

    public reorderChapterInDownloadQueue(
        chapterId: number,
        position: number,
        options?: MutationOptions<ReorderChapterDownloadMutation, ReorderChapterDownloadMutationVariables>,
    ): AbortableApolloMutationResponse<ReorderChapterDownloadMutation> {
        return this.doRequestNew<ReorderChapterDownloadMutation, ReorderChapterDownloadMutationVariables>(
            GQLMethod.MUTATION,
            REORDER_CHAPTER_DOWNLOAD,
            { input: { chapterId, to: position } },
            { refetchQueries: [GET_DOWNLOAD_STATUS], ...options },
        );
    }

    public addChaptersToDownloadQueue(
        ids: number[],
        options?: MutationOptions<EnqueueChapterDownloadsMutation, EnqueueChapterDownloadsMutationVariables>,
    ): AbortableApolloMutationResponse<EnqueueChapterDownloadsMutation> {
        return this.doRequestNew<EnqueueChapterDownloadsMutation, EnqueueChapterDownloadsMutationVariables>(
            GQLMethod.MUTATION,
            ENQUEUE_CHAPTER_DOWNLOADS,
            { input: { ids } },
            { refetchQueries: [GET_DOWNLOAD_STATUS], ...options },
        );
    }

    public removeChaptersFromDownloadQueue(
        ids: number[],
        options?: MutationOptions<DequeueChapterDownloadsMutation, DequeueChapterDownloadsMutationVariables>,
    ): AbortableApolloMutationResponse<DequeueChapterDownloadsMutation> {
        return this.doRequestNew<DequeueChapterDownloadsMutation, DequeueChapterDownloadsMutationVariables>(
            GQLMethod.MUTATION,
            DEQUEUE_CHAPTER_DOWNLOADS,
            { input: { ids } },
            { refetchQueries: [GET_DOWNLOAD_STATUS], ...options },
        );
    }

    public useGetRecentlyUpdatedChapters(
        initialPages: number = 1,
        options?: QueryHookOptions<GetChaptersQuery, GetChaptersQueryVariables>,
    ): AbortableApolloUseQueryResponse<GetChaptersQuery, GetChaptersQueryVariables> {
        const PAGE_SIZE = 50;
        const CACHE_KEY = 'useGetRecentlyUpdatedChapters';

        const offset = this.cache.getResponseFor<number>(CACHE_KEY, undefined) ?? 0;
        const [lastOffset] = useState(offset);

        const result = this.useGetChapters(
            {
                filter: { inLibrary: { equalTo: true } },
                orderBy: ChapterOrderBy.FetchedAt,
                orderByType: SortOrder.Desc,
                first: initialPages * PAGE_SIZE + lastOffset,
            },
            options,
        );

        return {
            ...result,
            fetchMore: (...args: Parameters<(typeof result)['fetchMore']>) => {
                const fetchMoreOptions = args[0] ?? {};
                this.cache.cacheResponse(CACHE_KEY, undefined, fetchMoreOptions.variables?.offset);
                return result.fetchMore({
                    ...fetchMoreOptions,
                    variables: { first: PAGE_SIZE, ...fetchMoreOptions.variables },
                });
            },
        } as typeof result;
    }

    public startGlobalUpdate(
        categories?: undefined,
        options?: MutationOptions<UpdateLibraryMangasMutation, UpdateLibraryMangasMutationVariables>,
    ): AbortableApolloMutationResponse<UpdateLibraryMangasMutation>;

    public startGlobalUpdate(
        categories: number[],
        options?: MutationOptions<UpdateCategoryMangasMutation, UpdateCategoryMangasMutationVariables>,
    ): AbortableApolloMutationResponse<UpdateCategoryMangasMutation>;

    public startGlobalUpdate<
        Data extends UpdateLibraryMangasMutation | UpdateCategoryMangasMutation,
        Variables extends UpdateLibraryMangasMutationVariables | UpdateCategoryMangasMutationVariables,
    >(categories?: number[], options?: MutationOptions<Data, Variables>): AbortableApolloMutationResponse<Data> {
        if (categories?.length) {
            return this.doRequestNew<UpdateCategoryMangasMutation, UpdateCategoryMangasMutationVariables>(
                GQLMethod.MUTATION,
                UPDATE_CATEGORY_MANGAS,
                { input: { categories } },
                options as MutationOptions<UpdateCategoryMangasMutation, UpdateCategoryMangasMutationVariables>,
            ) as AbortableApolloMutationResponse<Data>;
        }

        return this.doRequestNew<UpdateLibraryMangasMutation, UpdateLibraryMangasMutationVariables>(
            GQLMethod.MUTATION,
            UPDATE_LIBRARY_MANGAS,
            {},
            options as MutationOptions<UpdateLibraryMangasMutation, UpdateLibraryMangasMutationVariables>,
        ) as AbortableApolloMutationResponse<Data>;
    }

    public resetGlobalUpdate(
        options?: MutationOptions<StopUpdaterMutation, StopUpdaterMutationVariables>,
    ): AbortableApolloMutationResponse<StopUpdaterMutation> {
        return this.doRequestNew<StopUpdaterMutation, StopUpdaterMutationVariables>(
            GQLMethod.MUTATION,
            STOP_UPDATER,
            {},
            options,
        );
    }

    public useGetGlobalUpdateSummary(
        options?: QueryHookOptions<GetUpdateStatusQuery, GetUpdateStatusQueryVariables>,
    ): AbortableApolloUseQueryResponse<GetUpdateStatusQuery, GetUpdateStatusQueryVariables> {
        return this.doRequestNew(GQLMethod.USE_QUERY, GET_UPDATE_STATUS, {}, options);
    }

    public useDownloadSubscription(
        options?: SubscriptionHookOptions<DownloadStatusSubscription, DownloadStatusSubscriptionVariables>,
    ): SubscriptionResult<DownloadStatusSubscription, DownloadStatusSubscriptionVariables> {
        return this.doRequestNew(GQLMethod.USE_SUBSCRIPTION, DOWNLOAD_STATUS_SUBSCRIPTION, {}, options);
    }

    public useUpdaterSubscription(
        options?: SubscriptionHookOptions<UpdaterSubscription, UpdaterSubscriptionVariables>,
    ): SubscriptionResult<UpdaterSubscription, UpdaterSubscriptionVariables> {
        return this.doRequestNew(GQLMethod.USE_SUBSCRIPTION, UPDATER_SUBSCRIPTION, {}, options);
    }
}

const requestManager = new RequestManager();
export default requestManager;
