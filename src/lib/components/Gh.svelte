<script lang="ts" module>
    import gh from "$svg/gh.svg";
    import type { Repository } from "$types";
</script>

<script lang="ts">
    let { repository }: { repository: Repository } = $props();
</script>

<a href={repository.url} target="_blank" rel="noreferrer" id="gh">
    {@html gh}
</a>
