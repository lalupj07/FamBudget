import 'package:flutter/material.dart';
import '../services/app_state.dart';
import '../utils/currency_format.dart';

class SearchOverlay extends StatefulWidget {
  const SearchOverlay({
    super.key,
    required this.state,
    required this.onClose,
    required this.onSelectTransaction,
    required this.onSelectAccount,
    required this.onSelectGoal,
  });

  final AppState state;
  final VoidCallback onClose;
  final VoidCallback onSelectTransaction;
  final VoidCallback onSelectAccount;
  final VoidCallback onSelectGoal;

  @override
  State<SearchOverlay> createState() => _SearchOverlayState();
}

class _SearchOverlayState extends State<SearchOverlay> {
  final _controller = TextEditingController();
  final _focusNode = FocusNode();
  String _query = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _focusNode.requestFocus());
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final result = widget.state.search(_query);
    final hasResults = result.transactions.isNotEmpty ||
        result.accounts.isNotEmpty ||
        result.goals.isNotEmpty;

    return Material(
      color: Theme.of(context).colorScheme.surface.withValues(alpha: 0.95),
      child: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: widget.onClose,
                  ),
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      focusNode: _focusNode,
                      decoration: const InputDecoration(
                        hintText: 'Search transactions, accounts, goals...',
                        border: InputBorder.none,
                      ),
                      onChanged: (v) => setState(() => _query = v),
                    ),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            Expanded(
              child: _query.trim().isEmpty
                  ? Center(
                      child: Text(
                        'Type to search',
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                            ),
                      ),
                    )
                  : !hasResults
                      ? Center(
                          child: Text(
                            'No results for "$_query"',
                            style: Theme.of(context).textTheme.bodyLarge,
                          ),
                        )
                      : ListView(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          children: [
                            if (result.transactions.isNotEmpty) ...[
                              Padding(
                                padding: const EdgeInsets.only(top: 8, bottom: 4),
                                child: Text(
                                  'Transactions',
                                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                                        color: Theme.of(context).colorScheme.primary,
                                      ),
                                ),
                              ),
                              ...result.transactions.take(15).map((t) => ListTile(
                                    leading: Icon(
                                      t.amount >= 0 ? Icons.arrow_downward_rounded : Icons.arrow_upward_rounded,
                                      color: t.amount >= 0 ? Colors.green : Colors.red,
                                    ),
                                    title: Text(t.description, maxLines: 1, overflow: TextOverflow.ellipsis),
                                    subtitle: Text('${t.category} • ${t.date.toString().split(' ')[0]}'),
                                    trailing: Text(
                                      formatCurrency(t.amount, widget.state.currency),
                                      style: TextStyle(
                                        color: t.amount >= 0 ? Colors.green : Colors.red,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    onTap: widget.onSelectTransaction,
                                  )),
                            ],
                            if (result.accounts.isNotEmpty) ...[
                              Padding(
                                padding: const EdgeInsets.only(top: 16, bottom: 4),
                                child: Text(
                                  'Accounts',
                                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                                        color: Theme.of(context).colorScheme.primary,
                                      ),
                                ),
                              ),
                              ...result.accounts.map((a) => ListTile(
                                    leading: const Icon(Icons.account_balance_wallet_rounded),
                                    title: Text(a.name),
                                    subtitle: Text(a.type),
                                    trailing: Text(formatCurrency(a.balance, widget.state.currency)),
                                    onTap: widget.onSelectAccount,
                                  )),
                            ],
                            if (result.goals.isNotEmpty) ...[
                              Padding(
                                padding: const EdgeInsets.only(top: 16, bottom: 4),
                                child: Text(
                                  'Goals',
                                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                                        color: Theme.of(context).colorScheme.primary,
                                      ),
                                ),
                              ),
                              ...result.goals.map((g) => ListTile(
                                    leading: const Icon(Icons.flag_rounded),
                                    title: Text(g.name),
                                    subtitle: Text(
                                        '${formatCurrency(g.currentAmount, widget.state.currency)} / ${formatCurrency(g.targetAmount, widget.state.currency)}'),
                                    onTap: widget.onSelectGoal,
                                  )),
                            ],
                          ],
                        ),
            ),
          ],
        ),
      ),
    );
  }
}
