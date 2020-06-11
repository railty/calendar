<script>
    export let label;
    export let icon = null;
</script>
<div class="field">
    <label class="label">{label}</label>
    <div class="control has-icons-left has-icons-right">
        <slot></slot>
        {#if icon}
            <span class="icon is-small is-left">
                <i class="fas fa-{icon}"></i>
            </span>
        {/if}
    </div>
</div>
